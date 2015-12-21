var constants = {
  apiURI: window.location.protocol + "//" + window.location.hostname + ':8080/news/'
};

var watcher = new StoryWatcher(constants);

var storyListController = new controller.storyList({
  apiURI: constants.apiURI,
  storyWatcher: watcher,
  storyListRefreshInterval: 10000,
  pendingRefreshInterval: 1000
});
var newStoryController = new controller.newStory({
  apiURI: constants.apiURI,
  storyWatcher: watcher
});

// Routing!
var router = new Router({
  '/': storyListController.init,
  '/stories': storyListController.init,
  '/new-story': newStoryController.init
}).init();

if(Utils.routeEmpty()){
  Utils.goTo("/");
}
