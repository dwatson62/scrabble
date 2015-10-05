app.factory('gameFactory', function() {

  var Game = function() {
    this.bonuses = this.createBoard();
  };

  Game.prototype.createBoard = function() {
    return {
        'A1': 'tripleword', 'A4': 'doubleletter', 'A8': 'tripleword', 'A12': 'doubleletter', 'A15': 'tripleword',
        'B2': 'doubleword', 'B6': 'tripleletter', 'B10': 'tripleletter', 'B14': 'doubleword',
        'C3': 'doubleword', 'C7': 'doubleletter', 'C9': 'doubleletter', 'C13': 'doubleword',
        'D1': 'doubleletter', 'D4': 'doubleword', 'D8': 'doubleletter', 'D12': 'doubleword', 'D15': 'doubleletter',
        'E5': 'doubleword', 'E11': 'doubleword',
        'F2': 'tripleletter', 'F6': 'tripleletter', 'F10': 'tripleletter', 'F14': 'tripleletter',
        'G3': 'doubleletter', 'G7': 'doubleletter', 'G9': 'doubleletter', 'G13': 'doubleletter',
        'H1': 'tripleword', 'H4': 'doubleletter', 'H8': 'star', 'H12': 'doubleletter', 'H15': 'tripleword',
        'I3': 'doubleletter', 'I7': 'doubleletter', 'I9': 'doubleletter', 'I13': 'doubleletter',
        'J2': 'tripleletter', 'J6': 'tripleletter', 'J10': 'tripleletter', 'J14': 'tripleletter',
        'K5': 'doubleword', 'K11': 'doubleword',
        'L1': 'doubleletter', 'L4': 'doubleword', 'L8': 'doubleletter', 'L12': 'doubleword', 'L15': 'doubleletter',
        'M3': 'doubleword', 'M7': 'doubleletter', 'M9': 'doubleletter', 'M13': 'doubleword',
        'N2': 'doubleword', 'N6': 'tripleletter', 'N10': 'tripleletter', 'N14': 'doubleword',
        'O1': 'tripleword', 'O4': 'doubleletter', 'O8': 'tripleword', 'O12': 'doubleletter', 'O15': 'tripleword'
      };
  };

  Game.prototype.createBag = function() {
    var letters = _.keys(letterValues);
    var bag = [];
    for (var letter in letters) {
      for (i = 0; i < letterValues[letters[letter]].tiles; i ++) {
        bag.push(letters[letter]);
      }
    }
    return _.shuffle(bag);
  };

  Game.prototype.distributeLetters = function(currentLetters, bag) {
    var number = 7 - currentLetters.length;
    for (i = 0; i < number; i ++) {
      var x = Math.floor((Math.random() * bag.length));
      var letter = bag.splice(x, 1).join();
      currentLetters.push({ 'value': letter, 'status': 'ready' });
    }
    return currentLetters;
  };

  Game.prototype.swapLetter = function(currentLetters, bag, index) {
    currentLetters.splice(index, 1);
    currentLetters = this.distributeLetters(currentLetters, bag);
    return currentLetters;
  };

  Game.prototype.getPoints = function(input) {
    var currentBonuses = [/* word bonus */ 1, /* letter bonus */ 1];
    var total = 0;
    for (var i in input) {
      currentBonuses[1] = 1;
      var position = input[i].position;
      currentBonuses = this.getBonuses(position, currentBonuses);
      var letter = this.checkForBlankOrLetter(input[i]);
      total += (letterValues[letter].points * currentBonuses[1]);
      this.removeBonusTile(position);
    }
    total *= currentBonuses[0];
    total = this.bingoBonus(input, total);
    return total;
  };

  Game.prototype.getBonuses = function(position, currentBonuses) {
    if (_.has(this.bonuses, position) === true) {
      position = this.bonuses[position];
      if (position === 'doubleword') { currentBonuses[0] *= 2; }
      if (position === 'tripleword') { currentBonuses[0] *= 3; }
      if (position === 'doubleletter') { currentBonuses[1] = 2; }
      if (position === 'tripleletter') { currentBonuses[1] = 3; }
    }
    return currentBonuses;
  };

  Game.prototype.checkForBlankOrLetter = function(tile) {
    if (tile.blank === true) { return 'blank'; }
    return tile.letter;
  };

  Game.prototype.bingoBonus = function(input, total) {
    if (input.length === 7) { total += 50; }
    return total;
  };

  Game.prototype.removeBonusTile = function(position) {
    delete this.bonuses[position];
  };

  return Game;

});
