paper.install(window);

//Setup the canvas
var leftCanvas = document.getElementById('leftCanvas');
var rightCanvas = document.getElementById('rightCanvas');
var paperScopeWrite = new PaperScope();
var paperScopePlayback = new PaperScope();
setupCanvas(paperScopeWrite, leftCanvas);
setupCanvas(paperScopePlayback, rightCanvas);
function setupCanvas(paperScope, canvas) {
    var w = 300;
    var h = 200;
    canvas.height = h;
    canvas.width = w;
    paperScope.setup(canvas);
    paperScope.activate();
    var rect = new Rectangle(new Point(0, 0),
        new Point(w, h));
    var rectPath = new Path.Rectangle(rect);
    rectPath.fillColor = 'yellow';
    paperScope.view.draw();
}

//Button action
var recordButton = document.getElementById('record');
recordButton.onclick = function(e) {
    if (recordButton.innerHTML === 'Record') {
        recordButton.innerHTML = 'Stop and Playback';
        startRecording();
    } else {
        recordButton.innerHTML = 'Record';
        stopAndPlayRecording();
    }
};

//Setup left canvas input handlers
paperScopeWrite.activate();
var canvasTools = new Tool();
canvasTools.onMouseDown = function(event) {
    if (shouldRecord) recordStart(event.point.x, event.point.y);
    paperScopeWrite.activate();
    drawStart(event.point.x, event.point.y);
    paperScopeWrite.view.draw();
};
canvasTools.onMouseDrag = function(event) {
    if (shouldRecord) recordMove(event.point.x, event.point.y);
    drawMove(event.point.x, event.point.y);
    paperScopeWrite.view.draw();
};
canvasTools.onMouseUp = function(event) {
    if (shouldRecord) recordStop();
    drawStop();
    paperScopeWrite.view.draw();
};

//Drawing tools
var path;
function drawStart(pX, pY) {
    console.log('start');
    path = new Path();
    path.strokeColor = 'blue';
    path.strokeWidth = 3;
    path.add(new Point(pX, pY));
}

function drawMove(pX, pY) {
    console.log('move');
    path.add(new Point(pX, pY));
}

function drawStop() {
    console.log('stop');
    path.simplify(5);
}

function clear() {
    paper.project.activeLayer.removeChildren();
}

//Playback
var timings = [];
var startTime = new Date();
var duration = 100;
var shouldRecord = false;

function startRecording() {
    timings = [];
    startTime = new Date();
    shouldRecord = true;
}

function stopAndPlayRecording() {
    shouldRecord = false;
    playRecording();
}

function recordStart(pX, pY) {
    timings.push({
        start: getTimeDifference(),
        duration: duration,
        data: {
            action: 'drawStart',
            x: pX,
            y: pY,
        }
    });
}

function recordMove(pX, pY) {
    timings.push({
        start: getTimeDifference(),
        duration: duration,
        data: {
            action: 'drawMove',
            x: pX,
            y: pY,
        }
    });
}

function recordStop(pX, pY) {
    timings.push({
        start: getTimeDifference(),
        duration: duration,
        data: {
            action: 'drawStop',
            x: pX,
            y: pY,
        }
    });
}

function recordClear(x, y) {
    timings.push({
        start: getTimeDifference(),
        duration: duration,
        data: {
            action: 'clear'
        }
    });
}

function getTimeDifference() {
    return (new Date() - startTime);
}

function playRecording() {
    var canvasChannel  = {
        name: 'canvas',
        timings: timings
    };
    var kinetophone = new Kinetophone([canvasChannel], timings[timings.length - 1].start + 1000, 80);
    kinetophone.on('enter:canvas', function(event) {
        paperScopePlayback.activate();
        switch(event.data.action) {
            case 'drawStart':
                drawStart(event.data.x, event.data.y);
                break;
            case 'drawMove':
                drawMove(event.data.x, event.data.y);
                break;
            case 'drawStop':
                drawStop();
                break;
            case 'clear':
                clear();
                break;
        }
        paperScopePlayback.view.draw();
    });
    kinetophone.play();
}
