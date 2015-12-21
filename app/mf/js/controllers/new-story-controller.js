var controller = controller || {};
controller.newStory = function(model){
  var instantiate = function(){
    var container = new Vue({
      el: '#new-story-container',
    });

    //catch the form submission, it's all ajax from here
    document.querySelector("#new-story-container form").onsubmit = function(){
      //we PUT the data to the API server, then poll it until we know what happened
      aja()
        .url(model.apiURI + "/stories")
        .method("PUT")
        .body({headline: container.headline, link: container.link})
        .on("success", function(data){
          model.storyWatcher.add(data.id);
          Utils.goTo("/stories");
        })
        .go();
      return false;
    };
  };

  this.init = function(){
    aja()
      .url('partials/new-story.html')
      .type('html')
      .cache(true)
      .into("#main-container")
      .on("success", instantiate)
      .go();
  }
};
