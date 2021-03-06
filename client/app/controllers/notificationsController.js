(function(){
angular.module('imgame.notification', [])
  .controller('NotificationsController', NotificationsController);

  function NotificationsController($scope, $rootScope, Auth, Notification, $route, $location){
 
    $scope.viewed = [];
    $scope.notifications;
    $scope.newNotes = 0;

    Auth.requireAuth();

    //////////////////////////////////////////////////////////////////
    // page initiation
    //////////////////////////////////////////////////////////////////
    $scope.init = function() {
      window.setInterval($scope.updateViewed, 5000);
      Notification.getNotifications()
        .then(function(data){
          $scope.notifications = data;
          for ( var i = 0; i < data.length; i++ ) {
            if ( !data[i].viewed ) {
              $scope.newNotes++;
            }
          }
        })
    }

    // as user mouse over a notification, note coutns decrease
    $scope.addToViewed = function(note) {
      if ( !note.viewed ) {
        $scope.viewed.push(note.id);
        note.viewed = true;
        $scope.newNotes--;
      }
    },

    // watch notification counts that could be changed from "$scope.addToViewed" func, to update view
    $scope.$watch(function(scope) {
      return scope.newNotes;
    }, function(newNotes){
      var bubble = document.getElementById('notes-bubble');
      if ( bubble ) {
        bubble.innerHTML = newNotes;
      }
    },true);

    // updateViewed is called every 5 seconds to update when user viewed a notification
    $scope.updateViewed = function() {
      if ( $scope.viewed.length > 0 ) {
        return Notification.updateNotifications($scope.viewed)
          .then(function() {
            $scope.viewed = [];
          });
      }
    }

    // calculate time from now to when the notification was created to improve user interface
    $scope.timeElapsed = function(initialTime) {
      var toTime = new Date();
      var fromTime = new Date(initialTime);
      var differenceTravel = toTime.getTime() - fromTime.getTime();
      var seconds = Math.floor((differenceTravel) / (1000));
      var mins = Math.floor((seconds) / (60));
      var hours = Math.floor((mins) / (60));
      var days = Math.floor((hours) / (24));
      if (days >= 1) {
        return (days === 1) ? days + " day ago" : days + " days ago";
      }
      else if (hours >= 1) {
        return (hours === 1) ? hours + " hour ago" : hours + " hours ago";
      }
      else if (mins >= 1) {
        return (mins === 1) ? mins + " min ago" : mins + " mins ago";
      }
      else return seconds + " seconds ago";
    }

    $scope.init();
  }

})();