var request = require('request')
    , cheerio = require('cheerio')
    , utility = require('./utility.lib');

module.exports = function (query, callback) {
    utility.validateQuery(query, function (queryIsValid, queryError) {
        if (queryIsValid == false) {
            return callback(queryError, null);
        }
        request(utility.generateImdbSearchLink(query), function (error, response, body) {
            if (!error && response.statusCode == 200) {
                body = body.replace(/(\r\n|\n|\r)/gm, '').replace(/ +(?= )/g, '');
                $ = cheerio.load(body);

                var movies = [];
                $('div.findSection > table.findList tr').each(function () {
                    var movie = {}
                        , innerText = $(this).text().trim()
                        , y = innerText.match(/(\d{4})/g);
                    if (y !== null) { // exclude movies that are being developed
                        movie.imdbId = $(this).html().match(/(tt[\d]+)/)[0];
                        movie.name = innerText.replace(/\(\d+\)/g, '').trim();
                        movie.year = y[0] || 'N/A';
                        movie.primaryPhoto = $(this).find('img').attr('src');
                        movies.push(movie);
                    }
                    else return false;
                });
                var response = {
                    query: query,
                    movies: movies
                };
                return callback(null, JSON.stringify(response));
            } else {
                return callback(new Error('Search failed to fetch: IMDB Failed to respond, or responded with error code'), null);
            }
        });
    });
};