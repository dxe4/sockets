    var videoCamera = new tracking.VideoCamera().hide().render().renderVideoCanvas(),
        ctx = videoCamera.canvas.context;
        tracker = null,
        manager = null;


    /** MusicManager Part **/
    function MusicManager() {

    }

    MusicManager.prototype = {

        nextSong: function() {

        },

        previousSong: function() {

        },

        playPause: function() {

        }

    };


    /** Gesture tracker **/
    function DepthTracker(track){
        this.currentDirection = null; // 1 to forward, 0 backward
        this.currentDepth = null;
    }

    DepthTracker.prototype = {
        DIFF_YIELD_THRESHOLD: 5,

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
        }
    }

    videoCamera.track({
        type: 'color',
        color: 'blue',
        onFound: function(track) {

            if (!tracker){
                tracker = new DepthTracker(track);
            }

            tracker.update(track);

            if (tracker.directionCounter > 5) {
                if (tracker.currentDirection == 1) {
                    console.log("Going forwards");
                } else {
                    console.log("Going backwards");
                }
            }

        }
    });