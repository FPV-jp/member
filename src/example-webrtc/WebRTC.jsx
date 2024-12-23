import { useRef, useEffect, useState } from 'react'

/* eslint-disable react/prop-types */
export function WebRTCHeader({ WebRTCState, setWebRTCState }) {
  function inputChange(event) {
    const { name, value } = event.target
    setWebRTCState({ ...WebRTCState, [name]: value })
  }
  return (
    <div className='inline-flex rounded-md shadow-sm gap-x-6' role='group'>
      <select id='URL' name='url' onChange={inputChange} className='col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>
        {['ws://localhost:8080/ws', 'ws://localhost:5001'].map((op) => {
          return <option key={op}>{op}</option>
        })}
      </select>
      <button type='button' onClick={() => { setWebRTCState({ ...WebRTCState, connect: true }) }} className='relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
        Connect
      </button>
    </div>
  )
}

/* eslint-disable react/prop-types */
export default function ExamleWebRTC({ WebRTCState, setWebRTCState }) {
  const videoRef = useRef(null)

  useEffect(() => {
    // console.log("===== WebRTCState.url ", WebRTCState.url)
    // console.log("===== WebRTCState.connect ", WebRTCState.connect)
    // if (WebRTCState.url) return
    if (!WebRTCState.connect) return

    console.log("===== WebRTCState.url ", WebRTCState.url)
    // WebSocketサーバーへの接続
    const signalingServer = new WebSocket(WebRTCState.url)

    // 新しいPeerConnectionの作成
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }], // GoogleのSTUNサーバー
    })

    // setWebRTCState({ ...WebRTCState, peerConnection: pc })

    // ビデオストリームを受信して設定
    pc.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0]
      }
    }

    // シグナリングサーバーからのメッセージを処理
    signalingServer.onmessage = async (message) => {
      const data = JSON.parse(message.data)
      if (data.sdp) {
        // SDPを設定
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
        if (data.sdp.type === 'offer') {
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          signalingServer.send(JSON.stringify({ sdp: pc.localDescription }))
        }
      } else if (data.candidate) {
        // ICE Candidateを追加
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
      }
    }

    // ICE Candidateをシグナリングサーバーに送信
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        signalingServer.send(JSON.stringify({ candidate: event.candidate }))
      }
    }

    // クリーンアップ
    return () => {
      pc.close()
      if (signalingServer) signalingServer.close()
    }
  }, [WebRTCState.connect])

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto', background: 'black' }} />
    </div>
  )
}
