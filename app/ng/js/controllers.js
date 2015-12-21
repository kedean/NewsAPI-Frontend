'use strict';

/* Controllers */

var kedControllers = angular.module('kedControllers', []);

/*
 * New Story form
 */
kedControllers.controller('NewStoryCtrl', ['$scope', '$location', 'pendingSubmissions', 'Story',
  function($scope, $location, pendingSubmissions, Story) {
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
      var story = new Story();
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
kedControllers.controller('StoryListCtrl', ['$scope', '$state', '$interval', '$timeout', 'pendingSubmissions', 'Story', 'apiPath',
  function($scope, $state, $interval, $timeout, pendingSubmissions, Story, apiPath) {
    $scope.showSubmissionLink = $state.is("stories");
    $scope.apiURI = apiPath.makeUrl('');
    $scope.stories = Story.query();

    var refreshPeriod = 10000; // 10 seconds
    var refreshList = function(){
      Story.query(function(newStories){
        Utils.mergeArrays(newStories, $scope.stories, function(a, b){ return a.id == b.id; });
      });
    };

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
