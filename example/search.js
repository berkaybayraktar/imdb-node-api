var imdb = require('../index');

imdb.search({keyword: 'xmen'}, function (err, data) {
    console.error("error: " + err);
    console.log("data: " + data);
});