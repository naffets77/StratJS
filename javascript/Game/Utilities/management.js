

Game.Utilities.Management.sendTic = function (game) {

    var result = false;

    if (Math.floor(game.gameTime / game.gameTicRate) > game.gameTicCount) {
        game.gameTicCount++;
        result = true;
    }

    return result;
}

Game.Utilities.Management.buildMap = function (game) {

    // Reset
    game.Planets.length = 0;
    game.Paths.length = 0;

    // Build
    makePlanets(game);
    makePaths(game);
    prunePaths(game);


    function makePlanets(game) {

        var possibleLocations = [];
        var possiblePlanetTypes = ["red", "yellow", "blue", "orange", "green", "purple", "white"];

        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 8; j++) {

                //var randomnumber = Math.floor(Math.random() * 5)
                possibleLocation = {
                    x: i * game.canvas.width / 10 + 150,
                    y: j * game.canvas.height / 4 + 150
                };

                if ((Math.floor(Math.random() * 2) + 1) == 1) {
                    possibleLocation.x += Math.floor(Math.random() * 50);
                }
                else {
                    possibleLocation.x -= Math.floor(Math.random() * 50);
                }

                if ((Math.floor(Math.random() * 2) + 1) == 1) {
                    possibleLocation.y += Math.floor(Math.random() * 50);
                }
                else {
                    possibleLocation.y -= Math.floor(Math.random() * 50);
                }


                if (Math.floor(Math.random() * 4) + 1 <= 2) { // 20% chance to get a planet
                    game.Planets.push(new Planet({

                        id: game.Planets.length,
                        location: { x: possibleLocation.x, y: possibleLocation.y },
                        type: "white",
                        size: "big",
                        imageName: 'planet5',

                        population: {
                            initialPopulation: 50
                        }
                    }));
                }

            }
        }


    }

    function makePaths(game) {
        var countForPathId = 0;

        for (var i = 0; i < game.Planets.length; i++) {

            var tempPlanet = game.Planets[i];

            game.Utilities.GameObject.getClosest(tempPlanet, $.extend(true, [], game.Planets), 5);

            for (var j = 0; j < game.Utilities.GameObject.ResultContainer.length; j++) {

                var tempPath = new Path(tempPlanet, game.Utilities.GameObject.ResultContainer[j], countForPathId);

                // need to make sure path doesn't already exist between planets
                if (!tempPlanet.paths.hasPath(tempPath) && !game.Utilities.GameObject.ResultContainer[j].paths.hasPath(tempPath)) {

                    tempPlanet.paths.pathsArray.push(tempPath);
                    game.Utilities.GameObject.ResultContainer[j].paths.pathsArray.push(tempPath);
                    game.Paths.push(tempPath);

                    countForPathId++;
                }
            }

        }
    }

    function prunePaths(game) {

        // All the planets have 5 paths which is too much initially, we'll want to hide most of the paths

        var escapeCounter = 0; //till we get the logic right!
        var tempPlanet = Game.Utilities.GameObject.getPlanetToPrune(Game.Planets, []);
        var tested = [tempPlanet];
        while (tempPlanet) {

            //console.log("Pruning: " + tempPlanet.id);

            // make sure all nodes are connected or fail


            //take a planet, if it has greater than 3 paths, remove a path, do a depthfirst search and make sure all nodes are still connected
            //var tempPlanet = Game.Planets[Math.floor(Math.random() * Game.Planets.length)];
            //var tempPath = tempPlanet.paths.pathsArray[Math.floor(Math.random() * tempPlanet.paths.pathsArray.length)];

            tempPlanet.paths.pathsArray.sort(function (a, b) {
                return Game.Utilities.Math.distance(b.planet1.location, b.planet2.location) - Game.Utilities.Math.distance(a.planet1.location, a.planet2.location);
            });


            for (var i = 0; i < tempPlanet.paths.pathsArray.length; i++) {

                var tempPath = tempPlanet.paths.pathsArray[i];

                tempPath.defaultActive = false;

                //console.log("Removing path " + tempPath.id + " (" + tempPath.planet1.id + "->" + tempPath.planet2.id + ")");

                // If we're not connected, then set it active and try again
                if (!Game.Utilities.GameObject.objectsConnected(Game.Planets)) {
                    //console.log("Not Connected: Put it back");
                    tempPath.defaultActive = true;
                }
            }

            tempPlanet = Game.Utilities.GameObject.getPlanetToPrune(Game.Planets, tested);
            tested.push(tempPlanet);
            escapeCounter++;

            if (escapeCounter > 15000) {
                console.log("...had to escape...");
                break;
            }
        }

        //console.log("Done pruning paths(" + Game.Utilities.GameObject.numberActivePaths(Game.Paths) / Game.Planets.length + " paths per planet): " + escapeCounter);

    }
}






