'use strict';

angular.module('lgtmGeneratorApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'dcbImgFallback',
  'angulartics',
  'angulartics.google.analytics'
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
