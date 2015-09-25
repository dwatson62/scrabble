app.factory('boardTileFactory', function() {

  var BoardTile = function() {
    this.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'M', 'N', 'O'];
    this.vertical = false;
    this.horizontal = false;
  };

  BoardTile.prototype.resetDirection = function() {
    this.vertical = false;
    this.horizontal = false;
  };

  BoardTile.prototype.setTile = function(x, y, board) {
    if (x === 7 && y === 7) { return 'star'; }
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

  // BoardTile.prototype.showStartingTile = function(x, y) {
  //   if (x === 7 && y === 7) {
  //     return 'board-tiles-active';
  //   }
  //   return 'board-tiles-inactive';
  // };

  BoardTile.prototype.showBoardTiles = function(x, y, playerInput) {
    if (this.horizontal === false && this.vertical === false) {
      this.determineDirection(playerInput);
    }
    if (this.vertical === true) {
      return this.showTilesLaidVertically(x, y, playerInput);
    } else if (this.horizontal === true) {
      return this.showTilesLaidHorizontally(x, y, playerInput);
    }
  };

  BoardTile.prototype.determineDirection = function(playerInput) {
    var tile = this.reverseConvert(playerInput[0].position);
    var tile2 = this.reverseConvert(playerInput[1].position);
    if (this.aboveOrBelow(tile, tile2[0], tile2[1]) === true) {
      this.vertical = true;
    } else if (this.eitherSide(tile, tile2[0], tile2[1]) === true) {
      this.horizontal = true;
    }
  };

  BoardTile.prototype.showLaidTiles = function(x, y, playerInput) {
    for (var i in playerInput) {
      if (this.convert(x, y) === playerInput[i].position) { return true; }
    }
  };

  BoardTile.prototype.showWhenOneTileLaid = function(x, y, playerInput) {
    var tile = playerInput[0].position;
    tile = this.reverseConvert(tile);
    if (this.eitherSide(tile, x , y) || this.aboveOrBelow(tile, x, y) ) {
      return 'board-tiles-active';
    }
    return 'board-tiles-inactive';
  };

  BoardTile.prototype.showTilesLaidHorizontally = function(x, y, playerInput) {
    var originalTile = this.reverseConvert(playerInput[0].position);
    if (this.eitherSide(originalTile, x, y) === true) { return 'board-tiles-active'; }
    originalTile = this.reverseConvert(_.last(playerInput).position);
    if (this.eitherSide(originalTile, x, y) === true) { return 'board-tiles-active'; }
    return 'board-tiles-inactive';
  };

  BoardTile.prototype.showTilesLaidVertically = function(x, y, playerInput) {
    var originalTile = this.reverseConvert(playerInput[0].position);
    if (this.aboveOrBelow(originalTile, x, y) === true) { return 'board-tiles-active'; }
    originalTile = this.reverseConvert(_.last(playerInput).position);
    if (this.aboveOrBelow(originalTile, x, y) === true) { return 'board-tiles-active'; }
    return 'board-tiles-inactive';
  };

  BoardTile.prototype.eitherSide = function(originalTile, x, y) {
    return this.oneTileToLeft(originalTile, x, y) || this.oneTileToRight(originalTile, x, y);
  };

  BoardTile.prototype.aboveOrBelow = function(originalTile, x, y) {
    return this.oneTileAbove(originalTile, x, y) || this.oneTileBelow(originalTile, x, y);
  };

  BoardTile.prototype.oneTileAbove = function(originalTile, x, y) {
    return originalTile[0] - 1 == x && originalTile[1] == y;
  };

  BoardTile.prototype.oneTileBelow = function(originalTile, x, y) {
    return originalTile[0] + 1 == x && originalTile[1] == y;
  };

  BoardTile.prototype.oneTileToLeft = function(originalTile, x, y) {
    return originalTile[0] == x && originalTile[1] - 1 == y;
  };

  BoardTile.prototype.oneTileToRight = function(originalTile, x, y) {
    return originalTile[0] == x && originalTile[1] + 1 == y;
  };

  return BoardTile;

});
