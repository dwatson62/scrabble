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
    self.distributeNewLetters();
    self.setupBoard();
  };

  self.tile = function(x, y) {
    if (x === 7 && y === 7) { return 'star'; }
    var tile = self.boardDisplay[gameService.convert(x, y)];
    if (tile === null) { return; }
    if (tile === undefined) { return 'empty'; }
    if (tile.length === 1 || tile === 'blank') { return 'letter-' + tile; }
    return tile;
  };

  self.setupBoard = function() {
    self.board = gameService.createBoard();
    self.boardDisplay = _.clone(self.board);
    self.bonuses = _.clone(self.board);
  };

  self.createBag = function() {
    self.bag = gameService.createBag();
  };

  self.distributeNewLetters = function() {
    self.player1Letters = gameService.distributeLetters(self.player1Letters, self.bag);
  };

  self.playWord = function() {
    var word = _.pluck(self.input, 'letter').join('');
    self.checkLetters = wordService.checkValidLetters(word, self.player1Letters);
    if (self.checkLetters === false) {
      return self.resetRound();
    }
    var request = wordService.createRequest(word);
    self.sendRequest(request, word);
  };

  self.sendRequest = function(request, word) {
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
    self.updateLetters();
    self.input = [];
  };

  self.updateLetters = function() {
    self.player1Letters = self.checkLetters;
    self.distributeNewLetters();
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

  self.selectLetter = function(index) {
    if (self.player1Letters[index].status === 'placed') { return; }
    self.selected = self.player1Letters[index].value;
    self.removeSelectedClass();
    self.player1Letters[index].status = 'selected';
  };

  self.removeSelectedClass = function() {
    _.map(self.player1Letters, function(letter) {
      if (letter.status === 'selected') {
        letter.status = 'ready';
      }
    });
  };

  self.addPlacedClass = function() {
    _.map(self.player1Letters, function(letter) {
      if (letter.status === 'selected') {
        letter.status = 'placed';
      }
    });
  };

  self.alreadyPlaced = function(index) {
    return self.player1Letters[index] === 'placed';
  };

  self.selectTile = function(x, y) {
    var tile = gameService.convert(x, y);
    self.addPlacedClass();
          // Checks if already occupied
    if (_.values(self.board[tile]).length === 1) { return; }

    self.boardDisplay[tile] = self.selected;
    self.input.push({ 'letter': self.selected, 'position': tile });
    self.organiseInput();
    self.selected = null;
  };

  self.organiseInput = function() {
    self.input = wordService.organiseInput(self.input);
  };

  self.showSelected = function(index) {
    return self.player1Letters[index].status
  };

}]);