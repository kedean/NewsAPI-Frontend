var Utils = {
  goTo: function(place){
    window.location.hash = place;
  },
  routeEmpty: function(place){
    return !window.location.hash || window.location.hash.length == 0;
  }
};
