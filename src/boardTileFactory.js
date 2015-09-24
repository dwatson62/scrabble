app.factory('boardTileFactory', function() {

  var BoardTile = function() {
    this.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'M', 'N', 'O'];
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
    splitTile[1] = parseInt(splitTile[1]) - 1;
    return splitTile;
  };

  BoardTile.prototype.showBoardTiles = function(x, y, playerInput) {
    for (var i in playerInput) {
      if (this.convert(x, y) === playerInput[i].position) {
        return 'board-tiles-active';
      }
    }
    if (playerInput.length === 1) {
      return this.showWhenOneTileLaid(x, y, playerInput);
    } else if (playerInput.length > 1) {
      return this.showTilesLaidVertically(x, y, playerInput);
    }
    return 'board-tiles-active';
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
    var tile = playerInput[0].position;
    tile = this.reverseConvert(tile);
    if (this.eitherSide(tile, x, y) === true) { return 'board-tiles-active'; }
    tile = _.last(playerInput).position;
    tile = this.reverseConvert(tile);
    if (this.eitherSide(tile, x, y) === true) { return 'board-tiles-active'; }
    return 'board-tiles-inactive';
  };

  BoardTile.prototype.showTilesLaidVertically = function(x, y, playerInput) {
    var tile = playerInput[0].position;
    tile = this.reverseConvert(tile);
    if (this.aboveOrBelow(tile, x, y) === true) { return 'board-tiles-active'; }
    tile = _.last(playerInput).position;
    tile = this.reverseConvert(tile);
    if (this.aboveOrBelow(tile, x, y) === true) { return 'board-tiles-active'; }
    return 'board-tiles-inactive';
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

  BoardTile.prototype.eitherSide = function(tile, x, y) {
    return this.oneTileToLeft(tile, x, y) || this.oneTileToRight(tile, x, y);
  };

  BoardTile.prototype.aboveOrBelow = function(tile, x, y) {
    return this.oneTileAbove(tile, x, y) || this.oneTileBelow(tile, x, y);
  };

  return BoardTile;

});
