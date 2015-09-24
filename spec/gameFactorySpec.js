describe('Game Factory', function() {

  beforeEach(module('ScrabbleApp'));

  var wordService;

  beforeEach(inject(function(gameFactory) {
    gameService = new gameFactory();
  }));

  it('Can reverse convert a tile into array coords', function() {
    var coords = gameService.reverseConvert('A1');
    expect(coords).toEqual([0, 0]);
  });

});
