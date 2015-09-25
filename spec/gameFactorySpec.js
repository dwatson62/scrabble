describe('Game Factory', function() {

  beforeEach(module('ScrabbleApp'));

  var wordService;

  beforeEach(inject(function(gameFactory) {
    gameService = new gameFactory();
  }));

  it('creates a bag of letters', function() {
    // without blanks
    expect(gameService.createBag().length).toEqual(98);
    // expect(gameService.createBag().length).toEqual(100);
  });

});
