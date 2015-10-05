describe('Scrabble', function() {

  beforeEach(function() {
    browser.get('http://localhost:3000');
  });

  var playButton = element(by.id('play-word'));
  var clearButton = element(by.id('clear-word'));
  var rulesButton = element(by.id('rules-btn'));

  it('Has a title', function() {
    expect(browser.getTitle()).toEqual('Scrabble');
  });

  describe('At start of the game', function() {

    it('Play word button is disabled when game first opens', function() {
      expect(playButton.isEnabled()).toBe(false);
    });

    it('Clear button is disabled when game first opens', function() {
      expect(clearButton.isEnabled()).toBe(false);
    });

    it('Player gets seven letters at start of game', function() {
      expect(element.all(by.className('ready')).count()).toEqual(7);
    });

    it('Can toggle game rules on or off', function() {
      expect(rulesButton.isEnabled()).toBe(true);
    });
  });

});