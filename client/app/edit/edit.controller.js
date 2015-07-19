'use strict';

var stage;
var img;
var layer;
var container;

angular.module('lgtmGeneratorApp')
  .controller('EditCtrl', function ($scope, $http, $state, $location) {

    $scope.hide_flg= true;

    if ($state.params.url === null) {
      $location.path('/');
      $location.replace();
    } else {
      $scope.hide_flg = false;
    }

    $scope.moveText = function(e) {
      var keyCode = e.keyCode;

      switch (keyCode) {
        case 39:
          container.x += 10;
          break;
        case 37:
          container.x -= 10;
          break;
        case 40:
          container.y += 10;
          break;
        case 38:
          container.y -= 10;
          break;
      }
      stage.update();

      // 後続処理の停止（スクロール対策）
      e.preventDefault();
    }

    $scope.init = function () {
      var imgUrl    = $state.params.url;
      var lgtm_text = new createjs.Text('LGTM', 'Bold 80px Arial', '#FFF');
      var lgtm_text_outline = lgtm_text.clone();

      stage         = new createjs.Stage("edit-canvas");
      img           = new createjs.Bitmap(imgUrl);
      container     = new createjs.Container();
      layer         = new createjs.Shape();

      lgtm_text_outline.outline = 2;
      lgtm_text_outline.color = "#000";

      stage.addChild(img);
      stage.addChild(container);
      container.addChild(lgtm_text);
      container.addChild(lgtm_text_outline);

      img.addEventListener('mousedown', clickFocus);
      container.addEventListener('mousedown', dragMove);

      img.image.onload = function() {
        resizeImage();
        moveTextCenter(lgtm_text);
        layer.graphics.beginFill("#000000").drawRect(0, 0, img.image.width, img.image.height);
        img.hitArea = layer;
        stage.update();
      };
    }

    function resizeImage() {
      var MAX_PX_SIZE = 300;
      var w = parseInt(img.image.width);
      var h = parseInt(img.image.height);

      // アスペクト比をたもったままリサイズ
      if ( w > MAX_PX_SIZE || h > MAX_PX_SIZE || $('#fit_flag').prop('checked')) {
        var scale = Math.min( MAX_PX_SIZE / w, MAX_PX_SIZE / h);
        img.scaleX = scale;
        img.scaleY = scale;
        var rsizew = img.image.width * scale;
        var rsizeh = img.image.height * scale;
        stage.canvas.width = rsizew;
        stage.canvas.height = rsizeh;
        stage.width = rsizew;
        stage.height = rsizeh;
      } else {
        img.scaleX = 1;
        img.scaleY = 1;
        stage.canvas.width = w;
        stage.canvas.height = h;
        stage.width = w;
        stage.height = h;
      }
    }

    function moveTextCenter(lgtm_text) {
      // テキストを中央に移動
      container.x = (stage.width - lgtm_text.getMeasuredWidth()) / 2;
      container.y = stage.height - (lgtm_text.getMeasuredHeight() * 2);
    }

    function clickFocus(eventObject) {
      var instance = eventObject.currentTarget;
      angular.element("#edit-canvas").focus();
    }

    function dragMove(eventObject) {
      var instance = eventObject.currentTarget;
      instance.addEventListener("pressmove", drag);
      instance.addEventListener("pressup", stopDrag);
      instance.offset = new createjs.Point(instance.x - eventObject.stageX, instance.y - eventObject.stageY);
    }

    function drag(eventObject) {
      var instance = eventObject.currentTarget;
      var offset = instance.offset;
      instance.x = eventObject.stageX + offset.x;
      instance.y = eventObject.stageY + offset.y;
      stage.update();
    }

    function stopDrag(eventObject) {
      var instance = eventObject.currentTarget;
      instance.removeEventListener("pressmove", drag);
      instance.removeEventListener("pressup", stopDrag);
    }

    // function imageLoadError(){
    //   alert("Error:画像のロードに失敗しました\n指定したものが画像でないか、取得できません。");
    // }

  });
