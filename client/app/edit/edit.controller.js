'use strict';

angular.module('lgtmGeneratorApp')
  .controller('EditCtrl', function ($scope, $http, $state) {

    console.log($state.params);

    $scope.init = function () {
      var imgUrl = $state.params.url;
      console.log(imgUrl);
      var stage  = new createjs.Stage("edit-canvas");
      var img    = new createjs.Bitmap(imgUrl);
      img.image.onload = function() { stage.update(); };
      stage.addChild(img);
    }

    // function imageLoadError(){
    //   alert("Error:画像のロードに失敗しました\n指定したものが画像でないか、取得できません。");
    // }

  });
