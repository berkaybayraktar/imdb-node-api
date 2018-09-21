var utility = require('./utility.lib');

module.exports = {
    searchMovies: searchMovies,
    getMovie: getMovie
};

function searchMovies(keyword, successCallback, errorCallback) {
    var requestUrl = 'http://www.imdb.com/find?q=' + keyword + '&s=tt&ttype=ft&ref_=fn_ft';

    utility.request(requestUrl, function ($) {
        var movies = [];

        $('div.findSection > table.findList tr').each(function () {
            var innerText = $(this).text().trim()
                , id = $(this).html().match(/(tt[\d]+)/)[0] || null
                , year = innerText.match(/(\d{4})/g);

            if (id !== null && year !== null) { // exclude movies that are being developed
                movies.push({
                    id: id,
                    title: innerText.replace(/\(\d+\)/g, '').trim() || null,
                    year: year[0] || null,
                    primaryPhoto: $(this).find('img').attr('src') || null
                });
            }
        });

        return movies;
    }, successCallback, errorCallback)
}

function getMovie(id, successCallback, errorCallback) {
    var requestUrl = 'http://www.imdb.com/title/' + id + '/';

    utility.request(requestUrl, function ($) {

        var el = $('meta[property="og:url"]');
        if (el == null || el.attr('content') !== requestUrl) {
            return utility.errorHandler(errorCallback, new Error('Movie failed to fetch: IMDB Failed to respond, or responded with error code.'));
        }

        return {
            title: $('.title_wrapper > h1').text().replace(/\(\d+\)/g, '').trim() || null,
            year: $('#titleYear').find('a').text().trim() || null,
            ratingValue: $('span[itemprop="ratingValue"]').text().trim() || null,
            contentRating: $('div.title_wrapper > div.subtext').text().split('|')[0].trim() || null,
            duration: $('#titleDetails time[datetime]').text().trim() || null,
            genres: $('#titleStoryLine > div:contains("Genres:")').text().replace('Genres:', '').split('|').map(function (o) {
                return o.trim()
            }) || [],
            poster: $('#title-overview-widget').find('div.poster img').attr('src') || null,
            director: $('div.plot_summary > div:contains("Director:")').text().replace('Director:', '').trim() || null,
            writers: $('div.plot_summary > div:contains("Writers:")').text().replace('Writers:', '').split(',').map(function (o) {
                return o.trim()
            }) || [],
            summaryText: $('div.summary_text').text().trim() || null,
            storyLine: $('#titleStoryLine > div:first-of-type').text().trim() || null
        };

    }, successCallback, errorCallback)
}