'use strict';

var stage;
var img;
var container;
var layer;
var lgtm_text;
var lgtm_text_outline;

angular.module('lgtmGeneratorApp')
  .controller('EditCtrl', function ($scope, $http, $state, $location) {

    // リダイレクトする時に画面の諸々を隠す
    $scope.hide_flg = true;

    $scope.sizeSlider = {
      ceil: 200,
      floor: 50,
      init: 100
    };

    $scope.$on("slideEnded", function() {
      var percentage = parseInt($scope.sizeSlider.init) / 100;
      resizeImage(percentage, percentage);
      moveTextCenter();
      stage.update();
    });

    $scope.translate = function(value) {
      return value + "%";
    };

    if ($state.params.url === null) {
      $location.path('/');
      $location.replace();
      return;
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
      // フォントの読込
      loadFont();

      var imgUrl = $state.params.url;
      lgtm_text  = new createjs.Text('LGTM', 'Bold 80px Arial', '#FFF');
      lgtm_text_outline = lgtm_text.clone();

      stage     = new createjs.Stage("edit-canvas");
      container = new createjs.Container();
      layer     = new createjs.Shape();

      var apiUrl = 'http://52.69.177.29/index.php';

      // PHP側で画像取得する
      $http({
        method: 'POST',
        url: apiUrl,
        data: { image_url: imgUrl },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).
        success(function(data, status) {
          var url_split = imgUrl.split('.');
          var type = url_split[url_split.length - 1].toLowerCase();
          var image_data = "data:image/" + type + ";base64," + data;
          img = new createjs.Bitmap(image_data);

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
            moveTextCenter();
            layer.graphics.beginFill("#000000").drawRect(0, 0, img.image.width, img.image.height);
            img.hitArea = layer;
            stage.update();
          };
        }).
        error(function(data, status){
        });
    }

    function resizeImage(multiple) {
      if (typeof multiple === 'undefined') multiple = 1;

      var MAX_PX_SIZE = 900;
      var w = parseInt(img.image.width * multiple);
      var h = parseInt(img.image.height * multiple);

      // アスペクト比をたもったままリサイズ
      // var scale = Math.min( MAX_PX_SIZE / w, MAX_PX_SIZE / h);
      var scale = multiple;
      img.scaleX = scale;
      img.scaleY = scale;
      var rsizew = img.image.width * scale;
      var rsizeh = img.image.height * scale;
      stage.canvas.width = rsizew;
      stage.canvas.height = rsizeh;
      stage.width = rsizew;
      stage.height = rsizeh;
    }

    function moveTextCenter() {
      // テキストを中央に移動
      container.x = (stage.width  - lgtm_text.getMeasuredWidth())  / 2;
      container.y = (stage.height - lgtm_text.getMeasuredHeight()) / 2;
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


    function setFontSize(target, px) {
      var list = lgtm_text.font.match('^([^ ]+) ([^ ]+) (.+)$');
      target.font = list[1]+" "+px+"px "+list[3];
    }

    function getFontSize(target) {
      var list = target.font.match(/ ([0-9]+)px /);
      return parseInt(list[1]);
    }

    $scope.changeSize = function (diff) {
      var px = getFontSize(lgtm_text);
      px = px + diff;
      if (px > 0) {
        setFontSize(lgtm_text, px);
        setFontSize(lgtm_text_outline, px);
        stage.update();
      }
    }

    $scope.reset = function (diff) {
      var default_px = 80;
      setFontSize(lgtm_text, default_px);
      setFontSize(lgtm_text_outline, default_px);
      moveTextCenter();
      stage.update();
    }

    $scope.changeText = function () {
      lgtm_text.text = $scope.input_text;
      lgtm_text_outline.text = $scope.input_text;
      stage.update();
    }

    $scope.fontList = [
      ['Arial',''],
      ['Russo One','https://fonts.googleapis.com/css?family=Russo+One'],
      ['Bowlby One SC','https://fonts.googleapis.com/css?family=Bowlby+One+SC'],
      ['Fascinate','https://fonts.googleapis.com/css?family=Fascinate'],
      ['Vibur','https://fonts.googleapis.com/css?family=Vibur'],
      ['Audiowide','https://fonts.googleapis.com/css?family=Audiowide'],
      ['Codystar','https://fonts.googleapis.com/css?family=Codystar'],
      ['Vast Shadow','https://fonts.googleapis.com/css?family=Vast+Shadow']
    ];

    $scope.status = {
      isopen: false
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };

    function loadFont(){
      $.each($scope.fontList, function(index, font){
        var name = font[0];
        var url  = font[1];
        var head = angular.element("head");

        if (url !== '') {
          head.append("<link rel='stylesheet' type='text/css' href='" + url + "'>");
        }
      });
    }

    $scope.changeFont = function (font) {
      setFont(font);
    }

    function setFont(font) {
      var list = lgtm_text.font.match('^([^ ]+) ([^ ]+) (.+)$');
      var cssstr = list[1]+" "+list[2]+" "+font;
      lgtm_text.font = cssstr;
      lgtm_text_outline.font = cssstr;
      stage.update();
    }

    $scope.downloadImage = function () {
      var canvas_image = stage.toDataURL("image/png",0.8).replace("image/png", "image/octet-stream");
      try{
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.download = "LGTM";
        a.href = canvas_image;
        a.target = "_self";
        a.click();
      }catch(e){
        alert("ダウンロードに失敗しました");
      }
    }

    $scope.fill_color = '#FFFFFF';
    $scope.stroke_color = '#000000';

    $scope.$watch('fill_color', function(color) {
      lgtm_text.color = color;
      stage.update();
    });

    $scope.$watch('stroke_color', function(color) {
      lgtm_text_outline.color = color;
      stage.update();
    });

    // function imageLoadError(){
    //   alert("Error:画像のロードに失敗しました\n指定したものが画像でないか、取得できません。");
    // }

  });
