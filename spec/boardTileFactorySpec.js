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
      var tileToCheck = [0, 0];
      expect(boardTile.showLaidTiles(tileToCheck, playerInput)).toEqual(true);
    });

  });

  describe('Tile arrangement', function() {

    var placedTile = [1, 1];

    it('Knows when a tile is to the left of another', function() {
      var tileToCheck = [1, 0];
      expect(boardTile.oneTileToLeft(tileToCheck, placedTile)).toEqual(true);
    });

    it('Knows when a tile is to the right of another', function() {
      var tileToCheck = [1, 2];
      expect(boardTile.oneTileToRight(tileToCheck, placedTile)).toEqual(true);
    });

    it('Can check either side', function() {
      var tileToCheck = [1, 0];
      expect(boardTile.eitherSide(tileToCheck, placedTile)).toEqual(true);
    });

    it('Knows when a tile is below another', function() {
      var tileToCheck = [2, 1];
      expect(boardTile.oneTileBelow(tileToCheck, placedTile)).toEqual(true);
    });

    it('Knows when a tile is above another', function() {
      var tileToCheck = [0, 1];
      expect(boardTile.oneTileAbove(tileToCheck, placedTile)).toEqual(true);
    });

    it('Can check above and below', function() {
      var tileToCheck = [2, 1];
      expect(boardTile.aboveOrBelow(tileToCheck, placedTile)).toEqual(true);
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
