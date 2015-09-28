describe('Game Factory', function() {

  beforeEach(module('ScrabbleApp'));

  var wordService;
  var bag;

  beforeEach(inject(function(gameFactory) {
    gameService = new gameFactory();
    bag = gameService.createBag();
  }));

  it('creates a bag of letters', function() {
    // without blanks
    expect(gameService.createBag().length).toEqual(98);
    // expect(gameService.createBag().length).toEqual(100);
  });

  it('bag of letters is shuffled', function() {
    var sorted = _.clone(bag).sort();
    expect(bag).not.toEqual(sorted);
  });

  it('creates a board with 60 bonus squares', function() {
    expect(_.keys(gameService.createBoard()).length).toEqual(60);
  });

  it('distributes 7 letters when player has none', function() {
    var currentLetters = [];
    expect(gameService.distributeLetters(currentLetters, bag).length).toEqual(7);
  });

  it('distributes enough letters so player always has 7', function() {
    var currentLetters = ['a', 'b', 'c'];
    expect(gameService.distributeLetters(currentLetters, bag).length).toEqual(7);
  });

  it('can swap a single letter', function() {
    var currentLetters = [{ 'value': 'p', 'status': 'ready' }, { 'value': 'u', 'status': 'ready' }, { 'value': 't', 'status': 'ready' }, { 'value': 'i', 'status': 'ready' }, { 'value': 'o', 'status': 'ready' }, { 'value': 'r', 'status': 'ready' }, { 'value': 't', 'status': 'ready' }];

    var newLetters = gameService.swapLetter(currentLetters, bag, 1);
    expect(newLetters[1]).not.toEqual('p');
  });

});
