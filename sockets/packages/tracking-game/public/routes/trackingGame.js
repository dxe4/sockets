'use strict';

angular.module('mean.tracking-game').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('trackingGame example page', {
            url: '/trackingGame/example',
            templateUrl: 'tracking-game/views/index.html'
        });
    }
]);
