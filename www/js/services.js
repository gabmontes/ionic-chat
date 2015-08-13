angular.module('starter.services', [])

.factory('Chats', function($http, $ionicPopup) {
    var chats = [];
    var onUpdateCallback;
    var timeout;

    function refresh() {
        clearTimeout(timeout);
        var url = "http://localhost:4000/chats";
        $http.get(url).then(function(resp) {
            chats = resp.data.map(function(chat) {
                return {
                    id: chat.name,
                    name: chat.name,
                    unread: chat.unread,
                    lastText: chat.last,
                    time: chat.time,
                    face: null
                };
            });
            onUpdateCallback(chats);
        }, function(resp) {
            if (resp.status === 401) {
                return;
            }
            $ionicPopup.alert({
                title: "Could not retrieve chats list",
                template: JSON.stringify(resp)
            });
        });
        timeout = setTimeout(function() {
            refresh();
        }, 5000);
    }

    return {
        onUpdate: function(callback) {
            onUpdateCallback = callback;
            refresh();
        },
        create: function(name) {
            chats.push({
                id: name,
                name: name,
                lastText: "",
                face: null
            });
            refresh();
        }
    };
})

.factory("Chat", function($http, $ionicPopup) {
    var url = "http://localhost:4000/chats/";

    var onUpdateCallbacks = {};
    var timeouts = {};

    function refresh(name) {
        clearTimeout(timeouts[name]);
        $http.get(url + name).then(function(resp) {
            onUpdateCallbacks[name](resp.data);
        }, function(resp) {
            $ionicPopup.alert({
                title: "Could not retrieve chats",
                template: JSON.stringify(resp)
            });
        });
        timeouts[name] = setTimeout(function() {
            refresh(name);
        }, 2000);
    }

    function sendTo(name, text) {
        return $http.post(url + name, {
            text: text
        }).then(function() {
            // success
        }, function(resp) {
            $ionicPopup.alert({
                title: "Could not send chat",
                template: JSON.stringify(resp)
            });
        });
    }

    return {
        onUpdate: function(name, callback) {
            onUpdateCallbacks[name] = callback;
            refresh(name);
        },
        stopUpdate: function(name) {
            clearTimeout(timeouts[name]);
        },
        send: function(name, text) {
            return sendTo(name, text).then(function() {
                refresh(name);
            });
        }
    };
});
