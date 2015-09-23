app.factory('wordsFactory', ['$http', function($http) {

  var Words = function() {};

  Words.prototype.checkValidLetters = function(word, playerLetters) {
    wordArray = word.split('');
    this.checkLetters = _.clone(playerLetters);
    for (var i in wordArray) {
      this.removeFirst(wordArray[i]);
    }
    if (this.checkLetters.length === (7 - word.length)) {
     return this.checkLetters;
    }
    return false;
  };

  Words.prototype.removeFirst = function(letter) {
    var blanks = 0;
    for (var j in this.checkLetters) {
      if (letter === this.checkLetters[j]) {
        return this.checkLetters.splice(j, 1);
      } else if (this.checkLetters[j] === 'blank') {
        blanks ++;
      }
    }
    if (blanks !== 0) { this.removeFirst('blank'); }
    return this.checkLetters;
  };

  Words.prototype.createRequest = function(word) {
    var url = 'http://api.wordnik.com:80/v4/word.json/';
    var wordDef = word + '/definitions?';
    var stuff = 'limit=1&includeRelated=true&useCanonical=false&includeTags=false';
    var request = url + wordDef + stuff + '&api_key=' + api_key;
    return request;
  };

  return Words;

}]);
