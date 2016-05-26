var search = require('./search.lib');
var getByImdbId = require('./movie.lib.js');
var getRecommendationsByImdbId = require('./recommendations.lib.js');

module.exports = {
    search: function (query, callback) { // only movies for now
        search(query, callback);
    },
    getByImdbId: function (imdbId, callback) {
        getByImdbId(imdbId, callback);
    },
    getRecommendationsByImdbId: function (imdbId, callback) {
        getRecommendationsByImdbId(imdbId, callback);
    }
};