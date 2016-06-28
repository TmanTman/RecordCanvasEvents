# RecordCanvasEvents
Attempts to record and play back annotations made on a canvas

A live demo on the gh-pages branch [here](https://tmantman.github.io/RecordCanvasEvents/). Press the record button and draw on the indicated canvas. Press the stop button. Playback will then occur on the other canvas.

This project uses [paperjs](http://paperjs.org/) and [kinetophone](https://github.com/BinaryMuse/kinetophone) to record canvas
events and play it back.

To run: clone the repo, run "bower install", and spin up a server, I'd suggest "python -m SimpleHTTPServer" or [live-server](https://github.com/tapio/live-server)

It's horrible spaghetti code, but the proof-of-concept works. Playback on some mobile devices are still problematic.
