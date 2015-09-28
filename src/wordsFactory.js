app.factory('wordsFactory', ['$http', function($http) {

  var Words = function() {};

  Words.prototype.checkValidLetters = function(word, playerLetters) {
    var checkLetters = _.clone(playerLetters);
    checkLetters = _.reject(checkLetters, function(letter) {
      return letter.status === 'placed';
    });
    // In case the player used letters they didn't have
    // This should not happen though
    if (checkLetters.length === (7 - word.length)) {
     return checkLetters;
    }
    return false;
  };

  Words.prototype.organiseInput = function(letters) {
    letters = _.chain(letters)
      .sortBy('position')
      .groupBy(function(letter) { return letter.position.length; })
      .value();
    return _.flatten([ _.values(letters[2]), _.values(letters[3]) ]);
  };

  Words.prototype.addSelectedClass = function(letters, index) {
    letters[index].status = 'selected';
    return letters;
  };

  Words.prototype.addPlacedClass = function(letters) {
    return _.each(letters, function(letter) {
      if (letter.status === 'selected') {
        letter.status = 'placed';
      }
    });
  };

  Words.prototype.removeAllPlacedClasses = function(letters) {
    return _.each(letters, function(letter) {
      if (letter.status === 'placed') {
        letter.status = 'ready';
      }
    });
  };

  Words.prototype.removeAllSelectedClass = function(letters) {
    return _.each(letters, function(letter) {
      if (letter.status === 'selected') {
        letter.status = 'ready';
      }
    });
  };

  return Words;

}]);
