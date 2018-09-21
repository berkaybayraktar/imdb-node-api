var _request = require('request'),
    _cheerio = require('cheerio'),
    timer = false;

module.exports = {
    request: request,
    errorHandler: errorHandler
};

function startTimer() {
    var P = ["\\", "|", "/", "-"];
    var x = 0;
    return timer ? timer = setInterval(function () {
        process.stdout.write("\rLoading data " + P[x++]);
        x &= 3
    }, 250) : timer;
}

function stopTimer() {
    process.stdout.write("\033[2K\r");
    clearInterval(timer);
    timer = false;
}

function request(requestUrl, mapperFunction, successCallback, errorCallback) {
    startTimer();
    try {
        _request(requestUrl, function (error, response, body) {
            if (error) {
                return errorHandler(errorCallback, new Error(error));
            } else if (response.statusCode !== 200) {
                return errorHandler(errorCallback, new Error('Movie failed to fetch: IMDB Failed to respond, or responded with error code.'));
            }

            body = body.replace(/\r\n|\n|\r/gm, '').replace(/ +(?= )/g, '');
            var $ = _cheerio.load(body);

            var result = null;
            if (typeof mapperFunction === 'function') {
                result = mapperFunction($);
            }

            if (typeof successCallback === 'function') {
                successCallback(result);
            }
        });
    } catch (e) {
        return errorHandler(errorCallback, e);
    } finally {
        stopTimer();
    }
}

function errorHandler(errorCallback, error) {
    if (typeof errorCallback === 'function') {
        errorCallback(error);
    }
}