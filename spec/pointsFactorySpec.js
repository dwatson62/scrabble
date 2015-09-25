describe('Points Factory', function() {

  beforeEach(module('ScrabbleApp'));

  var pointsService;

  beforeEach(inject(function(pointsFactory) {
    pointsService = new pointsFactory();
  }));

  it('can calculate total points for a word', function() {
    var word = 'beer';
    expect(pointsService.getPoints(word)).toEqual(6);
  });

});
