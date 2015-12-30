'use strict';

/* Controllers */

var kedControllers = angular.module('kedControllers', []);

/*
 * New Story form
 */
kedControllers.controller('NewStoryCtrl', ['$scope', '$location', 'pendingSubmissions', 'PendingStory',
  function($scope, $location, pendingSubmissions, PendingStory) {
    var putSuccessHandler = function(response){
      pendingSubmissions.add(response.id);
      $location.url("/stories");
    }
    var putErrorHandler = function(response){
      if(response.status == 422){ //error in the data sent
        console.log("Validation errors");
      } else{
        console.log("I don't know what happened");
      }
    }

    $scope.putStory = function(){
      var story = new PendingStory();
      story.headline = $scope.headline;
      story.link = $scope.link;
      story.$save(putSuccessHandler, putErrorHandler);
    }
  }
]);

var z;
/*
 * Main listing of all stories
 */
kedControllers.controller('StoryListCtrl', ['$scope', '$state', '$interval', '$timeout', 'pendingSubmissions', 'PublishedStory', 'apiPath',
  function($scope, $state, $interval, $timeout, pendingSubmissions, PublishedStory, apiPath) {
    $scope.showSubmissionLink = $state.is("stories");
    $scope.apiURI = apiPath.makeUrl('');
    $scope.stories = [];

    var refreshPeriod = 10000; // 10 seconds
    var refreshList = function(){
      PublishedStory.query(function(newStories){
        Utils.mergeArrays(newStories._embedded.stories, $scope.stories, function(a, b){ return a.id == b.id; });
      });
    };

    refreshList();
    $interval(refreshList, refreshPeriod);

    $scope.pendingCount = 0;
    var updateSubmissionPeriod = 2000;
    var updateSubmissionCount = function(){
      pendingSubmissions.cull();
      var newPendingCount = pendingSubmissions.count();

      if(newPendingCount != $scope.pendingCount){
        $scope.pendingCount = newPendingCount;
        refreshList();
      }
    };

    updateSubmissionCount();
    $interval(updateSubmissionCount, updateSubmissionPeriod);

    $scope.sortOrder = '-details.metadata.publishTime';
  }
]);
