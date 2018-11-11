/*jshint esversion: 6 */
(function () {
    var api = require('../services/wordService.js');
    var Promise = require("bluebird");
    var Words = require('../config/words.json')
    var handler = {}, self = handler;

    handler['def'] = function (word) {
        var promise = api.get("definition", word);
        return promise.then(function (response) {
            function definition() {
                let meaning = "";
                // ler responseResult = JSON.parse(response)
                response.results[0].lexicalEntries.forEach(function (obj) {
                    if (obj.entries) {
                        obj.entries.forEach(function (obj1) {
                            if (obj1.senses) {
                                obj1.senses.forEach(function (obj2) {
                                    // console.log(obj2.definitions[0])
                                    if (obj2.definitions) {
                                        obj2.definitions.forEach(function (obj3) {
                                            meaning += "\n" + obj3 + "\n";
                                        })
                                    }
                                })
                            }
                        })
                    }
                });
                return "Definition: " + meaning;
            }
            if (response && Array.isArray(response.results[0].lexicalEntries) && response.results[0].lexicalEntries.length === 0)
                return Promise.resolve("The word doesn't exist");
            return Promise.resolve(definition());
        }).catch(function (err) {
            console.error("Failed while getting the definition of word ", err);
            return Promise.reject();
        });
    };

    handler['syn'] = function (word) {
        var promise = api.get("synonym", word);
        return promise.then(function (response) {
            // console.log('synonims: ',response)
            function synonyms() {
                let synonym = "";
                response.results[0].lexicalEntries.forEach(function (obj) {
                    // console.log('helo response:  ')
                    if (obj.entries) {
                        obj.entries.forEach(function (obj1) {
                            if (obj1.senses) {
                                obj1.senses.forEach(function (obj2) {
                                    // console.log(obj2.definitions[0])
                                    if (obj2.synonyms) {
                                        obj2.synonyms.forEach(function (obj3) {
                                            synonym += obj3.text + ", ";
                                        })
                                    }
                                })
                            }
                        })
                    }
                });
                return "Synonyms: " + synonym.slice(0, -2);
            }
            return Promise.resolve(synonyms());
        }).catch(function (err) {
            console.error("Failed while getting the synonyms of word ");
            return Promise.reject();
        });
    };

    handler['ant'] = function (word) {
        var promise = api.get("antonym", word);
        return promise.then(function (response) {
            function antonym() {
                let antonyms = "";
                response.results[0].lexicalEntries.forEach(function (obj) {
                    // console.log('helo response:  ')
                    if (obj.entries) {
                        obj.entries.forEach(function (obj1) {
                            if (obj1.senses) {
                                obj1.senses.forEach(function (obj2) {
                                    // console.log(obj2.definitions[0])
                                    if (obj2.antonyms) {
                                        obj2.antonyms.forEach(function (obj3) {
                                            antonyms += obj3.text + ", ";
                                        })
                                    }
                                })
                            }
                        })
                    }
                });
                return "Antonyms: " + antonyms.slice(0, -2)
            }
            return Promise.resolve(antonym());
        }).catch(function () {
            console.error("Failed while getting the antonyms of word");
            return Promise.reject();
        });
    };

    handler['ex'] = function (word) {
        var promise = api.get("topExample", word);
        return promise.then(function (response) {
            function example() {
                let example = "\n";
                response.results[0].lexicalEntries.forEach(function (obj) {
                    // console.log('helo response:  ')
                    if (obj.sentences) {
                        obj.sentences.forEach(function (obj1) {
                            if (obj1.text) {
                                example += "\n"+obj1.text + "\n";
                            }
                        })
                    }
                });
                return "Example: " + example;
            }
            return Promise.resolve(example());
        }).catch(function () {
            console.error("Failed while getting the exmples of word");
            return Promise.reject();
        });
    };

    handler['dict'] = function (word) {
        var defPromise = self['def'](word),
            synonymPromise = self['syn'](word),
            antonymPromise = self['ant'](word),
            examplePromise = self['ex'](word),
            arrOfPromises = [defPromise, synonymPromise, antonymPromise, examplePromise];

        return Promise.all(arrOfPromises).then(function (result) {
            return Promise.resolve(result.join("\n"));
        }).catch(function () {
            console.error("Failed while getting the dictonary of word");
            return Promise.reject();
        });
    };

    handler['wordOfTheDay'] = function () {
        // var promise = api.get('wordOfTheDay',"");
        // return promise.then(function (response) {
            // let index = Math.floor(Math.random() * 40);
            // console.log("response:: ",response.results,index)
            // word= response.results[index].word;
            word= getRandomWord();

            console.log("word:: ",word)
            // word = response.word;
            var promise= self['dict'](word);
        return promise.then(function (result) {
            word = "Word of the day: " + word + "\n";
            return Promise.resolve(word + result);
        }).catch(function () {
            console.error("Failed while getting the word of the day of word ");
            return Promise.reject();
        });
    };

    handler['play'] = function () {
        var promise = api.get('randomWord'), word;
        return promise.then(function (response) {
            word = getRandomWord();
            // word='ace'
            var defPromise = self['def'](word),
                synonymPromise = self['syn'](word),
                antonymPromise = self['ant'](word),
                arrOfPromises = [defPromise, synonymPromise, antonymPromise];

            return Promise.all(arrOfPromises);
        }).then(function (result) {
            var hintObject = getHintObject(result, word);
            return Promise.resolve(hintObject);
        }).catch(function (err) {
            console.error("Failed while getting the starting the game ",err);
            return Promise.reject();
        });
    };
    var getRandomWord = function () {
        let index = Math.floor(Math.random() * 900);
        return Words.commonWords[index];
    };

    function getHintObject(result, word) {
        var obj = {};

        function getDefinition() {
            console.log(result)
            return result[0].split("\n\n");
        }

        function getSynonym() {
            return result[1].split(", ");
        }

        function getAnonym() {
            return result[2].split(", ");
        }

        function randomlyJumbledWord(word) {
            var newWord = "", word = word.split("");

            function getRandomNum(max, min) {
                return Math.floor(Math.random() * max);
            }
            for (var i = 0; i < word.length; i++) {
                let index = getRandomNum(word.length, 0);
                newWord += word[index];
                word.splice(index, 1);
                i--;
            }
            return newWord;
        }

        obj.definition = getDefinition();
        obj.synonyms = getSynonym();
        obj.antonyms = getAnonym();
        obj.word = word;
        obj.jumbledWord = [randomlyJumbledWord(word)];
        obj.eligibleHints = ["definition"];
        if (obj.antonyms.length)
            obj.eligibleHints.push("antonyms");
        if (obj.synonyms.length)
            obj.eligibleHints.push("synonyms");
        obj.currentPointerOfHint = Math.floor(Math.random() * obj.eligibleHints.length);
        return obj;
    }

    module.exports = handler;
})();