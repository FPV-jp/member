gst-launch-1.0 -v \
 webrtcbin name=sendrecv \
 videotestsrc ! videoconvert ! vp8enc ! rtpvp8pay ! sendrecv. \
 audiotestsrc ! audioconvert ! audioresample ! opusenc ! rtpopuspay ! sendrecv.

gst-launch-1.0 -v \
 webrtcbin name=sendrecv \
 videotestsrc ! videoconvert ! x264enc ! rtph264pay ! sendrecv. \
 audiotestsrc ! audioconvert ! audioresample ! opusenc ! rtpopuspay ! sendrecv.

# VP8
GST_DEBUG=3 gst-launch-1.0 -v -e \
 avfvideosrc ! \
 videoconvert ! \
 video/x-raw,format=I420 ! \
 queue ! \
 vp8enc noise-sensitivity=1 token-partitions=2 keyframe-max-dist=60 target-bitrate=500000 threads=4 cpu-used=8 deadline=1 buffer-initial-size=1000 buffer-optimal-size=2000 buffer-size=3000 ! \
 rtpvp8pay mtu=1200 ! \
 udpsink host=127.0.0.1 port=5000
 
# VP9
GST_DEBUG=3 gst-launch-1.0 -v -e \
 avfvideosrc ! \
 videoconvert ! \
 video/x-raw,format=I420 ! \
 queue ! \
 vp9enc noise-sensitivity=1 token-partitions=2 keyframe-max-dist=60 target-bitrate=500000 threads=4 cpu-used=8 deadline=1 buffer-initial-size=1000 buffer-optimal-size=2000 buffer-size=3000 ! \
 rtpvp9pay mtu=1200 ! \
 udpsink host=127.0.0.1 port=5000

# OPUS
GST_DEBUG=3 gst-launch-1.0 -v -e \
 osxaudiosrc ! \
 audioconvert ! \
 audioresample ! \
 audio/x-raw,rate=48000,channels=2 ! \
 opusenc bitrate=64000 ! \
 rtpopuspay ! \
 udpsink host=127.0.0.1 port=5001



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
