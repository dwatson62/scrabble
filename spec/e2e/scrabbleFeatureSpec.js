describe('Scrabble', function() {

  beforeEach(function() {
    browser.get('http://localhost:3000')
  });

  it('Has a title', function() {
    expect(browser.getTitle()).toEqual('Scrabble');
  });

});