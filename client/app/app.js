'use strict';

angular.module('lgtmGeneratorApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  //'ngAnimate',
  'ui.router',
  'ui.bootstrap',
  'dcbImgFallback'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  })
  .run(function($rootScope){
    $rootScope.$on('$stateChangeSuccess', function(event, toState){
      ga('send', 'pageview');
    });
  });
