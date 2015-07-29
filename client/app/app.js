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
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $analyticsProvider) {
    $urlRouterProvider
      .otherwise('/');

    $analyticsProvider.virtualPageviews(false)

    $locationProvider.html5Mode(true);

  })
  .run(function($rootScope, $window, $location){
    $rootScope.$on('$stateChangeSuccess', function(event){
      $window._gaq.push(['_trackPageview', $location.path()]);
    });
  });
