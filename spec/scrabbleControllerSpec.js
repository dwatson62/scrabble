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

  placeHorizontally = function(word, y) {
    if (y === undefined) { y = 0; }
    word = word.split('');
    for (i = 0; i < word.length; i ++) {
      placeLetter(word[i], 4, y + i);
    }
  };

  placeVertically = function(word, x) {
    if (x === undefined) { x = 0; }
    word = word.split('');
    for (i = 0; i < word.length; i ++) {
      placeLetter(word[i], x + i, 4);
    }
  };

  placeLetter = function(letter, x, y) {
    var index = _.indexOf(_.pluck(ctrl.player1Letters, 'value'), letter);
    ctrl.selectLetter(index);
    ctrl.selectTile(x, y);
  };

  it('is defined', function() {
    expect(ctrl).toBeDefined();
  });

  describe('Points', function() {

    it('Scores correct points for a word', function() {
      placeHorizontally('trip');
      ctrl.getPoints('trip', 'definition');
      expect(ctrl.totalScore).toEqual(6);
    });

  });

  describe('History', function() {

    it('Keeps a history of played words', function() {
      placeHorizontally('trip');
      ctrl.getPoints('trip', 'definition');
      expect(ctrl.history[0]).toEqual({ 'word': 'trip', 'points': 6, 'definition': 'definition' });
    });

  });

  describe('Placing letters', function() {

    it('Can placeHorizontally a single letter on board', function() {
      placeLetter('i', 1, 0);
      expect(ctrl.input).toEqual([{ letter: 'i', position: 'B1', 'blank': false }]);
    });

    it('Can placeHorizontally many letters on the board', function() {
      placeHorizontally('put');
      expect(ctrl.input).toEqual([{ letter: 'p', position: 'E1', 'blank': false },
                                  { letter: 'u', position: 'E2', 'blank': false },
                                  { letter: 't', position: 'E3', 'blank': false }
                                  ]);
    });

    it('When placed out of order, it can sort them correctly', function() {
      placeLetter('u', 1, 1);
      placeLetter('p', 1, 0);
      placeLetter('t', 1, 2);
      expect(ctrl.submitted).toEqual([{ letter: 'p', position: 'B1', 'blank': false },
                                  { letter: 'u', position: 'B2', 'blank': false },
                                  { letter: 't', position: 'B3', 'blank': false }
                                  ]);
    });

    it('When placed out of order, near edge of board it can sort them correctly', function() {
      placeLetter('u', 1, 9);
      placeLetter('p', 1, 8);
      placeLetter('t', 1, 10);
      expect(ctrl.submitted).toEqual([{ letter: 'p', position: 'B9', 'blank': false },
                                  { letter: 'u', position: 'B10', 'blank': false },
                                  { letter: 't', position: 'B11', 'blank': false }
                                  ]);
    });

    it('When placed all over the placeHorizontally it can sort them correctly', function() {
      placeLetter('u', 10, 8);
      placeLetter('p', 9, 8);
      placeLetter('t', 11, 8);
      expect(ctrl.submitted).toEqual([{ letter: 'p', position: 'J9', 'blank': false },
                                  { letter: 'u', position: 'K9', 'blank': false },
                                  { letter: 't', position: 'M9', 'blank': false }
                                  ]);
    });

  });

  describe('Intersecting words', function() {

    beforeEach(function() {
      ctrl.player1Letters = [{ 'value': 'p', 'status': 'ready' },
                          { 'value': 's', 'status': 'ready' },
                          { 'value': 't', 'status': 'ready' },
                          { 'value': 'i', 'status': 'ready' },
                          { 'value': 'e', 'status': 'ready' },
                          { 'value': 'r', 'status': 'ready' },
                          { 'value': 't', 'status': 'ready' }];
    });

    it('with letters to the left', function() {
      placeHorizontally('trip');
      ctrl.isAWord('trip', 'definition');
      placeLetter('s', 4, 4);
      var word = _.pluck(ctrl.submitted, 'letter').join('');
      expect(word).toEqual('trips');
    });

    it('with letters to the right', function() {
      placeHorizontally('trip', 1);
      ctrl.isAWord('trip', 'definition');
      placeLetter('s', 4, 0);
      var word = _.pluck(ctrl.submitted, 'letter').join('');
      expect(word).toEqual('strip');
    });

    it('with letters above', function() {
      placeVertically('trip', 2);
      ctrl.isAWord('trip', 'definition');
      placeLetter('s', 1, 4);
      var word = _.pluck(ctrl.submitted, 'letter').join('');
      expect(word).toEqual('strip');
    });

    it('with letters below', function() {
      placeVertically('trip', 2);
      ctrl.isAWord('trip', 'definition');
      placeLetter('e', 6, 4);
      var word = _.pluck(ctrl.submitted, 'letter').join('');
      expect(word).toEqual('tripe');
    });

    it('vertically with a horizontal word', function() {
      placeHorizontally('trip');
      ctrl.isAWord('trip', 'definition');
      placeLetter('s', 2, 0);
      placeLetter('e', 3, 0);
      var word = _.pluck(ctrl.submitted, 'letter').join('');
      expect(word).toEqual('set');
    });

    it('horizontally with a vertical word', function() {
      placeVertically('trip');
      ctrl.isAWord('trip', 'definition');
      placeLetter('e', 3, 5);
      placeLetter('t', 3, 6);
      var word = _.pluck(ctrl.submitted, 'letter').join('');
      expect(word).toEqual('pet');
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
      // Letter p gets deleted, and other letters shift one placeHorizontally to left
      expect(ctrl.player1Letters[0].value).toEqual('u');
      expect(ctrl.player1Letters.length).toEqual(7);
    });

    it('stores history of where letters are placed', function() {
      placeHorizontally('put');
      ctrl.isAWord('put', 'definition');
      expect(ctrl.letterHistory).toEqual([
        { letter: 'p', position: 'E1', 'blank': false },
        { letter: 'u', position: 'E2', 'blank': false },
        { letter: 't', position: 'E3', 'blank': false }
        ]);
    });

  });

});
