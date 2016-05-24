module.exports = {
    search: function (searchTerms, callback) {
        if (searchTerms === null && typeof searchTerms !== 'object') {
            callback(new Error('Invalid search terms.'), null);
        } else if (searchTerms.searchKey == null || searchTerms.searchKey == "") {
            callback(new Error('Search key is null!'), null);
        } else if (searchTerms.searchKey.length < 3) {
            callback(new Error('Search key must be greater than 3 characters!'), null);
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
                        else return;
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
                    result.title = $('h1[itemprop="name"]').text().replace(/\(\d+\)/g, '').trim();
                    result.year = $('#titleYear > a').text().trim();
                    result.ratingValue = $('span[itemprop="ratingValue"]').text().trim();
                    result.contentRating = $('meta[itemprop="contentRating"]').attr('content');
                    result.duration = $('#titleDetails time[itemprop="duration"]').text().trim();
                    result.genre = [];
                    $('div.see-more[itemprop="genre"] a').each(function (i, el) {
                        result.genre.push($(this).text());
                    });
                    result.poster = $('#title-overview-widget > div.vital > div.slate_wrapper > div.poster > a > img').attr('src');

                    result.directors = [];
                    $('div.plot_summary span[itemprop="director"]').find(' span[itemprop="name"]').each(function(){
                        result.directors.push($(this).text().trim());
                    });

                    result.writers = [];
                    $('div.plot_summary span[itemprop="creator"]').find(' span[itemprop="name"]').each(function(){
                        result.writers.push($(this).text().trim());
                    });
                    result.summaryText = $('div.summary_text[itemprop="description"]').text().trim();
                    result.storyLine = $('#titleStoryLine > div[itemprop="description"]').text().trim();
                    result.budget = $('#titleDetails > div:nth-child(11)').text().trim().split(':')[1].replace(/ +(?= )/g, '').trim();

                    result.actors = [];
                    $('#titleCast > table.cast_list').find('tr.odd, tr.even').each(function () {
                        var actor = $(this).text().replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g, '').trim().split(' ... ');
                        result.actors.push({
                            realName: actor[0],
                            roleName: actor[1]
                        });
                    });

                    var requestResult = {
                        result: result
                    };

                    module.exports.getRecommendationsByImdbId(imdbId, function(err, data){
                        result.recomendations = data;
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
                    $('#tn15content tr[bgcolor="#ffffff"]').each(function(){
                        var movie = {};
                        $(this).find("td[valign='middle']").each(function(i){
                            i==0?movie.imdbId = $(this).html().split('<a href="/title/')[1].split('/')[0]:'N/A';
                            i==0?movie.name=$(this).text().replace(/\(\d+\)/g, '').trim():'N/A';
                            i==0?movie.year=$(this).text().match(/(\d{4})/)[0]:'N/A';
                            i==3?movie.ratingValue=$(this).text():'N/A';
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