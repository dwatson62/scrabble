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

  describe('Points', function() {

    it('can calculate total points for a word', function() {
      var word = [{letter: 't', position: 'E1'}, {letter: 'r', position: 'E2'}, {letter: 'i', position: 'E3'}, {letter: 'p', position: 'E4'}];
      expect(gameService.getPoints(word)).toEqual(6);
    });

    it('can calculate double word bonus', function() {
      var word = [{letter: 't', position: 'B1'}, {letter: 'r', position: 'B2'}, {letter: 'i', position: 'B3'}, {letter: 'p', position: 'B4'}];
      expect(gameService.getPoints(word)).toEqual(12);
    });

    it('can calculate triple word bonus', function() {
      var word = [{letter: 't', position: 'A8'}, {letter: 'r', position: 'A9'}, {letter: 'i', position: 'A10'}, {letter: 'p', position: 'A11'}];
      expect(gameService.getPoints(word)).toEqual(18);
    });

    it('can calculate double letter bonus', function() {
      var word = [{letter: 't', position: 'A4'}, {letter: 'r', position: 'A5'}, {letter: 'i', position: 'A6'}, {letter: 'p', position: 'A7'}];
      expect(gameService.getPoints(word)).toEqual(7);
    });

    it('can calculate triple letter bonus', function() {
      var word = [{letter: 't', position: 'B6'}, {letter: 'r', position: 'B7'}, {letter: 'i', position: 'B8'}, {letter: 'p', position: 'B9'}];
      expect(gameService.getPoints(word)).toEqual(8);
    });

    it('can calculate letter and word bonus combined', function() {
      var word = [{letter: 't', position: 'A1'}, {letter: 'r', position: 'A2'}, {letter: 'i', position: 'A3'}, {letter: 'p', position: 'A4'}];
      expect(gameService.getPoints(word)).toEqual(27);
    });

  });


});
