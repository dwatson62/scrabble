describe('Scrabble', function() {

  beforeEach(function() {
    browser.get('http://localhost:3000');
  });

  var playButton = element(by.id('play-word'));
  var clearButton = element(by.id('clear-word'));
  var letterTile = element(by.className('ready'));

  it('Has a title', function() {
    expect(browser.getTitle()).toEqual('Scrabble');
  });

  it('Play word button is disabled when game first opens', function() {
    expect(playButton.isEnabled()).toBe(false);
  });

  it('Clear button is disabled when game first opens', function() {
    expect(clearButton.isEnabled()).toBe(false);
  });

  xit('Letters have a class of ready by default', function() {
    // silly test
    expect(element(by.className('ready')).getAttribute('class')).toMatch('ready');
  });

});