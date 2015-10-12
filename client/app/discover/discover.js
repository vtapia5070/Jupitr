angular.module('jupitr.discover', [])

.controller('discoverController', function($scope, User) {

  $scope.profiles = [];

  User.getAll(function(data) {
    $scope.profiles = data;
    // console.log(data);
    // console.log($scope.profiles);
  });
  
  // retrieves all user profiles from local storage to display on discover page
  // $scope.profiles = JSON.parse(window.localStorage.getItem('hrr8.jupitr'));
  
});
