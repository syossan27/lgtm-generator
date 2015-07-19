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
      var image_src = angular.element("img[ng-src='"+this.image+"']").attr('src');
      if (image_src !== "assets/images/no_image.png") {
        $state.go('edit', { url: this.image });
      }
    }

    angular.element(window).load(function () {
      angular.element('#tile-image').freetile({
        animate: true,
        elementDelay: 30
      });
    });

  });
