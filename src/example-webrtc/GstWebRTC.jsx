import { useState, useEffect, useRef } from 'react'
import { gstWebRTCAPI, start } from './api/gstwebrtc-api.js'
import './GstWebRTC.css'

const signalingProtocol = window.location.protocol.startsWith('https') ? 'wss' : 'ws'
const gstWebRTCConfig = {
  meta: { name: `WebClient-${Date.now()}` },
  signalingServerUrl: `${signalingProtocol}://${window.location.host}/webrtc`,
}
start(gstWebRTCConfig)

const CaptureSection = () => {
  const [clientId, setClientId] = useState('none')
  const videoRef = useRef(null)
  const sectionRef = useRef(null)
  const [producerSession, setProducerSession] = useState(null)

  useEffect(() => {
    const listener = {
      connected: (id) => setClientId(id),
      disconnected: () => setClientId('none'),
    }
    gstWebRTCAPI.registerConnectionListener(listener)

    return () => {
      gstWebRTCAPI.unregisterConnectionListener(listener)
    }
  }, [])

  const handleCapture = async () => {
    if (producerSession) {
      producerSession.close()
    } else {
      const section = sectionRef.current
      section.classList.add('starting')
      try {
        const constraints = { video: { width: 1280, height: 720 } }
        const stream = await navigator.mediaDevices.getUserMedia(constraints)

        const session = gstWebRTCAPI.createProducerSession(stream)
        if (session) {
          setProducerSession(session)

          session.addEventListener('error', (event) => {
            console.error(event.message, event.error)
          })

          session.addEventListener('closed', () => {
            setProducerSession(null)
            videoRef.current.srcObject = null
            section.classList.remove('has-session', 'starting')
          })

          session.addEventListener('stateChanged', (event) => {
            if (event.target.state === gstWebRTCAPI.SessionState.streaming) {
              videoRef.current.srcObject = stream
              videoRef.current.play()
              section.classList.remove('starting')
            }
          })

          section.classList.add('has-session')
          session.start()
        }
      } catch (error) {
        console.error('Cannot access webcam and microphone:', error)
        section.classList.remove('starting')
      }
    }
  }

  return (
    <section ref={sectionRef} id='capture'>
      <span className='client-id'>{clientId}</span>
      <button className='button' id='capture-button' onClick={handleCapture}>
        {producerSession ? 'Stop Capture' : 'Start Capture'}
      </button>
      <div className='video'>
        <div className='spinner'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <video ref={videoRef}></video>
      </div>
    </section>
  )
}

const RemoteStreamsSection = () => {
  const [producers, setProducers] = useState([])
  const streamsRef = useRef([])

  useEffect(() => {
    const listener = {
      producerAdded: (producer) => {
        setProducers((prev) => [...prev, producer])
      },
      producerRemoved: (producer) => {
        setProducers((prev) => prev.filter((p) => p.id !== producer.id))
      },
    }

    gstWebRTCAPI.registerProducersListener(listener)

    return () => {
      gstWebRTCAPI.unregisterProducersListener(listener)
    }
  }, [])

  const handleStreamClick = (producerId) => {
    const session = gstWebRTCAPI.createConsumerSession(producerId)
    if (session) {
      session.connect()
    }
  }

  return (
    <section>
      <h1>Remote Streams</h1>
      <ul id='remote-streams'>
        {producers.map((producer) => (
          <li key={producer.id}>
            <div className='button' onClick={() => handleStreamClick(producer.id)}>
              {producer.meta.name || producer.id}
            </div>
            <div className='video'>
              <video ref={(el) => (streamsRef.current[producer.id] = el)}></video>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

const App = () => {
  return (
    <main>
      <CaptureSection />
      <RemoteStreamsSection />
    </main>
  )
}

export default App
