app.controller('ScrabbleController', ['$http', function($http) {

  var self = this;
  self.player1Letters = []

  self.createBag = function() {
    var letters = _.keys(letterValues)
    var bag = []
    for (var letter in letters) {
      for (i = 0; i < letterValues[letters[letter]].tiles; i ++) {
        bag.push(letters[letter])
      }
    }
    self.bag = _.shuffle(bag);
    self.distributeLetters();
  };

  self.distributeLetters = function() {
    self.player1Letters = []
    var number = 7 - self.player1Letters.length
    for (i = 0; i < number; i ++) {
      var x = Math.floor((Math.random() * self.bag.length) + 1);
      var letter = self.bag.splice(x, 1).join()
      self.player1Letters.push(letter);
    }
  };

  self.giveWord = function() {
    var url = 'http://api.wordnik.com:80/v4/word.json/';
    var word = self.input + '/definitions?';
    var stuff = 'limit=1&includeRelated=true&useCanonical=false&includeTags=false';
    var request = url + word + stuff + '&api_key=' + api_key;
    $http.get(request).
      then(function(response) {
        if (response.data.length == 0) {
          console.log('Not a word!')
        } else {
          console.log(response.data[0].text)
          self.getPoints();
        }
      });
  };

  self.getPoints = function() {
    var letters = self.input.split('');
    self.points = [];
    for (var x in letters) {
      var points = letterValues[letters[x]].points
      self.points.push(points);
    }
  };

}]);