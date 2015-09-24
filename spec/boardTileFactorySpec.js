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
    var coords = boardTile.reverseConvert('A1');
    expect(coords).toEqual([0, 0]);
  });

});
