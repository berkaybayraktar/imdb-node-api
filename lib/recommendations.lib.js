var request = require('request');
var cheerio = require('cheerio');
var utility = require('./utility.lib');

module.exports = function (imdbId, callback) {
    utility.validateImdbId(imdbId, function (imdbIdIsValid, imdbIdError) {
        if (imdbIdError == false) {
            callback(imdbIdIsValid, null);
        } else {
            request('http://www.imdb.com/title/' + imdbId + '/recommendations', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    body = body.replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g, '');
                    $ = cheerio.load(body);

                    var result = [];
                    $('#tn15content').find('tr[bgcolor="#ffffff"]').each(function () {
                        var movie = {};
                        $(this).find("td[valign='middle']").each(function (i) {
                            if (i == 0) {
                                movie.imdbId = $(this).html().split('<a href="/title/')[1].split('/')[0] || 'N/A';
                                movie.name = $(this).text().replace(/\(\d+\)/g, '').trim() || 'N/A';
                                movie.year = $(this).text().match(/(\d{4})/)[0] || 'N/A';
                            } else if (i == 3) {
                                movie.ratingValue = $(this).text() || 'N/A';
                            }
                        });
                        result.push(movie);
                    });

                    callback(null, result);

                } else {
                    callback(new Error('Recommendations failed to fetch: IMDB Failed to respond, or responded with error code'), null);
                }
            });
        }

    });
};