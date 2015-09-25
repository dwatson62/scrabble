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

  it('bag of letters is shuffled', function() {
    var bag = gameService.createBag();
    var sorted = _.clone(bag).sort();
    expect(bag).not.toEqual(sorted);
  });

  it('creates a board with 60 bonus squares', function() {
    expect(_.keys(gameService.createBoard()).length).toEqual(60);
  });

  it('distributes 7 letters when player has none', function() {
    var currentLetters = [];
    var bag = gameService.createBag();
    expect(gameService.distributeLetters(currentLetters, bag).length).toEqual(7);
  });

  it('distributes enough letters so player always has 7', function() {
    var currentLetters = ['a', 'b', 'c'];
    var bag = gameService.createBag();
    expect(gameService.distributeLetters(currentLetters, bag).length).toEqual(7);
  });

});
