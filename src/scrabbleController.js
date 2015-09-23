app.controller('ScrabbleController', ['$http', function($http) {

  var self = this;
  self.definitions = [];
  self.input = [];
  self.player1Letters = [];
  self.history = [];
  self.totalScore = 0;

  self.setup = function() {
    self.createBag();
    self.distributeLetters();
    self.setupBoard();
  };

  self.tile = function(x, y) {
    if (x === 7 && y === 7) { return 'star.png'; }
    var tile = self.board[self.convert(x, y)];
    if (tile === undefined) { return 'empty.png'; }
    if (tile.length === 1) { return 'letter-' + tile + '.jpg'; }
    return tile + '.png';
  };

  self.convert = function(x, y) {
    var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'M', 'N', 'O'];
    var str = letters[x] + String(y + 1);
    return str;
  };

  self.setupBoard = function() {
    self.board =
      {
        'A1': 'tripleword', 'A4': 'doubleletter', 'A8': 'tripleword', 'A12': 'doubleletter', 'A15': 'tripleword',
        'B2': 'doubleword', 'B6': 'tripleletter', 'B10': 'tripleletter', 'B14': 'doubleword',
        'C3': 'doubleword', 'C7': 'doubleletter', 'C9': 'doubleletter', 'C13': 'doubleword',
        'D1': 'doubleletter', 'D4': 'doubleword', 'D8': 'doubleletter', 'D12': 'doubleword', 'D15': 'doubleletter',
        'E5': 'doubleword', 'E11': 'doubleword',
        'F2': 'tripleletter', 'F6': 'tripleletter', 'F10': 'tripleletter', 'F14': 'tripleletter',
        'G3': 'doubleletter', 'G7': 'doubleletter', 'G9': 'doubleletter', 'G13': 'doubleletter',
        'H1': 'tripleword', 'H4': 'doubleletter', 'H12': 'doubleletter', 'H15': 'tripleword',
        'I3': 'doubleletter', 'I7': 'doubleletter', 'I9': 'doubleletter', 'I13': 'doubleletter',
        'J2': 'tripleletter', 'J6': 'tripleletter', 'J10': 'tripleletter', 'J14': 'tripleletter',
        'K5': 'doubleword', 'K11': 'doubleword',
        'L1': 'doubleletter', 'L4': 'doubleword', 'L8': 'doubleletter', 'L12': 'doubleword', 'L15': 'doubleletter',
        'M3': 'doubleword', 'M7': 'doubleletter', 'M9': 'doubleletter', 'M13': 'doubleword',
        'N2': 'doubleword', 'N6': 'tripleletter', 'N10': 'tripleletter', 'N14': 'doubleword',
        'O1': 'tripleword', 'O4': 'doubleletter', 'O8': 'tripleword', 'O12': 'doubleletter', 'O15': 'tripleword'
      };
    self.boardCopy = _.clone(self.board);
    self.bonuses = self.board;
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
      self.definitions.push({ 'word': self.input, 'text': 'You suck!' });
      self.input = [];
      self.board = self.boardCopy;
      return;
    }
    var request = self.createRequest();
    $http.get(request).
      then(function(response) {
        if (response.data.length === 0) {
          self.definitions.push({ 'word': self.input.join(''), 'text': 'Not a word!' });
          self.input = [];
          self.board = self.boardCopy;
          return;
        }
        self.player1Letters = self.testLetters;
        self.definitions.push({ 'word': self.input.join(''), 'text': response.data[0].text });
        self.getPoints();
        self.distributeLetters();
        self.input = [];
        self.boardCopy = _.clone(self.board);
      });
  };

  self.checkValidLetters = function() {
    var word = self.input;
    self.testLetters = _.clone(self.player1Letters);
    for (var i in word) {
      self.removeFirst(word[i]);
    }
    return self.testLetters.length === (7 - word.length);
  };

  self.removeFirst = function(letter) {
    var blanks = 0;
    for (var j in self.testLetters) {
      if (letter === self.testLetters[j]) {
        return self.testLetters.splice(j, 1);
      } else if (self.testLetters[j] === 'blank') {
        blanks ++;
      }
    }
    if (blanks !== 0) { self.removeFirst('blank'); }
  };

  self.createRequest = function() {
    var url = 'http://api.wordnik.com:80/v4/word.json/';
    var word = self.input.join('') + '/definitions?';
    var stuff = 'limit=1&includeRelated=true&useCanonical=false&includeTags=false';
    var request = url + word + stuff + '&api_key=' + api_key;
    return request;
  };

  self.getPoints = function() {
    var points = 0;
    for (var x in self.input) {
      points += letterValues[self.input[x]].points;
    }
    self.history.push( { 'word': self.input.join(''), 'points': points } );
    self.totalScore += points;
  };

  self.selectLetter = function(letter) {
    self.selected = letter;
  };

  self.selectTile = function(x, y) {
    var tile = self.convert(x, y);
    self.board[tile] = self.selected;
    self.input.push(self.selected);

  };

  self.showSelected = function(letter) {
    for (var i in self.input) {
      if (self.input[i] === letter) {
        return 'letter-tile-used';
      }
    }
  };

}]);