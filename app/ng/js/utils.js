var Utils = {
  /*
   * Merges the contents of src into dest, and removes items from dest that are not found in src.
   * This guarantees that the items from src also found in dest will stay the same object reference, which improves performance in Angular.
   * @param src the contents to merge into dest
   * @param dest the destination array
   * @param mergeComparator a function to compare elements from src and dest, if it returns true then elements are considered equal
   */
  mergeArrays: function(src, dest, mergeComparator){
    //add new stories
    src.forEach(function(s){
      var found = false;
      dest.forEach(function(d){
        if(mergeComparator(s, d)){
          found = true;
        }
      });

      if(!found){
        dest.push(s);
      }
    });

    //remove old stories
    dest.forEach(function(d, index){
      var found = false;
      src.forEach(function(s){
        if(mergeComparator(s, d)){
          found = true;
        }
      });

      if(!found){
        dest.splice(index, 1);
      }
    });
  }
};
