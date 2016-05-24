var imdb = require('../index');


imdb.search({searchKey: "way", maxResult: 5}, function(err, data){
    if(err) throw (err)
    console.log(data);
});