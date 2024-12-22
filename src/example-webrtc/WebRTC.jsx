import { useRef, useEffect, useState } from 'react'

export function WebRTCHeader() {
  return (
    <div className='inline-flex rounded-md shadow-sm' role='group'>
      <button type='button' className='rounded-l-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700'>
        Left
      </button>
      <button type='button' className='-ml-px border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700'>
        Middle
      </button>
      <button type='button' className='-ml-px rounded-r-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700'>
        Right
      </button>
    </div>
  )
}

export default function ExamleWebRTC() {
  const videoRef = useRef(null)
  const [peerConnection, setPeerConnection] = useState(null)
  const [url, setUrl] = useState(null)

  useEffect(() => {
    if (url) return

    // WebSocketサーバーへの接続
    const signalingServer = new WebSocket(url)

    // 新しいPeerConnectionの作成
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }], // GoogleのSTUNサーバー
    })
    setPeerConnection(pc)

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
  }, [url])

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto', background: 'black' }} />
    </div>
  )
}
