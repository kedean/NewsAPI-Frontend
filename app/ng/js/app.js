'use strict';

/* App Module */

var kedApp = angular.module('ked-news', [
  'ui.router',
  'kedControllers',
  'kedServices'
]);

kedApp.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/stories");

    $stateProvider.
      state('new-story', {
        url: '/new-story',
        views: {
          'sidebar': {
            templateUrl: 'partials/story-list.html',
            controller: 'StoryListCtrl'
          },
          'content':{
            templateUrl: 'partials/new-story.html',
            controller: 'NewStoryCtrl'
          }
        }
      }).
      state('stories', {
        url: '/stories',
        views: {
          'sidebar':{},
          'content':{
            templateUrl: 'partials/story-list.html',
            controller: 'StoryListCtrl'
          }
        }
      });
  }]);
