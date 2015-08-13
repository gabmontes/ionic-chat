angular.module('starter.controllers', [])

.controller('ChatsCtrl', function($scope, $state, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = [];

    Chats.onUpdate(function(chats) {
        $scope.chats = chats;
    });

    $scope.chatTo = function(name) {
        Chats.create(name);
        $state.go("tab.chat-detail", {
            chatId: name
        });
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, $ionicScrollDelegate, Chat) {
    $scope.name = $stateParams.chatId;
    $scope.newMessage = {};
    $scope.messages = [];

    Chat.onUpdate($stateParams.chatId, function(messages) {
        $scope.messages = messages;
        $ionicScrollDelegate.scrollBottom(true);
    });

    $scope.$on("$destroy", function () {
        Chat.stopUpdate($stateParams.chatId);
    });

    $scope.send = function(text) {
        Chat.send($scope.name, $scope.newMessage.text).then(function () {
            $scope.messages.push({
                from: "sending",
                text: $scope.newMessage.text
            });
            $scope.newMessage = {};
        });
    };
})

.controller('AccountCtrl', function($scope, $http, $ionicPopup) {
    $scope.user = {};

    var url = "http://localhost:4000/me";
    $http.get(url).then(function(resp) {
        $scope.user = resp.data;
    }, function(resp) {
        if (resp.status === 401) {
            return;
        }
        $ionicPopup.alert({
            title: "Could not retrive current user",
            template: JSON.stringify(resp)
        });
    });

    $scope.createUser = function() {
        $http.post(url, {
            name: $scope.user.newName
        }).then(function(resp) {
            $scope.user = resp.data;
        }, function(resp) {
            $ionicPopup.alert({
                title: "Could not create user",
                template: JSON.stringify(resp)
            });
        });
    };
});
