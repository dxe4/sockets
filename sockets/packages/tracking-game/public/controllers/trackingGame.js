'use strict';

angular.module('mean.tracking-game').controller('TrackingGameController', ['$scope', 'Global', 'TrackingGame',
    function($scope, Global, TrackingGame) {
        $scope.global = Global;
        $scope.package = {
            name: 'tracking-game'
        };
    }
]);
