var timer = false;
module.exports = {
    validateQuery: function (query, callback) { // callback(queryIsValid, queryError);
        var searchCategories = ['All', 'Name', 'Title', 'Movie', 'TV', 'TVEpisode', 'VideoGame', 'Character', 'Company'];
        if (query === null && typeof query !== 'object') {
            return callback(false, new Error('Invalid search terms.'));
        } else if (query.keyword == null || query.keyword == '') {
            return callback(false, new Error('Search key is null!'));
        } else if (query.keyword.length < 2) {
            return callback(false, new Error('Search key must be greater than 2 characters!'));
        } else {
            return callback(true, null);
        }
    },
    validateImdbId: function (imdbId, callback) { // callback(imdbIdIsValid, imdbIdError);
        if (imdbId == null || imdbId == '') {
            return callback(false, new Error('IMDB ID is null!'));
        } else {
            return callback(true, null);
        }
    }
    ,
    generateImdbSearchLink: function (query) { // only movies for now
        if (query.category === undefined || query.category == null || query.category == '') { // default search category
            query.category = 'movie';
        }
        switch (query.category) {
            case 'movie':
                return 'http://www.imdb.com/find?q=' + query.keyword + '&s=tt&ttype=ft&ref_=fn_ft';
                break;
            default:
                '';
                break;
        }

    },
    startTimer : function(){
        var P = ["\\", "|", "/", "-"];
        var x = 0;
        return timer?timer = setInterval(function() {
            process.stdout.write("\rLoading data " + P[x++]);
            x &= 3
        }, 250):timer;
    },
    stopTimer : function(){
        process.stdout.write("\033[2K\r");
        clearInterval(timer);
        timer = false;
    }
}
;