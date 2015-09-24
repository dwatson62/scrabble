describe('Scrabble Controller', function() {

  beforeEach(module('ScrabbleApp'));

  var ctrl;

  beforeEach(inject(function($controller) {
    ctrl = $controller('ScrabbleController');
    ctrl.createBag();
  }));

  it('is defined', function() {
    expect(ctrl).toBeDefined();
  });

  it('creates a bag of letters', function() {
    expect(ctrl.bag.length).toEqual(100);
  });

  describe('Points', function() {

    it('Scores correct points for a word', function() {
      ctrl.getPoints('kite');
      expect(ctrl.totalScore).toEqual(8);
    });

    it('Keeps record of total score', function() {
      ctrl.getPoints('kite');
      ctrl.getPoints('fly');
      expect(ctrl.totalScore).toEqual(17);
    });

  });

  describe('History', function() {

    it('Keeps a definition history of played words', function() {
      var word = 'eat';
      var definition = 'To take into the body by the mouth for digestion or absorption.';
      ctrl.checkLetters = ['i', 'o', 'r', 't'];
      ctrl.isAWord(word, definition);
      expect(ctrl.definitions[0]).toEqual({ 'word': word, 'text': definition});
    });

    it('Keeps a points history of played words', function() {
      var word = 'eat';
      ctrl.player1Letters = ['k', 'e', 'o', 'i', 'o', 'r', 't'];
      ctrl.getPoints(word);
      expect(ctrl.history[0]).toEqual({ 'word': word, 'points': 3});
    });

  });

  describe('Placing letters', function() {

    beforeEach(function() {
      ctrl.setup();
    });

    placeLetter = function(letter, x, y) {
      ctrl.selectLetter(letter);
      ctrl.selectTile(x, y);
    };

    it('Can place a single letter on board', function() {
      placeLetter('i', 1, 0);
      expect(ctrl.input).toEqual([{ letter: 'i', position: 'B1' }]);
    });

    it('Can place many letters on the board', function() {
      placeLetter('p', 1, 0);
      placeLetter('u', 1, 1);
      placeLetter('t', 1, 2);
      expect(ctrl.input).toEqual([{ letter: 'p', position: 'B1' },
                                  { letter: 'u', position: 'B2' },
                                  { letter: 't', position: 'B3' }
                                  ]);
    });

    it('When placed out of order, it can sort them correctly', function() {
      placeLetter('p', 1, 0);
      placeLetter('t', 1, 2);
      placeLetter('u', 1, 1);
      expect(ctrl.input).toEqual([{ letter: 'p', position: 'B1' },
                                  { letter: 'u', position: 'B2' },
                                  { letter: 't', position: 'B3' }
                                  ]);
    });

    it('When placed out of order, near edge of board it can sort them correctly', function() {
      placeLetter('p', 1, 8);
      placeLetter('t', 1, 10);
      placeLetter('u', 1, 9);
      expect(ctrl.input).toEqual([{ letter: 'p', position: 'B9' },
                                  { letter: 'u', position: 'B10' },
                                  { letter: 't', position: 'B11' }
                                  ]);
    });

    it('When placed all over the place it can sort them correctly', function() {
      placeLetter('p', 9, 8);
      placeLetter('t', 11, 8);
      placeLetter('u', 10, 8);
      expect(ctrl.input).toEqual([{ letter: 'p', position: 'J9' },
                                  { letter: 'u', position: 'K9' },
                                  { letter: 't', position: 'M9' }
                                  ]);
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
      ctrl.player1Letters = ['e', 'a', 't', 'i', 'o', 'r', 't'];
      ctrl.checkLetters = ['i', 'o', 'r', 't'];
      ctrl.isAWord(word, definition);
      expect(ctrl.player1Letters.length).toEqual(7);
    });

    it('after an incorrect word, player keeps the same letters', function() {
      ctrl.player1Letters = ['c', 'a', 's', 'i', 'o', 'r', 't'];
      ctrl.notAWord('cas');
      expect(ctrl.player1Letters).toEqual(['c', 'a', 's', 'i', 'o', 'r', 't']);
    });

  });

});
