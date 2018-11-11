(function () {
    var api = {};
    var rp = require('request-promise');
    var Promise = require("bluebird");
    var config = require('../config/config.json');
    var properties = require('../config/properties.json');
    api['get'] = function (endPoint, word) {
        // console.log(endPoint + "--------------------------")
        var options = setOptions(endPoint, word);
        // console.log(options)
        return rp(options).then(function (response) {
            return Promise.resolve(response);
        }).catch(function (err) {
            console.error("Error occured while fetching the api - " + err.message + '\n');
            return Promise.reject("Error");
        })

    };


    var setOptions = function (endPoint, word) {
        var wordConfig = config['endPoints'][endPoint];
        var url = wordConfig.url,
            headers = properties.headers,
            options;
        url = replaceTokens(url, word);
        options = {
            'uri': url,
            'headers': headers,
            'json': true
        };
        return options;
    };

    function replaceTokens(url, word) {
        var urlParams = url.split("/");
        urlParams.forEach(function (param, index) {

            if (param.startsWith('{') && param.endsWith('}')) {
                let actualParam = param.substr(1, param.length - 2);
                if (properties[actualParam])
                    urlParams[index] = properties[actualParam];
                if (actualParam === 'word')
                    urlParams[index] = word
            }
        });
        return urlParams.join("/");
    };

    module.exports = api;
})();