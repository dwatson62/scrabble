app.controller('ScrabbleController', ['$http', function($http) {

  var self = this;
  self.player1Letters = [];
  self.history = [];
  self.totalScore = 0;

  self.setup = function() {
    self.createBag();
    self.distributeLetters();
  };

  self.createBag = function() {
    var letters = _.keys(letterValues);
    var bag = [];
    for (var letter in letters) {
      for (i = 0; i < letterValues[letters[letter]].tiles; i ++) {
        bag.push(letters[letter]);
      }
    }
    self.bag = _.shuffle(bag);
  };

  self.distributeLetters = function() {
    var number = 7 - self.player1Letters.length;
    for (i = 0; i < number; i ++) {
      var x = Math.floor((Math.random() * self.bag.length));
      var letter = self.bag.splice(x, 1).join();
      self.player1Letters.push(letter);
    }
  };

  self.giveWord = function() {
    if (self.checkValidLetters() === false) {
      console.log('You suck')
      return;
    }
    var request = self.createRequest();
    console.log(self.input)
    $http.get(request).
      then(function(response) {
        if (response.data.length === 0) {
          console.log('Not a word!');
        } else {
          self.player1Letters = self.testLetters;
          console.log(response.data[0].text);
          self.getPoints();
          self.distributeLetters();
        }
      });
  };

  self.checkValidLetters = function() {
    var word = self.input.split('');
    self.testLetters = _.clone(self.player1Letters);
    for (var i in word) {
      for (var j in self.testLetters) {
        if (word[i] === self.testLetters[j]) {
          self.testLetters.splice(j, 1);
          break;
        }
      }
    }
    return self.testLetters.length === (7 - word.length)
  };

  self.createRequest = function() {
    var url = 'http://api.wordnik.com:80/v4/word.json/';
    var word = self.input + '/definitions?';
    var stuff = 'limit=1&includeRelated=true&useCanonical=false&includeTags=false';
    var request = url + word + stuff + '&api_key=' + api_key;
    return request;
  };

  self.getPoints = function() {
    var letters = self.input.split('');
    var points = 0;
    for (var x in letters) {
      points += letterValues[letters[x]].points;
    }
    self.history.push( { 'word': self.input, 'points': points } );
    self.totalScore += points;
  };

}]);