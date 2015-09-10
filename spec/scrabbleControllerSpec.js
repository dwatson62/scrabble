describe('Scrabble Controller', function() {

  beforeEach(module('ScrabbleApp'));

  var ctrl;

  beforeEach(inject(function($controller) {
    ctrl = $controller('ScrabbleController');
  }));

  it('is defined', function() {
    expect(ctrl).toBeDefined();
  });

});
