var request = require('request')
    , cheerio = require('cheerio')
    , utility = require('./utility.lib')
    , getRecommendationsByImdbId = require('./recommendations.lib.js');

module.exports = function (imdbId, callback) {
    utility.validateImdbId(imdbId, function (imdbIdIsValid, imdbIdError) {
        if (imdbIdIsValid == false) {
            return callback(imdbIdError, null);
        }
        request('http://www.imdb.com/title/' + imdbId + '/', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                body = body.replace(/(\r\n|\n|\r)/gm, '').replace(/ +(?= )/g, '');
                $ = cheerio.load(body);

                var result = {}
                    , titleDetails = $('#titleDetails')
                    , budget = titleDetails.find('div:contains("Budget:")');

                result.imdbId = imdbId;
                result.title = $('h1[itemprop="name"]').text().replace(/\(\d+\)/g, '').trim() || 'N/A';
                result.year = $('#titleYear').find('a').text().trim() || 'N/A';
                result.ratingValue = $('span[itemprop="ratingValue"]').text().trim() || 'N/A';
                result.contentRating = $('meta[itemprop="contentRating"]').attr('content') || 'N/A';
                result.duration = $('div.subtext').find('time[itemprop="duration"]').attr('datetime').match(/(\d+)/g) + " min" || 'N/A';

                result.genre = [];
                $('div.see-more[itemprop="genre"] a').each(function () {
                    result.genre.push($(this).text().trim());
                });
                result.poster = $('#title-overview-widget').find('div.poster img').attr('src');

                result.directors = [];
                $('div.plot_summary span[itemprop="director"]').find('span[itemprop="name"]').each(function () {
                    result.directors.push($(this).text().trim());
                });

                result.writers = [];
                $('div.plot_summary span[itemprop="creator"]').find('span[itemprop="name"]').each(function () {
                    result.writers.push($(this).text().trim());
                });
                result.summaryText = $('div.summary_text[itemprop="description"]').text().trim() || 'N/A';

                result.storyLine = $('#titleStoryLine').find('div[itemprop="description"] > p').html().replace(/<em class="nobr">([\S\r\n ]+)<\/em>/g, '').trim() || 'N/A';

                result.budget = budget.length > 0 ? budget.text().trim().split(':')[1].replace(/(\r\n|\n|\r)/gm, '').replace(/ +(?= )/g, '').trim() : 'N/A';

                result.actors = [];
                $('table.cast_list').find('tr.odd, tr.even').each(function () {
                    var actor = $(this).text().replace(/(\r\n|\n|\r)/gm, '').replace(/ +(?= )/g, '').trim().split(' ... ');
                    result.actors.push({
                        name: actor[0]
                        , roleName: actor[1]
                    });
                });

                result.peopleWhoLikedThisAlsoLiked = [];
                $('#title_recs').find('div.rec_overview').each(function () {
                    var movie = {};
                    movie.imdbId = $(this).find('div.rec-title').html().trim().match(/(tt[\d]+)/)[0];
                    movie.name = $(this).find('div.rec-title').text().replace(/(\r\n|\n|\r)/gm, '').replace(/ +(?= )/g, '').replace(/\(\d+\)/g, '').trim();
                    movie.year = $(this).find('div.rec-title span').text().replace(/(\D+)/g, '').trim();
                    movie.ratingValue = $(this).find('span.value').text().trim();
                    result.peopleWhoLikedThisAlsoLiked.push(movie);
                });

                var requestResult = {
                    movie: result
                };

                getRecommendationsByImdbId(imdbId, function (err, data) {
                    if (err) {
                        console.log(err.message);
                        return callback(null, JSON.stringify(requestResult));
                    }
                    result.recommendations = data;
                    return callback(null, JSON.stringify(requestResult));

                });

            } else {
                return callback(new Error('Movie failed to fetch: IMDB Failed to respond, or responded with error code'), null);
            }

        });
    });
};