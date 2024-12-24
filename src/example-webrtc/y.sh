
# === webrtcsink ====================================

# Send Pipeline
GST_DEBUG=3 gst-launch-1.0 -v -e \
 webrtcsink start-call=true signaler=GstOwrSignaler signaler::server_url=http://webrtc.ridgerun.com:8080 \
 signaler::session_id=1234ridgerun name=web videotestsrc is-live=true ! \
 queue ! \
 videoconvert ! \
 vp8enc ! \
 rtpvp8pay ! \
 queue ! \
 identity ! \
 web.video

GST_DEBUG=3 gst-launch-1.0 -v -e \
 webrtcsink start-call=true signaler=GstOwrSignaler signaler::server_url=http://webrtc.ridgerun.com:8080 \
 signaler::session_id=1234ridgerun name=web videotestsrc is-live=true ! \
 queue ! \
 videoconvert ! \
 x264enc key-int-max=2 ! \
 rtph264pay ! \
 queue ! \
 web.video


# Receive Pipeline
GST_DEBUG=3 gst-launch-1.0 -v -e \
 webrtcsrc start-call=false signaler=GstOwrSignaler signaler::server_url=http://webrtc.ridgerun.com:8080 \
 signaler::session_id=1234ridgerun name=web web.video ! \
 rtpvp8depay ! \
 vp8dec ! \
 videoconvert ! \
 ximagesink async=true

GST_DEBUG=3 gst-launch-1.0 -v -e \
 webrtcsrc start-call=false signaler=GstOwrSignaler signaler::server_url=http://webrtc.ridgerun.com:8080 \
 signaler::session_id=1234ridgerun name=web web.video ! \
 rtph264depay ! \
 avdec_h264 ! \
 videoconvert ! \
 ximagesink async=true


# === webrtcsink ====================================

# Send Pipeline
GST_DEBUG=3 gst-launch-1.0 -v -e \
 webrtcbin start-call=true signaler=GstOwrSignaler signaler::server_url=http://webrtc.ridgerun.com:8080 \
 signaler::session_id=1234ridgerun name=web videotestsrc is-live=true ! \
 queue ! \
 videoconvert ! \
 vp8enc ! \
 rtpvp8pay ! \
 queue ! \
 identity silent=false ! \
 web.video_sink web.video_src ! \
 rtpvp8depay ! \
 vp8dec ! \
 videoconvert ! \
 ximagesink async=true

GST_DEBUG=3 gst-launch-1.0 -v -e \
 webrtcbin start-call=true signaler=GstOwrSignaler signaler::server_url=http://webrtc.ridgerun.com:8080 \
 signaler::session_id=1234ridgerun name=web videotestsrc is-live=true ! \
 queue ! \
 videoconvert ! \
 x264enc key-int-max=2 ! \
 rtph264pay ! \
 queue ! \
 identity silent=false ! \
 web.video_sink web.video_src ! \
 rtph264depay ! \
 avdec_h264 ! \
 videoconvert ! \
 ximagesink async=true

# Receive Pipeline
GST_DEBUG=3 gst-launch-1.0 -v -e \
 webrtcbin start-call=false signaler=GstOwrSignaler signaler::server_url=http://webrtc.ridgerun.com:8080 \
 signaler::session_id=1234ridgerun name=web videotestsrc is-live=true ! \
 queue ! \
 videoconvert ! \
 x264enc key-int-max=2 ! \
 rtph264pay ! \
 queue ! \
 identity silent=false ! \
 web.video_sink web.video_src ! \
 rtph264depay ! \
 avdec_h264 ! \
 videoconvert ! \
 ximagesink async=true

GST_DEBUG=3 gst-launch-1.0 -v -e \
 webrtcbin start-call=false signaler=GstOwrSignaler signaler::server_url=http://webrtc.ridgerun.com:8080 \
 signaler::session_id=1234ridgerun name=web videotestsrc is-live=true ! \
 queue ! \
 videoconvert ! \
 vp8enc ! \
 rtpvp8pay ! \
 queue ! \
 identity silent=false ! \
 web.video_sink web.video_src ! \
 rtpvp8depay ! \
 vp8dec ! \
 videoconvert ! \
 ximagesink async=true
