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

  it('Correctly deletes selected letters', function() {
    ctrl.player1Letters = ['k', 'e', 'o', 'i', 'o', 'r', 't'];
    ctrl.input = 'kite';
    ctrl.checkValidLetters();
    expect(ctrl.testLetters).toEqual(['o', 'o', 'r']);
  });

  it('Correctly deletes selected letters when more than one', function() {
    ctrl.player1Letters = ['k', 'e', 'o', 'i', 'o', 'r', 't'];
    ctrl.input = 'keo';
    ctrl.checkValidLetters();
    expect(ctrl.testLetters).toEqual(['i', 'o', 'r', 't']);
  });

  it('Correctly handles blank letters', function() {
    ctrl.player1Letters = ['blank', 'e', 'o', 'i', 'o', 'r', 't'];
    ctrl.input = 'kite';
    ctrl.checkValidLetters();
    expect(ctrl.testLetters).toEqual(['o', 'o', 'r']);
  });

  it('Correctly handles two blank letters', function() {
    ctrl.player1Letters = ['blank', 'blank', 'o', 'i', 'o', 'r', 't'];
    ctrl.input = 'kite';
    ctrl.checkValidLetters();
    expect(ctrl.testLetters).toEqual(['o', 'o', 'r']);
  });

});
