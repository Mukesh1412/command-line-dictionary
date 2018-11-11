(function () {

    var stdin = process.openStdin();
    var wordController = require('./controller/wordController');
    var gameService = require('./services/gameService');

    var dictionary = {
        'command': './dict',
        'gameStatus': false
    };

    stdin.addListener("data", function (consoleArgs) {
        var data = consoleArgs.toString().trim().split(" ");
        // console.log('data:: ',data)

        if (dictionary.gameStatus) {
            gameService.verifyAnswer(data[0]);
        }
        else if (data[0] === dictionary.command) {
            if (data[1] === 'play') {
                gameService.playGame();
                dictionary.setgameStatus();
            }
            else if (data[1] && wordController[data[1]] && data[2]) {
                wordController[data[1]](data[2]).then(function (result) {
                    print(result);
                }).catch(function(err){})
            }
            else if (data[1] && data.length === 2) {
                // dictonary get all info of word
                wordController['dict'](data[1]).then(function (result) {
                    print(result);
                }).catch(function(err){})
            }
            else if (data[1] === undefined) {
                // Word of the day
                // console.log("hello")
                wordController['wordOfTheDay']().then(function (result) {
                    print(result);
                }).catch(function(err){});
            }
            else {
                console.error("Wrong Command");
            }
        }
        else {
            console.error("Wrong command");
        }
    });


    dictionary.resetgameStatus = function () {
        dictionary.gameStatus = false;
    };

    dictionary.setgameStatus = function () {
        dictionary.gameStatus = true;
    };

    function print(result) {
        console.log(result);
    }

    console.log("Welcome to Dictionary");

    module.exports  = dictionary;

})();