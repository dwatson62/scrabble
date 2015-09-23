describe('Words Factory', function() {

  beforeEach(module('ScrabbleApp'));

  var wordService;

  beforeEach(inject(function(wordsFactory) {
    wordService = new wordsFactory();
  }));

  describe('Submitted words', function() {

    var playerLetters = ['k', 'e', 'o', 'i', 'o', 'r', 't'];

    it('Knows when given invalid letters', function() {
      var verdict = wordService.checkValidLetters('skit', playerLetters);
      expect(verdict).toEqual(false);
    });

    it('Knows when given valid letters', function() {
      var verdict = wordService.checkValidLetters('kit', playerLetters);
      expect(verdict).toEqual(['e', 'o', 'o', 'r']);
    });

    it('Correctly deletes selected letters', function() {
      wordService.checkValidLetters('kite', playerLetters);
      expect(wordService.checkLetters).toEqual(['o', 'o', 'r']);
    });

    it('Correctly deletes selected letters when more than one', function() {
      wordService.checkValidLetters('keo', playerLetters);
      expect(wordService.checkLetters).toEqual(['i', 'o', 'r', 't']);
    });

    it('Correctly handles blank letters', function() {
      wordService.checkValidLetters('kite', playerLetters);
      expect(wordService.checkLetters).toEqual(['o', 'o', 'r']);
    });

    it('Correctly handles two blank letters', function() {
      wordService.checkValidLetters('kite', playerLetters);
      expect(wordService.checkLetters).toEqual(['o', 'o', 'r']);
    });

  });

});
