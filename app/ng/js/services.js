'use strict';

/* Services */

var kedServices = angular.module('kedServices', ['ngResource']);

kedServices.service('apiPath', ['$location',
  function($location){
    this.makeUrl = function(path){
      return $location.protocol() + '://10.21.0.209:8080/news/' + path;
    }
  }
]);

kedServices.factory('PublishedStory', ['$resource', 'apiPath',
  function($resource, apiPath){
    return $resource(apiPath.makeUrl('stories/published/:id'), {id:'@id'}, {
      'query': {isArray:false}
    });
  }
]);

kedServices.factory('PendingStory', ['$resource', 'apiPath',
  function($resource, apiPath){
    return $resource(apiPath.makeUrl('stories/pending/:id'), {id:'@id'}, {
      'status': {method: 'HEAD'},
      'query': {isArray:false}
    });
  }
]);

kedServices.service('pendingSubmissions', ['PendingStory', '$http', 'apiPath',
  function(PendingStory, $http, apiPath){
    var stories = [];
    var pendingCount = 0;

    this.add = function(id){
      stories.push(id);
      pendingCount++;

      toastr.info("New story queued");
    }

    this.all = function(){
      return stories;
    }

    this.count = function(){
      return pendingCount;
    }

    this.cull = function(){
      var snapshot = stories;
      stories = [];

      var promises = snapshot.forEach(function(id){
        $http.head(apiPath.makeUrl('stories/pending/' + id)).then(function(response){
            if(response.status == 202){ //this story hasn't been published, put it back
              stories.push(id);
            } else if(response.status == 200){ //the story has been processed one way or another, decrement our counter and leave it off the list
              pendingCount--;
              console.log(response);
              $http.get(response.config.url).then(function(story){
                toastr.success("Story Processed: '" + story.data.details.headline + "'");
              }, function(e){
                toastr.error("An unknown error occurred!");
                console.trace("Response failed, but should have succeeded", e);
              });
            }
          }, function(error){
            if(error.status == 422){ //the story was rejected and now gives back a 422 UNPROCESSABLE ENTITY response
              pendingCount--;
              $http.get(error.config.url).then(function(e){
                toastr.error("An unknown error occurred!");
                console.trace("Response succeeded, but should have failed", e);
              }, function(story){ //the request SHOULD fail
                toastr.error("Story was rejected due to " + story.data.details.note.toLowerCase());
              });
            } else {
              //couldn't get ahold of the api, put it back
              stories.push(id);
              console.trace("API not available:", error);
            }
          }
        );
      });
    }
  }
]);
