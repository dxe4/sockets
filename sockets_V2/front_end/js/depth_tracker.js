var videoCamera = new tracking.VideoCamera().hide().render().renderVideoCanvas(),
        ctx = videoCamera.canvas.context;
        tracker = null,
        level = 2;

    function DepthTracker(track){
        this.direction = null;
        this.base_depth = track.z;
        this.previous_depth = track.z;
        this.current_depth = track.z;
        this.last_direction = null;
    }

    DepthTracker.prototype = {
        track: function(track){
            var diff = this.previous_depth - track.z,
                base_depth_diff = this.base_depth - track.z;

            if(Math.abs(base_depth_diff) < 5){
                console.log('got back to base level');
                level = 2;
                return;
            }
            if(Math.abs(diff) < 10) return;

            this.previous_depth = track.z;
            this.last_direction = this.direction;

            if(diff < 0) {
                this.direction = "back"
            }
            else {
                this.direction = "forward"
            }
            if(this.direction !== this.last_direction){
                console.log('old level', level);
                if(this.direction == 'forward')
                    level = (level > 3) ? 3 : level+1;
                else 
                    level = (level < 1) ? 1 : level-1;
            }      
            console.log(level);
        }
    }


    videoCamera.track({
        type: 'color',
        color: 'magenta',
        onFound: function(track) {
            if (!tracker){
                tracker = new DepthTracker(track);
            }
            tracker.track(track);
            

            /*
            for (var i = 0, len = pixels.length; i < len; i += 2) {
                ctx.fillStyle = "rgb(255,0,255)";
                ctx.fillRect(pixels[i], pixels[i+1], 2, 2);
            }

            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillRect(track.x, track.y, 5, 5);*/
        }
    });