import { useState, useRef, useEffect } from 'react'
import { initialValue, rtc_configuration, default_constraints, websocketServerURL, generatePeerId, parseMessage } from './utils'

export default function ExamleWebRTC() {
  const [state, setState] = useState({ ...initialValue })
  function inputChange(event) {
    const { id, type, value, checked } = event.target
    setState({ ...state, [id]: 'checkbox' == type ? checked : value })
  }

  const ws_conn = useRef(null)
  const peer_connection = useRef(null)
  const receive_video = useRef(null)
  const send_video = useRef(null)

  useEffect(() => {
    peer_connection.current = new RTCPeerConnection(rtc_configuration)
    websocketServerConnect()
    return () => {
      if (ws_conn.current) ws_conn.current.close()
      if (peer_connection.current) peer_connection.current.close()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const websocketServerConnect = () => {
    if (state.connect_attempts > 2) {
      setState((prevState) => ({ ...prevState, connect_attempts: prevState.connect_attempts + 1 }))
      console.error('Too many connection attempts, aborting. Refresh page to try again')
      return
    }

    // Fetch the peer id to use
    let peer_id = generatePeerId()

    ws_conn.current = new WebSocket(websocketServerURL())
    ws_conn.current.onopen = () => {
      ws_conn.current.send('HELLO ' + peer_id)
      // Reset connection attempts because we connected successfully
      setState((prevState) => ({ ...prevState, 'peer-id': peer_id, 'peer-connect-button': 'Connect', connect_attempts: 0 }))
    }
    ws_conn.current.onmessage = async ({ type, data }) => {
      switch (data) {
        case 'HELLO':
          console.log(`receive <<< : ${data}`)
          return
        case 'SESSION_OK':
          console.log(`receive <<< : ${data}`)
          if (state['remote-offerer']) {
            ws_conn.current.send('OFFER_REQUEST')
            return
          }
          if (!state.callCreateTriggered) {
            createCall()
          }
          return
        case 'OFFER_REQUEST':
          console.log(`receive <<< : ${data}`)
          // The peer wants us to set up and then send an offer
          if (!state.callCreateTriggered) createCall()
          return
        default: {
          // Handle incoming JSON SDP and ICE messages
          const { sdp, ice } = parseMessage(data)
          if (sdp != null && ice != null) {
            console.error(`Unknown incoming JSON: ${type} : ${data}`)
            ws_conn.current.close()
            return
          }
          // Incoming JSON signals the beginning of a call
          if (!state.callCreateTriggered) createCall(sdp, ice)
          if (sdp != null) {
            console.log('receive <<< : ', sdp)
            try {
              // An offer may come in while we are busy processing SRD(answer).
              // In this case, we will be in "stable" by the time the offer is processed so it is safe to chain it on our Operations Chain now.
              const readyForOffer = !state.makingOffer && (peer_connection.current.signalingState == 'stable' || state.isSettingRemoteAnswerPending)
              const offerCollision = sdp.type == 'offer' && !readyForOffer
              if (offerCollision) {
                return
              }

              setState((prevState) => ({ ...prevState, isSettingRemoteAnswerPending: sdp.type == 'answer' }))
              await peer_connection.current.setRemoteDescription(sdp)
              setState((prevState) => ({ ...prevState, isSettingRemoteAnswerPending: false }))

              if (sdp.type == 'offer') {
                send_video.current = await navigator.mediaDevices.getUserMedia(default_constraints)
                for (const track of send_video.current.getTracks()) {
                  peer_connection.current.addTrack(track, send_video.current)
                }
                await peer_connection.current.setLocalDescription()
                ws_conn.current.send({ sdp: peer_connection.current.localDescription })
                if (peer_connection.current.iceConnectionState == 'connected') {
                  console.log(`SDP ${peer_connection.current.localDescription.type} sent, ICE connected, all looks OK`)
                }
              }
            } catch (err) {
              console.error(err)
              ws_conn.current.close()
            }
          }
          if (ice != null) {
            console.log('receive <<< : ', ice)
            try {
              // ICE candidate received from peer, add it to the peer connection
              await peer_connection.current.addIceCandidate(new RTCIceCandidate(ice))
            } catch (err) {
              console.error(err)
            }
          }
        }
      }
    }
    ws_conn.current.onclose = async () => {
      console.log('Disconnected from server')
      // Release the webcam and mic
      if (receive_video.current && receive_video.current.srcObject) {
        const tracks = receive_video.current.srcObject.getTracks()
        tracks.forEach((track) => track.stop())
      }
      const video = receive_video.current
      if (video != null) {
        if (video.srcObject != null) {
          for (const track of video.srcObject.getTracks()) {
            track.stop()
          }
        }
        video.style.display = 'none'
      }
      if (send_video.current) {
        for (const track of send_video.current.getTracks()) {
          track.stop()
        }
      }
      if (peer_connection.current) {
        peer_connection.current.close()
        peer_connection.current = new RTCPeerConnection(rtc_configuration)
      }
      setState((prevState) => ({ ...prevState, callCreateTriggered: false }))
      // Reset after a second
      window.setTimeout(websocketServerConnect, 1000)
    }
    ws_conn.current.onerror = () => {
      console.error('Unable to connect to server, did you add an exception for the certificate?')
      // Retry after 3 seconds
      window.setTimeout(websocketServerConnect, 3000)
    }
  }

  // eslint-disable-next-line no-unused-vars
  const createCall = (sdp, ice) => {
    setState((prevState) => ({ ...prevState, callCreateTriggered: true }))

    const send_channel = peer_connection.current.createDataChannel('label', null)
    send_channel.onmessage = ({ type, data }) => {
      if (typeof data === 'string' || data instanceof String) {
        console.log(`type:${type} date:${data}`)
      }
      send_channel.send('Hi! (from browser send)')
    }

    peer_connection.current.ondatachannel = ({ channel: receive_channel }) => {
      receive_channel.onmessage = ({ type, data }) => {
        if (typeof data === 'string' || data instanceof String) {
          console.log(`type:${type} date:${data}`)
        }
        send_channel.send('Hi! (from browser receive)')
      }
    }

    // eslint-disable-next-line no-unused-vars
    peer_connection.current.ontrack = ({ receiver, streams, track, transceiver }) => {
      if (!streams || streams.length === 0) return
      const video = receive_video.current
      const { contentHint, enabled, id, kind, label, muted, readyState, stats } = track // eslint-disable-line no-unused-vars
      track.onmute = () => {
        video.style.display = 'none'
      }
      track.onunmute = () => {
        video.style.display = 'block'
      }
      video.style.display = kind === 'audio' ? 'none' : 'block'
      video.srcObject = streams[0]
    }
    peer_connection.current.onicecandidate = (event) => {
      // We have a candidate, send it to the remote party with the same uuid
      if (event.candidate == null) {
        console.log('ICE Candidate was null, done')
        return
      }
      ws_conn.current.send({ ice: event.candidate })
    }
    peer_connection.current.oniceconnectionstatechange = () => {
      if (peer_connection.current.iceConnectionState == 'connected') {
        console.log('ICE gathering complete')
      }
    }
    // let the "negotiationneeded" event trigger offer generation
    peer_connection.current.onnegotiationneeded = async () => {
      if (state['remote-offerer']) return
      try {
        setState((prevState) => ({ ...prevState, makingOffer: true }))
        await peer_connection.current.setLocalDescription()
        ws_conn.current.send({ sdp: peer_connection.current.localDescription })
      } catch (err) {
        console.error(err)
        ws_conn.current.close()
      } finally {
        setState((prevState) => ({ ...prevState, makingOffer: false }))
      }
    }

    setState((prevState) => ({ ...prevState, 'peer-connect-button': 'Disconnect' }))
  }

  const onConnectClicked = () => {
    if (state['peer-connect-button'] == 'Disconnect') {
      ws_conn.current.close()
      return
    }
    var id = state['peer-connect']
    if (id == '') {
      alert('Peer id must be filled out')
      return
    }
    ws_conn.current.send('SESSION ' + id)
    setState((prevState) => ({ ...prevState, 'peer-connect-button': 'Disconnect' }))
  }

  const onTextKeyPress = (event) => {
    const { type, code } = event
    if (type == 'keydown' && code == 'Enter') {
      onConnectClicked()
      return false
    }
    return true
  }

  return (
    <div>
      <div id='video'>
        <video ref={receive_video} style={{ display: 'none' }} autoPlay playsInline>
          {"Your browser doesn't support video"}
        </video>
      </div>
      <div>
        Status: <span id='status'>{state.status}</span>
      </div>
      <div>
        <textarea id='text' cols={40} rows={4} value={state.text} onChange={inputChange} />
      </div>
      <br />
      <div>
        <label htmlFor='peer-connect'>Enter peer ID</label>
        <input id='peer-connect' type='text' onChange={inputChange} onKeyDown={onTextKeyPress} required />
        <input id='peer-connect-button' type='button' value={state['peer-connect-button']} onClick={onConnectClicked} />
        <input id='remote-offerer' type='checkbox' onChange={inputChange} autoComplete={'off'} />
        <span>Remote offerer</span>
      </div>
      <div>
        Our ID is <b id='peer-id'>{state['peer-id']}</b>
      </div>
      <br />
      <div>
        <div>getUserMedia constraints being used:</div>
        <div>
          <textarea id='constraints' cols={40} rows={4} onChange={inputChange} />
        </div>
      </div>
    </div>
  )
}
