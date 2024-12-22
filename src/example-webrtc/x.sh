gst-launch-1.0 -v \
    webrtcbin name=sendrecv \
    videotestsrc ! videoconvert ! vp8enc ! rtpvp8pay ! sendrecv. \
    audiotestsrc ! audioconvert ! audioresample ! opusenc ! rtpopuspay ! sendrecv.

gst-launch-1.0 -v \
    webrtcbin name=sendrecv \
    videotestsrc ! videoconvert ! x264enc ! rtph264pay ! sendrecv. \
    audiotestsrc ! audioconvert ! audioresample ! opusenc ! rtpopuspay ! sendrecv.

GST_DEBUG=3 gst-launch-1.0 -v -e \
    avfvideosrc ! \
    videoconvert ! \
    video/x-raw,format=I420 ! \
    queue ! \
    vp9enc noise-sensitivity=1 token-partitions=2 keyframe-max-dist=60 target-bitrate=500000 threads=4 cpu-used=8 deadline=1 buffer-initial-size=1000 buffer-optimal-size=2000 buffer-size=3000 ! \
    rtpvp9pay mtu=1200 ! \
    udpsink host=127.0.0.1 port=5000

GST_DEBUG=3 gst-launch-1.0 -v -e \
    osxaudiosrc ! \
    audioconvert ! \
    audioresample ! \
    audio/x-raw,rate=48000,channels=2 ! \
    opusenc bitrate=64000 ! \
    rtpopuspay ! \
    udpsink host=127.0.0.1 port=5001
