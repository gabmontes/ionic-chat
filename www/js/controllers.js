angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $http, $ionicPopup) {
  $scope.user = {};
  $scope.createUser = function() {
    $http.post("http://localhost:4000/me", {
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
