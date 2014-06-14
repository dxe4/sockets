'use strict';

angular.module('mean.tracking-game').controller('TrackingGameController', ['$scope', 'Global', 'TrackingGame',
    function($scope, Global, TrackingGame) {
        $scope.global = Global;
        $scope.package = {
            name: 'tracking-game'
        };

        $scope.track = {};

        $scope.startTracking = function(){
        	alert('foo');
        	var tracking = window.tracking;
	        var videoCamera = new tracking.VideoCamera().render();

	        videoCamera.track({
			    type: 'color',
			    onFound: function(track) {
			    	console.log(track);
			      	$scope.track = track;
			    },
			    onNotFound: function() {}
			});
        };


    }
]);
