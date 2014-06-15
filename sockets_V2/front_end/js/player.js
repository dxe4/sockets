// initialize client with app credentials
window.PlayerView = (function (ko, $) {
	ko.punches.enableAll();

	function PlayerView(sound){
		this.sound = ko.observable(sound);
		this.playing = ko.observable(false);
		this.position = ko.observable(0);
		this.duration = ko.observable(1);

		this.progress = ko.computed(function(){
			return (this.position()/this.duration())*100+"%";
		}, this)
	}



	PlayerView.prototype = {
		playpause: function(){
			var sound = this.sound(),
				playing = this.playing(),
				self = this;
			console.log(sound);
			switch (playing){
				case false:
					window.player.playVideo();
					this.playing(true);
					return;
				case true:
					window.player.stopVideo();
					this.playing(false);
					return;
			}
		},
		skip: function(){
			console.log('skip');
		},
		back: function(){
			console.log('back');
		}
	}

	return PlayerView
	
})(ko, $); 