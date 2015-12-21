// The grid component
Vue.component('story-grid', {
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    api: String
  },
  data: function () {
    z = this;
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    }
  }
});

var controller = controller || {};
controller.storyList = function(model){
  var instantiate = function(){
    // Instantiate the component
    var container = new Vue({
      el: '#story-list-container',
      data: {
        apiURI: model.apiURI,
        gridColumns: ['name', 'power'],
        gridData: [],
        pendingCount: 0
      }
    });

    // Set up the data stream
    var refreshTimeout = null;
    var periodicRefresh = function(){
      clearTimeout(refreshTimeout);

      aja()
        .url(model.apiURI + "stories/")
        .on('success', function(data){
          container.gridData = data;
          refreshTimeout = window.setTimeout(periodicRefresh, model.storyListRefreshInterval);
        })
        .go();
    };
    periodicRefresh();

    // Set up pending story refresh
    var periodicPendingCheck = function(){
      model.storyWatcher.cull();
      var newPendingCount = model.storyWatcher.count();

      if(newPendingCount != container.pendingCount){
        container.pendingCount = newPendingCount;
        periodicRefresh();
      }
    };
    periodicPendingCheck();
    window.setInterval(periodicPendingCheck, model.pendingRefreshInterval);
  };

  this.init = function(){
    aja()
      .url('partials/story-list.html')
      .type('html')
      .cache(true)
      .into("#main-container")
      .on("success", instantiate)
      .go();
  }
};
