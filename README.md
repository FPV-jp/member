# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Aspect ratio 4:3
* VGA: 640x480
* SVGA: 800x600
* XGA: 1024x768

# Aspect ratio 16:9
* HD (720p): 1280x720
gst-launch-1.0 videotestsrc ! video/x-raw,width=1280,height=720,framerate=30/1 ! autovideosink
* Full HD (1080p): 1920x1080
gst-launch-1.0 videotestsrc ! video/x-raw,width=1920,height=1080,framerate=30/1 ! autovideosink
* Quad HD (1440p): 2560x1440
gst-launch-1.0 videotestsrc ! video/x-raw,width=2560,height=1440,framerate=30/1 ! autovideosink
* 4K (2160p): 3840x2160
gst-launch-1.0 videotestsrc ! video/x-raw,width=3840,height=2160,framerate=30/1 ! autovideosink
