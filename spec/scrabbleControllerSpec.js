describe('Scrabble Controller', function() {

  beforeEach(module('ScrabbleApp'));

  var ctrl;

  beforeEach(inject(function($controller) {
    ctrl = $controller('ScrabbleController');
    ctrl.setup();
    ctrl.player1Letters = [{ 'value': 'p', 'status': 'ready' },
                          { 'value': 'u', 'status': 'ready' },
                          { 'value': 't', 'status': 'ready' },
                          { 'value': 'i', 'status': 'ready' },
                          { 'value': 'o', 'status': 'ready' },
                          { 'value': 'r', 'status': 'ready' },
                          { 'value': 't', 'status': 'ready' }];
  }));

  placeLetter = function(index, x, y) {
    ctrl.selectLetter(index);
    ctrl.selectTile(x, y);
  };

  placeTripWord = function() {
    placeLetter(2, 4, 0);
    placeLetter(5, 4, 1);
    placeLetter(3, 4, 2);
    placeLetter(0, 4, 3);
  };

  it('is defined', function() {
    expect(ctrl).toBeDefined();
  });

  describe('Points', function() {

    it('Scores correct points for a word', function() {
      placeTripWord();
      ctrl.getPoints('trip', 'definition');
      expect(ctrl.totalScore).toEqual(6);
    });

  });

  describe('History', function() {

    it('Keeps a history of played words', function() {
      placeTripWord();
      ctrl.getPoints('trip', 'definition');
      expect(ctrl.history[0]).toEqual({ 'word': 'trip', 'points': 6, 'definition': 'definition' });
    });

  });

  describe('Placing letters', function() {

    it('Can place a single letter on board', function() {
      placeLetter(3, 1, 0);
      expect(ctrl.input).toEqual([{ letter: 'i', position: 'B1', 'blank': false }]);
    });

    it('Can place many letters on the board', function() {
      placeLetter(0, 1, 0);
      placeLetter(1, 1, 1);
      placeLetter(2, 1, 2);
      expect(ctrl.input).toEqual([{ letter: 'p', position: 'B1', 'blank': false },
                                  { letter: 'u', position: 'B2', 'blank': false },
                                  { letter: 't', position: 'B3', 'blank': false }
                                  ]);
    });

    it('When placed out of order, it can sort them correctly', function() {
      placeLetter(1, 1, 1);
      placeLetter(0, 1, 0);
      placeLetter(2, 1, 2);
      expect(ctrl.submitted).toEqual([{ letter: 'p', position: 'B1', 'blank': false },
                                  { letter: 'u', position: 'B2', 'blank': false },
                                  { letter: 't', position: 'B3', 'blank': false }
                                  ]);
    });

    it('When placed out of order, near edge of board it can sort them correctly', function() {
      placeLetter(1, 1, 9);
      placeLetter(0, 1, 8);
      placeLetter(2, 1, 10);
      expect(ctrl.submitted).toEqual([{ letter: 'p', position: 'B9', 'blank': false },
                                  { letter: 'u', position: 'B10', 'blank': false },
                                  { letter: 't', position: 'B11', 'blank': false }
                                  ]);
    });

    it('When placed all over the place it can sort them correctly', function() {
      placeLetter(1, 10, 8);
      placeLetter(0, 9, 8);
      placeLetter(2, 11, 8);
      expect(ctrl.submitted).toEqual([{ letter: 'p', position: 'J9', 'blank': false },
                                  { letter: 'u', position: 'K9', 'blank': false },
                                  { letter: 't', position: 'M9', 'blank': false }
                                  ]);
    });

  });

  describe('Can make compound words', function() {

    it('can make a simple compound word', function() {

      ctrl.player1Letters = [{ 'value': 'p', 'status': 'ready' },
                          { 'value': 's', 'status': 'ready' },
                          { 'value': 't', 'status': 'ready' },
                          { 'value': 'i', 'status': 'ready' },
                          { 'value': 'o', 'status': 'ready' },
                          { 'value': 'r', 'status': 'ready' },
                          { 'value': 't', 'status': 'ready' }];
      placeTripWord();
      ctrl.isAWord('trip', 'definition');
      placeLetter(0, 4, 4);
      var word = _.pluck(ctrl.submitted, 'letter').join('');
      expect(word).toEqual('trips');
    });

  });

  describe('Receiving letters', function() {

    it('player starts with 7 letters', function() {
      ctrl.distributeNewLetters();
      expect(ctrl.player1Letters.length).toEqual(7);
    });

    it('after a correct word, player replaces letters to always have 7', function() {
      var word = 'eat';
      var definition = 'To take into the body by the mouth for digestion or absorption.';
      ctrl.isAWord(word, definition);
      expect(ctrl.player1Letters.length).toEqual(7);
    });

    it('after an incorrect word, player keeps the same letters', function() {
      ctrl.notAWord('pti');
      expect(_.pluck(ctrl.player1Letters, 'value')).toEqual([ 'p', 'u', 't', 'i', 'o', 'r', 't' ]);
    });

    it('player can swap an unwanted letter for a random one', function() {
      ctrl.selectLetter(0);
      ctrl.swapLetter();
      // Letter p gets deleted, and other letters shift one place to left
      expect(ctrl.player1Letters[0].value).toEqual('u');
      expect(ctrl.player1Letters.length).toEqual(7);
    });

    it('stores history of where letters are placed', function() {
      var word = 'put';
      var definition = 'Definition';
      placeLetter(0, 1, 0);
      placeLetter(1, 1, 1);
      placeLetter(2, 1, 2);
      ctrl.isAWord(word, definition);
      expect(ctrl.letterHistory).toEqual([
        { letter: 'p', position: 'B1', 'blank': false, 'blank': false },
        { letter: 'u', position: 'B2', 'blank': false },
        { letter: 't', position: 'B3', 'blank': false }
        ]);
    });

  });

});
