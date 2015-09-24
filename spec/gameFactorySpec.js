describe('Game Factory', function() {

  beforeEach(module('ScrabbleApp'));

  var wordService;

  beforeEach(inject(function(gameFactory) {
    gameService = new gameFactory();
  }));

  it('creates a bag of letters', function() {
    expect(gameService.createBag().length).toEqual(100);
  });

});
