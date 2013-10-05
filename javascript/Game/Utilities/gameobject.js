
Game.Utilities.GameObject.ResultContainer = [];


// All game objects that use this need to have a location{x,y}
Game.Utilities.GameObject.getClosest = function (obj, objects, numberOf) {

    //console.log("Sorting: " + obj.id);

    var Results = this.ResultContainer;
    Results.length = 0;


    objects.sort(function (a, b) {
        var diff = Game.Utilities.Math.distance(obj.location, a.location) - Game.Utilities.Math.distance(obj.location, b.location);
        return diff;
    });



    for (var i = 0; i < objects.length; i++) {
        if (Results.length == numberOf) {
            break;
        }

        if (obj != objects[i]) {
            //console.log("Adding path of distance: " + Game.Utilities.Math.distance(obj.location, objects[i].location));
            Results.push(objects[i]);
        }
        
    }

    return Results;

}

// All objectes expected to have a path handler
Game.Utilities.GameObject.objectsConnected = function (objects) {

    // Found nodes
    var foundObjects = [];
    var foundIds = [];

    // Paths to search
    var searchPaths = [];

    // Don't search the same path twice (may use this to optimize.... but i don't htink it'll be enough to need it)
    var pathsSearched = [];

    // Starting location
    searchPaths = objects[0].paths.pathsArray.concat(searchPaths);

    foundObjects.push(objects[0]);

    while (searchPaths.length != 0) {

        // get a path
        var currentPath = searchPaths.pop();
        //console.log("Searching path " + currentPath.id + " (" + currentPath.planet2.id + ")");

        // Planet1 - add foundObjects attached to this path
        if (currentPath.defaultActive && $.inArray(currentPath.planet2, foundObjects) == -1) {

            //console.log("(New P2)Found " + currentPath.planet2.id);
            foundIds.push(currentPath.planet2.id);
            foundObjects.push(currentPath.planet2);
            searchPaths = searchPaths.concat(currentPath.planet2.paths.pathsArray);
        }

        // Planet2 - add foundObjects attached to this path
        if (currentPath.defaultActive && $.inArray(currentPath.planet1, foundObjects) == -1) {

            //console.log("(New P1)Found " + currentPath.planet1.id);
            foundIds.push(currentPath.planet1.id);
            foundObjects.push(currentPath.planet1);
            searchPaths = searchPaths.concat(currentPath.planet1.paths.pathsArray);
        }

    }

    //console.log(foundIds.sort());

    return foundObjects.length ==  objects.length

}

Game.Utilities.GameObject.numberActivePaths = function (paths) {

    var counter = 0;
    for (var i = 0; i < paths.length; i++) {
        if (paths[i].defaultActive == true) {
            counter++;
        }
    }
    return counter; 
}

Game.Utilities.GameObject.getPlanetToPrune = function (planets, skipList) {

    var result = null;

    for (var i = 0; i < planets.length; i++) {
        var planet = planets[i];
        var activePaths = Game.Utilities.GameObject.numberActivePaths(planet.paths.pathsArray);

        if (activePaths > 3 && $.inArray(planet, skipList) == -1) {
            result = planet;
            break;
        }
    }

    return result;

}