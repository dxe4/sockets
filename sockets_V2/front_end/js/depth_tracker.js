var videoCamera = new tracking.VideoCamera().hide(),
    ctx = videoCamera.canvas.context;
    tracker = null,
    manager = null;

/** Gesture tracker **/
function DepthTracker(track){
    this.currentDirection = null; // 1 to forward, 0 backward
    this.currentDepth = null;
}

DepthTracker.prototype = {
    DIFF_YIELD_THRESHOLD: 4,

    update: function(track){
        if (this.currentDepth == null) {
            this.currentDepth = parseInt(track.z);
            return;
        }

        var direction = Number(track.z < this.currentDepth)
            diff = Math.abs(track.z - this.currentDepth)
        ;


        if (diff < this.DIFF_YIELD_THRESHOLD) {
            return;
        }

        // Direction changed
        if (direction != this.currentDirection) {
            this.directionCounter = 0;
        } else {
            this.directionCounter += 1;
        }

        this.currentDepth = parseInt(track.z);
        this.currentDirection = direction;

    }
}

var ColorTrackerManager = function(videoCamera) {
    this.videoCamera = videoCamera;
    this.depthTracker = new DepthTracker();
}

var colors = { "cyan": "#1bc2ff", "yellow": "#FFB500", "magenta": "#FF00FF"};

ColorTrackerManager.prototype = {

    COLORS: colors,

    onColorFound: function(color, track) {
        var instance = this;

        $("body").css("background-color", instance.COLORS[color]);

        if (this.depthTracker.directionCounter > 1){
            if (this.currentDirection == 1){
                graph.zoom('in');
            }
        }
        if (this.depthTracker.directionCounter > 1){
            if (this.currentDirection == 0){
                graph.zoom('out');
            }
        }

        $("body").css("background-color", instance.COLORS[color]);
    },

    addTracker: function(colorName, hex) {
        var instance = this;

        instance.videoCamera.track({
            type: 'color',
            color: colorName,
            onFound: function(track) {
                instance.depthTracker.update(track);
                instance.onColorFound.call(instance, colorName, track);
            }
        });
    }

}
var colortracker = new ColorTrackerManager(videoCamera);
$.each(colors, function(colorName, hexa){
    colortracker.addTracker(colorName, hexa);
});


