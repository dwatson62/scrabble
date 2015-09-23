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

  it('player starts with no letters', function() {
    expect(ctrl.player1Letters.length).toEqual(0);
  });

  it('distributes 7 letters when player has none', function() {
    ctrl.distributeLetters();
    expect(ctrl.player1Letters.length).toEqual(7);
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

});
