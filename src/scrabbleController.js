app.controller('ScrabbleController', ['$http', 'wordsFactory', 'pointsFactory', 'gameFactory', function($http, wordsFactory, pointsFactory, gameFactory) {

  var self = this;

  self.definitions = [];
  self.input = [];
  self.player1Letters = [];
  self.history = [];
  self.totalScore = 0;

  var gameService = new gameFactory();
  var pointService = new pointsFactory();
  var wordService = new wordsFactory();

  self.setup = function() {
    self.createBag();
    self.distributeLetters();
    self.setupBoard();
  };

  self.tile = function(x, y) {
    if (x === 7 && y === 7) { return 'star.png'; }
    var tile = self.boardDisplay[self.convert(x, y)];
    if (tile === undefined) { return 'empty.png'; }
    if (tile.length === 1) { return 'letter-' + tile + '.jpg'; }
    return tile + '.png';
  };

  self.convert = function(x, y) {
    var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'M', 'N', 'O'];
    return letters[x] + String(y + 1);
  };

  self.setupBoard = function() {
    self.board = gameService.createBoard();
    self.boardDisplay = _.clone(self.board);
    self.bonuses = _.clone(self.board);
  };

  self.createBag = function() {
    self.bag = gameService.createBag();
  };

  self.distributeLetters = function() {
    self.player1Letters = gameService.distributeLetters(self.player1Letters, self.bag);
  };

  self.playWord = function() {
    var word = _.pluck(self.input, 'letter').join('');
    var valid = wordService.checkValidLetters(word, self.player1Letters);
    if (valid === false) {
      return self.resetRound();
    }
    self.checkLetters = valid;
    var request = wordService.createRequest(word);
    self.sendRequest(request, word);
  };

  self.sendRequest = function(request, word, valid) {
    $http.get(request).
      then(function(response) {
        if (response.data.length === 0) { return self.notAWord(word); }
        return self.isAWord(word, response.data[0].text);
      });
  };

  self.resetRound = function() {
    self.removeTileFromDisplay();
    self.input = [];
  };

  self.notAWord = function(word) {
    self.definitions.push({ 'word': word, 'text': 'Not a word!' });
    self.resetRound();
  };

  self.isAWord = function(word, definition) {
    self.definitions.push({ 'word': word, 'text': definition });
    self.getPoints(word);
    self.player1Letters = self.checkLetters;
    self.distributeLetters();
    self.input = [];
  };

  self.removeTileFromDisplay = function() {
    _.each(_.pluck(self.input, 'position'), function(position) {
      self.boardDisplay[position] = self.bonuses[position];
    });
  };

  self.getPoints = function(word) {
    var points = pointService.getPoints(word);
    self.history.push( { 'word': word, 'points': points } );
    self.totalScore += points;
  };

  self.selectLetter = function(letter) {
    self.selected = letter;
  };

  self.selectTile = function(x, y) {
    var tile = self.convert(x, y);
    if (self.board[tile] !== undefined) {
      if (self.board[tile].length === 1) { return; }
    }
    self.boardDisplay[tile] = self.selected;
    self.input.push({ 'letter': self.selected, 'position': tile });
    self.organiseInput();
    console.log(_.pluck(self.input, 'letter'));
  };

  self.organiseInput = function() {
    self.input = _.sortBy(self.input, 'position');
  };

  self.showSelected = function(letter) {
    for (var i in self.input) {
      if (self.input[i] === letter) { return 'letter-tile-used'; }
    }
  };

}]);