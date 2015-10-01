app.controller('PlayerTilesController', ['player', function(player) {

  var self = this;

  self.player1Letters = player.currentLetters();

  self.addSelectedClass = function(index) {
    self.player1Letters = wordService.addSelectedClass(self.player1Letters, index);
  };

}]);
