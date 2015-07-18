'use strict';

angular.module('lgtmGeneratorApp')
  .controller('MainCtrl', function ($scope, $http, $state) {

    $scope.images = [
    ];

    $scope.search = function() {
      var json_data = {
        keywords: $scope.keywords
      };

      $http.post('/api/things/search', json_data).
        success(function(data) {
          // console.log(data);
          $scope.images = data;
        });
    }

    $scope.edit = function() {
      $state.go('edit');
    }

    angular.element(window).load(function () {
      angular.element('#tile-image').freetile({
        animate: true,
        elementDelay: 30
      });
    });

  });
