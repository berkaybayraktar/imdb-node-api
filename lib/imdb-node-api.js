var search = require('./search.lib')
    , getByImdbId = require('./movie.lib.js')
    , getRecommendationsByImdbId = require('./recommendations.lib.js');

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