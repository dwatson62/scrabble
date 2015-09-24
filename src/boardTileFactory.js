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

  BoardTile.prototype.showBoardTiles = function(x, y, playerInput) {
    if (playerInput.length === 1) {
      return this.showWhenOneTileLaid(x, y, playerInput);
    } else if (this.horizontal === false && this.vertical === false) {
      // need to calculate if letters are being laid horizontal or vertical
      var tile = this.reverseConvert(playerInput[0].position);
      var tile2 = this.reverseConvert(playerInput[1].position);
      if (this.aboveOrBelow(tile, tile2[0], tile2[1]) === true) {
        this.vertical = true;
      } else if (this.eitherSide(tile, x, y) === true) {
        this.horizontal = true;
      }
    }
    if (this.vertical === true) {
      return this.showTilesLaidVertically(x, y, playerInput);
    } else if (this.horizontal === true) {
      return this.showTilesLaidHorizontally(x, y, playerInput);
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
    var tile = this.reverseConvert(playerInput[0].position);
    if (this.eitherSide(tile, x, y) === true) { return 'board-tiles-active'; }
    tile = this.reverseConvert(_.last(playerInput).position);
    if (this.eitherSide(tile, x, y) === true) { return 'board-tiles-active'; }
    return 'board-tiles-inactive';
  };

  BoardTile.prototype.showTilesLaidVertically = function(x, y, playerInput) {
    var tile = this.reverseConvert(playerInput[0].position);
    if (this.aboveOrBelow(tile, x, y) === true) { return 'board-tiles-active'; }
    tile = this.reverseConvert(_.last(playerInput).position);
    if (this.aboveOrBelow(tile, x, y) === true) { return 'board-tiles-active'; }
    return 'board-tiles-inactive';
  };

  BoardTile.prototype.eitherSide = function(tile, x, y) {
    return this.oneTileToLeft(tile, x, y) || this.oneTileToRight(tile, x, y);
  };

  BoardTile.prototype.aboveOrBelow = function(tile, x, y) {
    return this.oneTileAbove(tile, x, y) || this.oneTileBelow(tile, x, y);
  };

  BoardTile.prototype.oneTileAbove = function(tile, x, y) {
    return tile[0] - 1 == x && tile[1] == y;
  };

  BoardTile.prototype.oneTileBelow = function(tile, x, y) {
    return tile[0] + 1 == x && tile[1] == y;
  };

  BoardTile.prototype.oneTileToLeft = function(tile, x, y) {
    return tile[0] == x && tile[1] - 1 == y;
  };

  BoardTile.prototype.oneTileToRight = function(tile, x, y) {
    return tile[0] == x && tile[1] + 1 == y;
  };

  return BoardTile;

});
