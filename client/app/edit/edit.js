'use strict';

angular.module('lgtmGeneratorApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('edit', {
        url: '/edit',
        templateUrl: 'app/edit/edit.html',
        controller: 'EditCtrl',
        params: {'url' : null},
      });
  });
