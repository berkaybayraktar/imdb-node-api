module.exports = {
    search: function (searchTerms, callback) {
        console.log('Loading search results...');
        if (searchTerms === null && typeof searchTerms !== 'object') {
            callback(new Error('Invalid search terms.'), null);
        } else if (searchTerms.searchKey == null || searchTerms.searchKey == "") {
            callback(new Error('Search key is null!'), null);
        } else if (searchTerms.searchKey.length < 2) {
            callback(new Error('Search key must be greater than 2 characters!'), null);
        } else {
            var request = require('request');
            var cheerio = require('cheerio');

            request('http://www.imdb.com/find?q=' + searchTerms.searchKey + '&s=tt&ttype=ft&ref_=fn_ft', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    body = body.replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g, '');
                    $ = cheerio.load(body);

                    var moviesList = [];
                    var findMax = searchTerms.maxResult;
                    $('div.findSection > table.findList tr').each(function (i) {
                        if (i < findMax) {
                            var movie = {};
                            var innerText = $(this).text().trim();
                            var year = innerText.match(/(\d{4})/);
                            if (year === null) {
                                findMax++;
                            } else {
                                movie.imdbId = $(this).html().split('<a href="/title/')[1].split('/?ref_')[0];
                                movie.name = innerText.replace(/\(\d+\)/g, '').trim();
                                movie.year = year[0];
                                movie.primaryPhoto = $(this).html().split('<img src="')[1].split('"></a>')[0];
                                moviesList.push(movie);
                            }
                        }
                        else return false;
                    });
                    var requestResult = {
                        searchTerms: searchTerms,
                        result: moviesList
                    };
                    callback(null, JSON.stringify(requestResult));
                } else {
                    callback(new Error('IMDB Failed to respond, or responded with error code'), null);
                }
            });
        }
    },
    getByImdbId: function (imdbId, callback) {
        console.log('Loading movie data...');
        if (imdbId == null || imdbId == "") {
            callback(new Error('IMDB id is null!'), null);
        } else {
            var request = require('request');
            var cheerio = require('cheerio');

            request('http://www.imdb.com/title/' + imdbId + '/', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    body = body.replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g, '');
                    $ = cheerio.load(body);

                    var result = {};
                    result.imdbId = imdbId;
                    result.title = $('h1[itemprop="name"]').text().replace(/\(\d+\)/g, '').trim() || "N/A";
                    result.year = $('#titleYear').find('a').text().trim() || "N/A";
                    result.ratingValue = $('span[itemprop="ratingValue"]').text().trim() || "N/A";
                    result.contentRating = $('meta[itemprop="contentRating"]').attr('content') || "N/A";
                    var titleDetails = $('#titleDetails');
                    result.duration = titleDetails.find('time[itemprop="duration"]').text().trim() || "N/A";
                    result.genre = [];
                    $('div.see-more[itemprop="genre"] a').each(function () {
                        result.genre.push($(this).text().trim());
                    });
                    result.poster = $('#title-overview-widget').find('div.poster img').attr('src');

                    result.directors = [];
                    $('div.plot_summary span[itemprop="director"]').find(' span[itemprop="name"]').each(function () {
                        result.directors.push($(this).text().trim());
                    });

                    result.writers = [];
                    $('div.plot_summary span[itemprop="creator"]').find(' span[itemprop="name"]').each(function () {
                        result.writers.push($(this).text().trim());
                    });
                    result.summaryText = $('div.summary_text[itemprop="description"]').text().trim() || "N/A";
                    result.storyLine = $('#titleStoryLine').find('div[itemprop="description"]').text().trim() || "N/A";
                    var budget = titleDetails.find('div:contains("Budget:")');
                    result.budget = budget.length > 0 ? budget.text().trim().split(':')[1].replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g, '').trim() : "N/A";

                    result.actors = [];
                    $('table.cast_list').find('tr.odd, tr.even').each(function () {
                        var actor = $(this).text().replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g, '').trim().split(' ... ');
                        result.actors.push({
                            name: actor[0],
                            roleName: actor[1]
                        });
                    });

                    result.peopleWhoLikedThisAlsoLiked = [];
                    $('#title_recs').find('div.rec_overview').each(function () {
                        var movie = {};
                        movie.imdbId = $(this).find('div.rec-title').html().trim().match(/(tt[\d]+)/)[0];
                        movie.name = $(this).find('div.rec-title').text().replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g, '').replace(/\(\d+\)/g, '').trim();
                        movie.year = $(this).find('div.rec-title span').text().replace(/(\D+)/g, '').trim();
                        movie.ratingValue = $(this).find('span.value').text().trim();
                        result.peopleWhoLikedThisAlsoLiked.push(movie);
                    });

                    var requestResult = {
                        result: result
                    };

                    module.exports.getRecommendationsByImdbId(imdbId, function (err, data) {
                        if (err) throw (err);
                        result.recommendations = data;


                        callback(null, JSON.stringify(requestResult));
                    });

                } else {
                    callback(new Error('IMDB Failed to respond, or responded with error code'), null);
                }
            });
        }
    },
    getRecommendationsByImdbId: function (imdbId, callback) {
        console.log('Loading recommendations...');
        if (imdbId == null || imdbId == "") {
            callback(new Error('IMDB id is null!'), null);
        } else {
            var request = require('request');
            var cheerio = require('cheerio');
            request('http://www.imdb.com/title/' + imdbId + '/recommendations', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    body = body.replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g, '');
                    $ = cheerio.load(body);

                    var result = [];
                    $('#tn15content').find('tr[bgcolor="#ffffff"]').each(function () {
                        var movie = {};
                        $(this).find("td[valign='middle']").each(function (i) {
                            if(i==0){
                                movie.imdbId = $(this).html().split('<a href="/title/')[1].split('/')[0] || 'N/A';
                                movie.name = $(this).text().replace(/\(\d+\)/g, '').trim() || 'N/A';
                                movie.year = $(this).text().match(/(\d{4})/)[0] || 'N/A';
                            }else if(i==3){
                                movie.ratingValue = $(this).text() || 'N/A';
                            }
                        });
                        result.push(movie);
                    });

                    callback(null, result);

                } else {
                    callback(new Error('IMDB Failed to respond, or responded with error code'), null);
                }
            });
        }
    }
};