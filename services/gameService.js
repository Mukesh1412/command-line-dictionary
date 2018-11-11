(function () {
    var handler = require('../controller/wordController');
    var gameService = {}, self = gameService, app;

    gameService.playGame = function () {
        handler['play']().then(function (result) {
            gameService.hints = result;
            self.Question();
        });
    };

    gameService.verifyAnswer = function (inputText) {

        let options = {
            "1": "Enter again : ",
            "2": self.Question,
            "3": self.quit
        };
        if (parseInt(inputText)) {
            if (options[inputText] && typeof options[inputText] === 'function')
                options[inputText]();
            else
                console.log("Enter the word: ");
        }
        else if (inputText === self.hints.word || self.hints.synonyms.indexOf(inputText) !== -1) {
            console.log("Correct, Thanks for Playing");
        }
        else {
            console.log("Wrong");
            console.log("Choose any option : \n1: try again \n2: hint \n3: quit ");
        }
    };

    gameService.Question = function () {
        var clue = self.hints.eligibleHints[self.hints.currentPointerOfHint];

        var randomNumber = Math.floor(Math.random() * self.hints[clue].length);
        if (clue === 'definition') {
            console.log("Enter word whose definition is: " + self.hints.definition[randomNumber]);
        }
        if (clue === 'synonyms') {
            console.log("Enter word whose synonym is: " + self.hints.synonyms[randomNumber]);
        }
        if (clue === 'antonyms') {
            console.log("Enter word whose antonyms is: " + self.hints.antonyms[randomNumber]);
        }
        if (clue === 'jumbledWord') {
            console.log("The word is jumbled in this word, could you find it: " + self.hints.jumbledWord[randomNumber]);
        }
        if(self.hints.eligibleHints.indexOf("jumbledWord") === -1)
            self.hints.eligibleHints.push("jumbledWord"); // Show jumbled word only as hint not at the start of question

        // increse the current hint pointer
        self.hints.currentPointerOfHint++;
        if(self.hints.currentPointerOfHint === self.hints.eligibleHints.length)
            self.hints.currentPointerOfHint = 0;
    };

    gameService.quit = function () {
        console.log("The answer is: " + self.hints.word);
        console.log("Definition: "+self.hints.definition.join("\n"));
        console.log("Synonyms: "+self.hints.synonyms.join(","));
        console.log("Antonyms: "+self.hints.antonyms.join(","));
        app = require('../app.js');
        app.resetGameMode();

    };

    module.exports = gameService;

})();