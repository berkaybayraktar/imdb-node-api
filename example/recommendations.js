var imdb = require('../index');

imdb.getRecommendationsByImdbId('tt0106519', function (err, data) {
    if (err) throw (err);
    console.log(data);
});