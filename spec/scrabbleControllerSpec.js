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

});
