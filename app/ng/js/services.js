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

kedServices.factory('Story', ['$resource', 'apiPath',
  function($resource, apiPath){
    return $resource(apiPath.makeUrl('stories/:id'), {id:'@id'}, {

    });
  }
]);

kedServices.service('pendingSubmissions', ['Story',
  function(Story){
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
        (new Story({id:id})).$get().then(
          function(successResponse){
            if(successResponse.status == 'PENDING'){ //this story hasn't been published, put it back
              stories.push(id);
            } else { //the story has been processed one way or another, decrement our counter and leave it off the list
              pendingCount--;

              if(successResponse.status == 'PUBLISHED'){
                toastr.success("Story Processed: '" + successResponse.details.headline + "'");
              }
            }
          }, function(errorResponse){
            if(errorResponse.status == 404 && errorResponse.data.status == 'REJECTED'){ //the story was rejected and now gives back a 404 response
              pendingCount--;
              toastr.error("Story was rejected due to " + errorResponse.data.details.note.toLowerCase());
            } else {
              //couldn't get ahold of the api, put it back
              stories.push(id);
              console.error("API not available:", errorResponse);
            }
          }
        );
      });
    }
  }
]);
