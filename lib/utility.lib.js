module.exports = {
    validateQuery: function (query, callback) { // callback(queryIsValid, queryError);
        if (query === null && typeof query !== 'object') {
            return callback(false, new Error('Invalid search terms.'));
        } else if (query.keyword == null || query.keyword == "") {
            return callback(false, new Error('Search key is null!'));
        } else if (query.keyword.length < 2) {
            return callback(false, new Error('Search key must be greater than 2 characters!'));
        } else {
            return callback(true, null);
        }
    },
    validateImdbId: function (imdbId, callback) { // callback(imdbIdIsValid, imdbIdError);
        if (imdbId == null || imdbId == "") {
            callback(false, new Error('IMDB ID is null!'));
        } else {
            callback(true, null);
        }
    }
};