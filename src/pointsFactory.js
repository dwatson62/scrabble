app.factory('pointsFactory', [function($) {

  var Points = function() {};

  Points.prototype.getPoints = function(word) {
    return _.reduce(word.split(''), function(sum, value) {
      return sum + letterValues[value].points;
    }, 0);
  };

  return Points;

}]);
