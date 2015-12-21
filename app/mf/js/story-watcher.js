var StoryWatcher = function(model){
  humane.info = humane.spawn({addnCls: 'humane-libnotify-info', timeout: 5000});
  humane.error = humane.spawn({addnCls: 'humane-libnotify-error', timeout: 5000});
  humane.success = humane.spawn({addnCls: 'humane-libnotify-success', timeout: 5000});

  var stories = [];
  var pendingCount = 0;

  this.add = function(id){
    stories.push(id);
    pendingCount++;

    humane.info("New story queued");
  };

  this.all = function(){
    return stories;
  };

  this.count = function(){
    return pendingCount;
  };

  this.cull  = function(){
    var snapshot = stories;
    stories = [];

    snapshot.forEach(function(id){
      aja()
        .url(model.apiURI + "stories/" + id)
        .type("json")
        .on("202", function(){ //this story is still pending
          stories.push(id);
        })
        .on("200", function(data){ //story was processed
          pendingCount--;
          if(data.status == 'PUBLISHED'){
            humane.success("Story Processed: '" + data.details.headline + "'");
          }
        })
        .on("404", function(data){
          data = JSON.parse(data);
          pendingCount--;
          humane.error("Story was rejected due to " + data.details.note.toLowerCase());
        })
        .go();
    });
  }
};
