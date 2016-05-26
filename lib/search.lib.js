var request = require('request');
var cheerio = require('cheerio');
var utility = require('./utility.lib');

module.exports = function (query, callback) { // only movies for now
    utility.validateQuery(query, function (queryIsValid, queryError) {
        if (queryIsValid == false) {
            callback(queryError, null);
        } else {
            request('http://www.imdb.com/find?q=' + query.keyword + '&s=tt&ttype=ft&ref_=fn_ft', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    body = body.replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g, '');
                    $ = cheerio.load(body);

                    var movies = [];
                    $('div.findSection > table.findList tr').each(function () {
                        var movie = {};
                        var innerText = $(this).text().trim();
                        var year = innerText.match(/(\d{4})/);
                        if (year !== null) { // exclude movies that are being developed
                            movie.imdbId = $(this).html().trim().match(/(tt[\d]+)/)[0];
                            movie.name = innerText.replace(/\(\d+\)/g, '').trim();
                            movie.year = year[0];
                            movie.primaryPhoto = $(this).html().split('<img src="')[1].split('"></a>')[0];
                            movies.push(movie);
                        }
                        else return false;
                    });
                    var response = {
                        query: query,
                        movies: movies
                    };
                    callback(null, JSON.stringify(response));
                } else {
                    callback(new Error('Search failed to fetch: IMDB Failed to respond, or responded with error code'), null);
                }
            });

        }
    });
};