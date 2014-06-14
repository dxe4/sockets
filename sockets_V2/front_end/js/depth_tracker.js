var videoCamera = new tracking.VideoCamera().hide().render().renderVideoCanvas(),
    ctx = videoCamera.canvas.context;
    tracker = null;

    function DepthTracker(track){
        this.direction = null;
        this.previous_depth = track.z;
        this.last_direction = null;
        this.counter = 0;        
    }



    DepthTracker.prototype = {
        track: function(track){
            var diff = this.previous_depth - track.z;

            if(Math.abs(diff) < 7.5){
                console.log('not enough moved');
                return;
            }

            this.previous_depth = track.z;
            this.last_direction = this.direction;

            if(diff < 0) {
                this.direction = "back"
            }
            else {
                this.direction = "forward"
            }
            if(this.direction !== this.last_direction){
                this.counter = 0;
            }else {
                this.counter++;
            }

            console.log(this.counter, this.direction);
        }
    }


    videoCamera.track({
        type: 'color',
        color: 'cyan',
        onFound: function(track) {
            var pixels = track.pixels;

            if (!tracker){
                tracker = new DepthTracker(track);
            }
            tracker.track(track);
            
            for (var i = 0, len = pixels.length; i < len; i += 2) {
                ctx.fillStyle = "rgb(0,255,255)";
                ctx.fillRect(pixels[i], pixels[i+1], 2, 2);
            }

            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillRect(track.x, track.y, 5, 5);
        }
    });