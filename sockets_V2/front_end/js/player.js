// initialize client with app credentials
window.playerView = (function (ko, $, SC) {
	ko.punches.enableAll();

	function PlayerView(sound){
		this.sound = ko.observable(sound);
		this.playing = ko.observable(false);
		this.position = ko.observable(0);
		this.duration = ko.observable(1);

		this.progress = ko.computed(function(){
			return (this.position()/this.duration())*100+"%";
		}, this)

		this.track = ko.observable("/tracks/293");
	}



	PlayerView.prototype = {
		playToggle: function(){
			var sound = this.sound(),
				playing = this.playing(),
				self = this;
			switch (playing){
				case false:
					console.log('tring play');
					sound.play({
						whileplaying: function(){
							self.position(sound.position);
						},
						whileloading: function(){
							self.duration(sound.duration);
						}
					});
					this.playing(true);
					return;
				case true:
					sound.pause();
					this.playing(false);
					return;
			}
		},
		loadTrack: function(){

		}
	}

	var vm = new PlayerView();
	SC.initialize({
	  client_id: 'b61d4560984dc7c38d3fc0fcb123cffc',
	  redirect_uri: 'http://localhost:9001/callback.html'
	});

	SC.stream("/tracks/293", function(sound){
		vm.sound(sound);
	});

	SC.whenStreamingReady(function(){
		ko.applyBindings(vm, $("#player")[0]);
	})

	return vm;
	
})(ko, $, SC); 



