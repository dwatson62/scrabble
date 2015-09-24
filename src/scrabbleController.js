app.controller('ScrabbleController', ['$http', 'wordsFactory', 'pointsFactory', 'gameFactory', 'boardTileFactory', function($http, wordsFactory, pointsFactory, gameFactory, boardTileFactory) {

  var self = this;

  self.definitions = [];
  self.input = [];
  self.player1Letters = [];
  self.history = [];
  self.totalScore = 0;

  var boardTileService = new boardTileFactory();
  var gameService = new gameFactory();
  var pointService = new pointsFactory();
  var wordService = new wordsFactory();

          // Game setup

  self.setup = function() {
    self.bag = gameService.createBag();
    self.bonuses = gameService.createBoard();
    self.boardDisplay = _.clone(self.bonuses);
    self.distributeNewLetters();
  };

  self.distributeNewLetters = function() {
    self.player1Letters = gameService.distributeLetters(self.player1Letters, self.bag);
  };

          // Rendering correct tiles

  self.tile = function(x, y) {
    return boardTileService.setTile(x, y, self.boardDisplay);
  };

          // Displaying player tiles at correct opacity

  self.showSelected = function(index) {
    return self.player1Letters[index].status;
  };

  self.removeSelectedClass = function() {
    self.player1Letters = wordService.removeSelectedClass(self.player1Letters);
  };

  self.removePlacedClass = function() {
    self.player1Letters = wordService.removePlacedClass(self.player1Letters);
  };

  self.addSelectedClass = function(index) {
    self.player1Letters = wordService.addSelectedClass(self.player1Letters, index);
  };

  self.addPlacedClass = function() {
    self.player1Letters = wordService.addPlacedClass(self.player1Letters);
  };

  self.alreadyPlaced = function(index) {
    return self.player1Letters[index] === 'placed';
  };

          // Display board tiles at correct opacity

  self.showBoardTiles = function(x, y) {
    return boardTileService.showBoardTiles(x, y, self.input);
  };

  self.disabledTile = function(x, y) {
    return self.showBoardTiles(x, y) === 'board-tiles-inactive';
  };

          // Placing tiles on the board

  self.selectLetter = function(index) {
    if (self.player1Letters[index].status === 'placed') { return; }
    self.selected = self.player1Letters[index].value;
    self.removeSelectedClass();
    self.addSelectedClass(index);
  };

  self.selectTile = function(x, y) {
    var tile = boardTileService.convert(x, y);
    if (self.invalidTile(x, y, tile) === false) { return; }
    self.addPlacedClass();
    self.boardDisplay[tile] = self.selected;
    self.input.push({ 'letter': self.selected, 'position': tile });
    self.organiseInput();
    self.selected = null;
  };

  self.invalidTile = function(x, y, tile) {
    if (self.disabledTile(x, y) === true || self.selected == null) { return false; }
    // Checks if already occupied
    if (self.boardDisplay[tile] !== undefined) {
      if (self.boardDisplay[tile].length === 1) { return false; }
    }
  };

  self.organiseInput = function() {
    self.input = wordService.organiseInput(self.input);
  };

          // Playing the word

  self.playWord = function() {
    var word = _.pluck(self.input, 'letter').join('');
    self.checkLetters = wordService.checkValidLetters(word, self.player1Letters);
    if (self.checkLetters === false) { return self.resetRound(); }
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

  self.getPoints = function(word) {
    var points = pointService.getPoints(word);
    self.history.push( { 'word': word, 'points': points } );
    self.totalScore += points;
  };

          // Clearing

  self.resetRound = function() {
    self.removeTileFromDisplay();
    self.input = [];
    self.removePlacedClass();
  };

   self.removeTileFromDisplay = function() {
    _.each(_.pluck(self.input, 'position'), function(position) {
      self.boardDisplay[position] = self.bonuses[position];
    });
  };

  self.clear = function() {
    self.removeTileFromDisplay();
    self.removePlacedClass();
    self.input = [];
  };

}]);