describe('Scrabble Controller', function() {

  beforeEach(module('ScrabbleApp'));

  var ctrl;

  beforeEach(inject(function($controller) {
    ctrl = $controller('ScrabbleController');
    ctrl.setup();
  }));

  it('is defined', function() {
    expect(ctrl).toBeDefined();
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
      ctrl.player1Letters = [{ 'value': 'p', 'status': 'ready' }, { 'value': 'u', 'status': 'ready' }, { 'value': 't', 'status': 'ready' }, { 'value': 'i', 'status': 'ready' }, { 'value': 'o', 'status': 'ready' }, { 'value': 'r', 'status': 'ready' }, { 'value': 't', 'status': 'ready' }];
    });

    placeLetter = function(index, x, y) {
      ctrl.selectLetter(index);
      ctrl.selectTile(x, y);
    };

    it('Can place a single letter on board', function() {
      placeLetter(3, 1, 0);
      expect(ctrl.input).toEqual([{ letter: 'i', position: 'B1' }]);
    });

    it('Can place many letters on the board', function() {
      placeLetter(0, 1, 0);
      placeLetter(1, 1, 1);
      placeLetter(2, 1, 2);
      expect(ctrl.input).toEqual([{ letter: 'p', position: 'B1' },
                                  { letter: 'u', position: 'B2' },
                                  { letter: 't', position: 'B3' }
                                  ]);
    });

    it('When placed out of order, it can sort them correctly', function() {
      placeLetter(1, 1, 1);
      placeLetter(0, 1, 0);
      placeLetter(2, 1, 2);
      expect(ctrl.input).toEqual([{ letter: 'p', position: 'B1' },
                                  { letter: 'u', position: 'B2' },
                                  { letter: 't', position: 'B3' }
                                  ]);
    });

    it('When placed out of order, near edge of board it can sort them correctly', function() {
      placeLetter(1, 1, 9);
      placeLetter(0, 1, 8);
      placeLetter(2, 1, 10);
      expect(ctrl.input).toEqual([{ letter: 'p', position: 'B9' },
                                  { letter: 'u', position: 'B10' },
                                  { letter: 't', position: 'B11' }
                                  ]);
    });

    it('When placed all over the place it can sort them correctly', function() {
      placeLetter(1, 10, 8);
      placeLetter(0, 9, 8);
      placeLetter(2, 11, 8);
      expect(ctrl.input).toEqual([{ letter: 'p', position: 'J9' },
                                  { letter: 'u', position: 'K9' },
                                  { letter: 't', position: 'M9' }
                                  ]);
    });

  });

  describe('Receiving letters', function() {

    beforeEach(function() {
      ctrl.setup();
      ctrl.player1Letters = [{ 'value': 'p', 'status': 'ready' }, { 'value': 'u', 'status': 'ready' }, { 'value': 't', 'status': 'ready' }, { 'value': 'i', 'status': 'ready' }, { 'value': 'o', 'status': 'ready' }, { 'value': 'r', 'status': 'ready' }, { 'value': 't', 'status': 'ready' }];
    });

    it('player starts with 7 letters', function() {
      ctrl.distributeNewLetters();
      expect(ctrl.player1Letters.length).toEqual(7);
    });

    it('after a correct word, player replaces letters to always have 7', function() {
      var word = 'eat';
      var definition = 'To take into the body by the mouth for digestion or absorption.';
      ctrl.checkLetters = ['i', 'o', 'r', 't'];
      ctrl.isAWord(word, definition);
      expect(ctrl.player1Letters.length).toEqual(7);
    });

    it('after an incorrect word, player keeps the same letters', function() {
      ctrl.notAWord('pti');
      expect(_.pluck(ctrl.player1Letters, 'value')).toEqual([ 'p', 'u', 't', 'i', 'o', 'r', 't' ]);
    });

  });

});
