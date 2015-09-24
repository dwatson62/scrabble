describe('Words Factory', function() {

  beforeEach(module('ScrabbleApp'));

  var wordService;

  beforeEach(inject(function(wordsFactory) {
    wordService = new wordsFactory();
  }));

  describe('Submitted words', function() {

    var playerLetters = [{ 'value': 'p', 'status': 'ready' }, { 'value': 'k', 'status': 'ready' }, { 'value': 't', 'status': 'ready' }, { 'value': 'i', 'status': 'ready' }, { 'value': 'e', 'status': 'ready' }, { 'value': 'r', 'status': 'ready' }, { 'value': 't', 'status': 'ready' }];

    it('Knows when given invalid letters', function() {
      var verdict = wordService.checkValidLetters('skit', playerLetters);
      expect(verdict).toEqual(false);
    });

    it('Knows when given valid letters', function() {
      var verdict = wordService.checkValidLetters('kit', playerLetters);
      expect(verdict).toEqual([ 'p', 'e', 'r', 't' ]);
    });

    it('Correctly deletes selected letters', function() {
      wordService.checkValidLetters('kite', playerLetters);
      expect(wordService.checkLetters).toEqual([ 'p', 'r', 't' ]);
    });

    it('Correctly deletes selected letters when more than one', function() {
      wordService.checkValidLetters('keo', playerLetters);
      expect(wordService.checkLetters).toEqual([ 'p', 't', 'i', 'r', 't' ]);
    });

    it('Correctly handles blank letters', function() {
      wordService.checkValidLetters('kite', playerLetters);
      expect(wordService.checkLetters).toEqual([ 'p', 'r', 't' ]);
    });

    it('Correctly handles two blank letters', function() {
      wordService.checkValidLetters('kite', playerLetters);
      expect(wordService.checkLetters).toEqual([ 'p', 'r', 't' ]);
    });

  });

});
