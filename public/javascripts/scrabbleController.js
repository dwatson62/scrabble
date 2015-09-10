app.controller('ScrabbleController', ['$http', function($http) {

  var self = this;

  self.giveWord = function() {
    var url = 'http://api.wordnik.com:80/v4/word.json/';
    var word = self.input + '/definitions?';
    var stuff = 'limit=1&includeRelated=true&useCanonical=false&includeTags=false';
    var request = url + word + stuff + '&api_key=' + api_key;
    $http.get(request).
      then(function(response) {
        if (response.data.length == 0) {
          console.log('Not a word!')
        } else {
          console.log(response.data[0].text)
        }
      });
  };

}]);