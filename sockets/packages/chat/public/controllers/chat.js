'use strict';

angular.module('mean.chat').controller('ChatController', ['$scope', 'Global', 'Chat',
    function($scope, Global, Chat) {
        $scope.global = Global;
        $scope.package = {
            name: 'chat'
        };
    }
]);
