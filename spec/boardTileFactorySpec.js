describe('BoardTile Factory', function() {

  beforeEach(module('ScrabbleApp'));

  var boardTile;

  beforeEach(inject(function(boardTileFactory) {
    boardTile = new boardTileFactory();
  }));

  it('Can convert array coords into a tile', function() {
    expect(boardTile.convert(1, 2)).toEqual('B3');
  });

  it('Can reverse convert a tile into array coords', function() {
    expect(boardTile.reverseConvert('A1')).toEqual([0, 0]);
  });

  describe('Displaying tile class', function() {

    it('Knows when given a tile with a letter already on it', function() {
      var playerInput = [{ 'position': 'A1' }, { 'position': 'A2'}];
      var x = 0;
      var y = 0;
      expect(boardTile.showLaidTiles(x, y, playerInput)).toEqual(true);
    });

  });

  describe('Tile arrangement', function() {

    var originalTile = [1, 1];

    it('Knows when a tile is to the left of another', function() {
      var x = 1;
      var y = 0;
      expect(boardTile.oneTileToLeft(originalTile, x, y)).toEqual(true);
    });

    it('Knows when a tile is to the right of another', function() {
      var x = 1;
      var y = 2;
      expect(boardTile.oneTileToRight(originalTile, x, y)).toEqual(true);
    });

    it('Can check either side', function() {
      var x = 1;
      var y = 0;
      expect(boardTile.eitherSide(originalTile, x, y)).toEqual(true);
    });

    it('Knows when a tile is below another', function() {
      var x = 2;
      var y = 1;
      expect(boardTile.oneTileBelow(originalTile, x, y)).toEqual(true);
    });

    it('Knows when a tile is above another', function() {
      var x = 0;
      var y = 1;
      expect(boardTile.oneTileAbove(originalTile, x, y)).toEqual(true);
    });

    it('Can check above and below', function() {
      var x = 2;
      var y = 1;
      expect(boardTile.aboveOrBelow(originalTile, x, y)).toEqual(true);
    });

  });

  describe('Direction', function() {

    it('Knows when tiles are being laid horizontally', function() {
      var playerInput = [{ 'position': 'A1' }, { 'position': 'A2'}];
      boardTile.determineDirection(playerInput);
      expect(boardTile.horizontal).toEqual(true);
      expect(boardTile.vertical).toEqual(false);
    });

    it('Knows when tiles are being laid vertically', function() {
      var playerInput = [{ 'position': 'A1' }, { 'position': 'B1'}];
      boardTile.determineDirection(playerInput);
      expect(boardTile.horizontal).toEqual(false);
      expect(boardTile.vertical).toEqual(true);
    });

    it('Can reset direction', function() {
      boardTile.horizontal = true;
      boardTile.resetDirection();
      expect(boardTile.horizontal).toEqual(false);
    });

  });

});
