app.factory('boardTileFactory', function() {

  var BoardTile = function() {
    this.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'M', 'N', 'O', 'P', 'Q'];
    this.vertical = false;
    this.horizontal = false;
  };

  BoardTile.prototype.hasDirection = function() {
    if (this.vertical === true || this.horizontal === true) { return true; }
    return false;
  };

  BoardTile.prototype.checkNextTile = function(tileToCheck, placedTile) {
    var tileToCheckCoords = this.reverseConvert(tileToCheck);
    var placedTileCoords = this.reverseConvert(placedTile);
    if (this.vertical === true) {
      return this.isAboveOrBelow(tileToCheckCoords, placedTileCoords);
    }
    else if (this.horizontal === true) {
      return this.isEitherSide(tileToCheckCoords, placedTileCoords);
    }
    return this.isOnAnySide(tileToCheckCoords, placedTileCoords);
  };

  BoardTile.prototype.resetDirection = function() {
    this.vertical = false;
    this.horizontal = false;
  };

  BoardTile.prototype.setTile = function(x, y, board) {
    var tile = board[this.convert(x, y)];
    if (tile === null) { return; }
    if (tile === undefined) { return 'empty'; }
    if (tile.length === 1 || tile === 'blank') { return 'letter-' + tile; }
    return tile;
  };

  BoardTile.prototype.convert = function(x, y) {
    return this.letters[x] + String(y + 1);
  };

  BoardTile.prototype.reverseConvert = function(tile) {
    var splitTile = _.initial(tile.split(/(\d+)/));
    splitTile[0] = _.indexOf(this.letters, splitTile[0]);
    splitTile[1] = parseInt(splitTile[1], 10) - 1;
    return splitTile;
  };

  BoardTile.prototype.showStartingTile = function(x, y) {
    if (x === 7 && y === 7) {
      return 'board-tiles-active';
    }
    return 'board-tiles-inactive';
  };

  BoardTile.prototype.showBoardTiles = function(tileToCheck, playerInput) {
    if (this.hasDirection() === false) {
      this.determineDirection(playerInput);
    }
    if (this.vertical === true) {
      return this.showTilesLaidVertically(tileToCheck, playerInput);
    } else if (this.horizontal === true) {
      return this.showTilesLaidHorizontally(tileToCheck, playerInput);
    }
  };

  BoardTile.prototype.determineDirection = function(playerInput) {
    if (playerInput.length === 1) { return; }
    var placedTile = this.reverseConvert(playerInput[0].position);
    var tileToCheck = this.reverseConvert(playerInput[1].position);
    if (this.isAboveOrBelow(tileToCheck, placedTile) === true) {
      this.vertical = true;
    } else if (this.isEitherSide(tileToCheck, placedTile) === true) {
      this.horizontal = true;
    }
  };

  BoardTile.prototype.showLaidTiles = function(tileToCheck, playerInput, letterHistory) {
    var x = tileToCheck[0];
    var y = tileToCheck[1];
    for (var i in playerInput) {
      if (this.convert(x, y) === playerInput[i].position) { return true; }
    }
    for (var j in letterHistory) {
      if (this.convert(x, y) === letterHistory[j].position) { return true; }
    }
  };

  BoardTile.prototype.showWhenOneTileLaid = function(tileToCheck, playerInput) {
    var placedTile = this.reverseConvert(playerInput[0].position);
    if (this.isOnAnySide(tileToCheck, placedTile) ) {
      return 'board-tiles-active';
    }
    return 'board-tiles-inactive';
  };

  BoardTile.prototype.showTilesLaidHorizontally = function(tileToCheck, playerInput) {
    var placedTile = this.reverseConvert(playerInput[0].position);
    if (this.isEitherSide(tileToCheck, placedTile) === true) { return 'board-tiles-active'; }
    placedTile = this.reverseConvert(_.last(playerInput).position);
    if (this.isEitherSide(tileToCheck, placedTile) === true) { return 'board-tiles-active'; }
    return 'board-tiles-inactive';
  };

  BoardTile.prototype.showTilesLaidVertically = function(tileToCheck, playerInput) {
    var placedTile = this.reverseConvert(playerInput[0].position);
    if (this.isAboveOrBelow(tileToCheck, placedTile) === true) { return 'board-tiles-active'; }
    placedTile = this.reverseConvert(_.last(playerInput).position);
    if (this.isAboveOrBelow(tileToCheck, placedTile) === true) { return 'board-tiles-active'; }
    return 'board-tiles-inactive';
  };

  BoardTile.prototype.isOnAnySide = function(tileToCheck, placedTile) {
    return this.isAboveOrBelow(tileToCheck, placedTile) || this.isEitherSide(tileToCheck, placedTile);
  };

  BoardTile.prototype.isEitherSide = function(tileToCheck, placedTile) {
    return this.isOneTileToLeft(tileToCheck, placedTile) || this.isOneTileToRight(tileToCheck, placedTile);
  };

  BoardTile.prototype.isAboveOrBelow = function(tileToCheck, placedTile) {
    return this.isOneTileAbove(tileToCheck, placedTile) || this.isOneTileBelow(tileToCheck, placedTile);
  };

  BoardTile.prototype.isOneTileAbove = function(tileToCheck, placedTile) {
    return placedTile[0] - 1 === tileToCheck[0] && placedTile[1] === tileToCheck[1];
  };

  BoardTile.prototype.isOneTileBelow = function(tileToCheck, placedTile) {
    return placedTile[0] + 1 === tileToCheck[0] && placedTile[1] === tileToCheck[1];
  };

  BoardTile.prototype.isOneTileToLeft = function(tileToCheck, placedTile) {
    return placedTile[0] === tileToCheck[0] && placedTile[1] - 1 === tileToCheck[1];
  };

  BoardTile.prototype.isOneTileToRight = function(tileToCheck, placedTile) {
    return placedTile[0] === tileToCheck[0] && placedTile[1] + 1 === tileToCheck[1];
  };

  return BoardTile;

});
