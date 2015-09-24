describe('Words Factory', function() {

  beforeEach(module('ScrabbleApp'));

  var wordService;

  beforeEach(inject(function(wordsFactory) {
    wordService = new wordsFactory();
  }));

  describe('Submitted words', function() {

    var letters;

    beforeEach(function() {
      letters = [{ 'value': 'p', 'status': 'ready' }, { 'value': 'k', 'status': 'ready' }, { 'value': 't', 'status': 'ready' }, { 'value': 'i', 'status': 'ready' }, { 'value': 'e', 'status': 'ready' }, { 'value': 'r', 'status': 'ready' }, { 'value': 't', 'status': 'ready' }];
    });

    placeWord = function(word) {
      word = word.split('');
      _.each(word, function(letter) {
        var index = letters.map(function(e) { return e.value; }).indexOf(letter);
        wordService.addSelectedClass(letters, index);
        wordService.addPlacedClass(letters);
      });
    };

    it('Knows when given valid letters', function() {
      placeWord('kir');
      var verdict = wordService.checkValidLetters('kir', letters);
      expect(_.pluck(verdict, 'value')).toEqual([ 'p', 't', 'e', 't' ]);
    });

    it('Correctly deletes selected letters', function() {
      placeWord('kite');
      var verdict = wordService.checkValidLetters('kite', letters);
      expect(_.pluck(verdict, 'value')).toEqual([ 'p', 'r', 't' ]);
    });

    it('Correctly deletes selected letters when more than one', function() {
      placeWord('kit');
      var verdict = wordService.checkValidLetters('kit', letters);
      expect(_.pluck(verdict, 'value')).toEqual([ 'p', 'e', 'r', 't' ]);
    });

    xit('Correctly handles blank letters', function() {
      placeWord('kite');
      var verdict = wordService.checkValidLetters('kite', letters);
      expect(_.pluck(verdict, 'value')).toEqual([ 'p', 'r', 't' ]);
    });

    xit('Correctly handles two blank letters', function() {
      wordService.checkValidLetters('kite', letters);
      expect(wordService.checkLetters).toEqual([ 'p', 'r', 't' ]);
    });

  });

});
