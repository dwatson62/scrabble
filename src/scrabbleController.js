app.controller('ScrabbleController', ['$http', 'wordsFactory', 'gameFactory', 'boardTileFactory', 'ngDialog', function($http, wordsFactory, gameFactory, boardTileFactory, ngDialog) {

  var self = this;

  self.input = [];
  self.submitted = [];
  self.player1Letters = [];
  self.letterHistory = [];
  self.history = [];
  self.selected = null;
  self.totalScore = 0;

  self.test = 'Enter a letter';

  var boardTileService = new boardTileFactory();
  var gameService = new gameFactory();
  var wordService = new wordsFactory();

          // Game setup

  self.setup = function() {
    self.bag = gameService.createBag();
    self.bonuses = gameService.createBoard();
    self.boardDisplay = _.clone(self.bonuses);
    self.distributeNewLetters();
  };

  self.distributeNewLetters = function() {
    if (self.bag.length < (7 - self.player1Letters.length)) {
      console.log('Game Over!');
      return;
    }
    self.player1Letters = gameService.distributeLetters(self.player1Letters, self.bag);
  };

          // Rendering correct tiles

  self.tile = function(x, y) {
    return boardTileService.setTile(x, y, self.boardDisplay);
  };

          // Displaying player letters at correct opacity

  self.showSelected = function(index) {
    return self.player1Letters[index].status;
  };

  self.alreadyPlaced = function(index) {
    return self.player1Letters[index] === 'placed';
  };

  self.removeAllSelectedClass = function() {
    self.player1Letters = wordService.removeAllSelectedClass(self.player1Letters);
  };

  self.removeAllPlacedClasses = function() {
    self.player1Letters = wordService.removeAllPlacedClasses(self.player1Letters);
  };

  self.addSelectedClass = function(index) {
    self.player1Letters = wordService.addSelectedClass(self.player1Letters, index);
  };

  self.addPlacedClass = function() {
    self.player1Letters = wordService.addPlacedClass(self.player1Letters);
  };

  self.findSelected = function() {
    return _.indexOf(_.pluck(self.player1Letters, 'status'), 'selected');
  };

          // Display board tiles at correct opacity

  self.showBoardTiles = function(x, y) {
    var tileToCheck = [x, y];
    if (boardTileService.showLaidTiles(tileToCheck, self.submitted, self.letterHistory) === true) {
      return 'board-tiles-active';
    }
    if (self.submitted.length === 0) { return 'board-tiles-active'; }
    if (self.submitted.length === 1) {
      return boardTileService.showWhenOneTileLaid(tileToCheck, self.submitted);
    }
    return boardTileService.showBoardTiles(tileToCheck, self.submitted);
  };

  self.startingTile = function(x, y) {
    // Not in use yet.
    // Will force players to place tiles on the star at start of game
    if (self.totalScore === 0 && self.input.length === 0) {
      return boardTileService.showStartingTile(x, y);
    }
  };

  self.disabledTile = function(x, y) {
    return self.showBoardTiles(x, y) === 'board-tiles-inactive';
  };

          // Placing tiles on the board

  self.selectLetter = function(index) {
    if (self.player1Letters[index].status === 'placed') { return; }
    if (self.player1Letters[index].status === 'selected') {
      return self.undoSelect(index);
    }
    self.selected = self.player1Letters[index].value;
    self.removeAllSelectedClass();
    self.addSelectedClass(index);
  };

  self.undoSelect = function(index) {
    self.selected = null;
    self.removeAllSelectedClass();
  };

  self.selectTile = function(x, y) {
    var tile = boardTileService.convert(x, y);
    if (self.invalidTile(x, y, tile) === false) { return; }
    self.addPlacedClass();
    if (self.selected === 'blank') {
      self.assignLetterToBlank(tile);
    } else {
      self.addToInput(tile, false);
    }
    self.checkForCompoundWord();
  };

  self.checkForCompoundWord = function() {
    for (var i in self.letterHistory) {
      for (var j in self.submitted) {
        var tileToCheck = self.letterHistory[i].position;
        var placedTile = self.submitted[j].position;
        var isValidtile = boardTileService.checkNextTile(tileToCheck, placedTile);
        if (isValidtile === true && self.tileAlreadyAdded(tileToCheck) === false) {
          self.addToCompoundWord(self.letterHistory[i]);
        }
      }
    }
    self.organiseSubmission();
  };

  self.tileAlreadyAdded = function(tileToCheck) {
    return _.contains(_.pluck(self.submitted, 'position'), tileToCheck);
  };

  self.addToCompoundWord = function(letter) {
    self.submitted.push(letter);
    boardTileService.determineDirection(self.submitted);
    self.checkForCompoundWord();
  };

  self.assignLetterToBlank = function(tile) {
    ngDialog.openConfirm({ template: 'popupForm',
                          controller: 'ScrabbleController',
                          controllerAs:'scrbCtrl'
                        }).then(function(letter) {
                          if (/[a-z]/i.test(letter) === true && letter !== undefined) {
                            self.selected = letter.toLowerCase();
                            self.addToInput(tile, true);
                          }
                        });
  };

  self.addToInput = function(tile, isBlank) {
    self.boardDisplay[tile] = self.selected;
    self.submitted.push({ 'letter': self.selected, 'position': tile, 'blank': isBlank });
    self.input.push({ 'letter': self.selected, 'position': tile, 'blank': isBlank });
    self.organiseSubmission();
    self.selected = null;
  };

  self.invalidTile = function(x, y, tile) {
    if (self.disabledTile(x, y) === true || self.selected == null) { return false; }
    // Checks if already occupied
    if (self.boardDisplay[tile] !== undefined) {
      if (self.boardDisplay[tile].length === 1) { return false; }
    }
  };

  self.organiseSubmission = function() {
    self.submitted = wordService.organiseSubmission(self.submitted);
  };

  self.swapLetter = function() {
    var index = self.findSelected();
    self.player1Letters = gameService.swapLetter(self.player1Letters, self.bag, index);
    self.selected = null;
  };

          // Playing the word

  self.playWord = function() {
    var word = _.pluck(self.submitted, 'letter').join('');
    self.sendRequest(word);
  };

  self.sendRequest = function(word) {
    var config = { params: { 'word': word } };
    $http.get('/word', config).
      then(function(response) {
        if (response.data.length === 0) { return self.notAWord(word); }
        return self.isAWord(word, response.data[0].text);
      });
  };

  self.notAWord = function(word) {
    self.history.push({ 'word': word, 'points': 0, 'definition': 'Not a word!' });
    self.resetRound();
  };

  self.isAWord = function(word, definition) {
    // any extra letter in 'word' that are no in self.input are from compound words
    // these still get points, but don't get bonuses or added to self.history
    // these need to be added to self.input
    self.getPoints(word, definition);
    self.player1Letters = wordService.removePlacedLetters(self.player1Letters);
    self.distributeNewLetters();
    self.updateLetterHistory();
    self.input = [];
    self.submitted = [];
    boardTileService.resetDirection();
  };

  self.updateLetterHistory = function() {
    _.each(self.input, function(letter) {
      self.letterHistory.push(letter);
    });
  };

  self.getPoints = function(word, definition) {
    var points = gameService.getPoints(self.submitted);
    self.history.push( { 'word': word, 'points': points, 'definition': definition } );
    self.totalScore += points;

  };

          // Clearing

  self.resetRound = function() {
    self.removeTileFromDisplay();
    self.input = [];
    self.submitted = [];
    self.removeAllPlacedClasses();
  };

   self.removeTileFromDisplay = function() {
    _.each(_.pluck(self.input, 'position'), function(position) {
      self.boardDisplay[position] = self.bonuses[position];
    });
    boardTileService.resetDirection();
  };

  self.clear = function() {
    self.removeTileFromDisplay();
    self.removeAllPlacedClasses();
    self.input = [];
    self.submitted = [];
  };

}]);