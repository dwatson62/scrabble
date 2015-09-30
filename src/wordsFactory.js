app.factory('wordsFactory', ['$http', function($http) {

  var Words = function() {};

  Words.prototype.removePlacedLetters = function(playerLetters) {
    return _.reject(playerLetters, function(letter) {
      return letter.status === 'placed';
    });
  };

  Words.prototype.organiseSubmission = function(letters) {
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
