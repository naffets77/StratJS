/*


    Actions
    
    Explore
    Discover
    Move Waypoint
    Research
    Set ship allocations
    Set waypoint ship allocations

*/


/*

    SDM - 2/25/2015 (An Example)

    Whether or not to explore or not from a top level view. We can increase/decrease the weighting of a planets tendency to explore, 
    or discover paths based on whether it has tendencies to be expansionist, militeristic, or a turtler. We can take a planet, and 
    count the number of jumps it is from the home planet. 

    A militerist/expantionist may increase the weighting on exploring planets further away from the home planet, and vice versa for 
    the turtler, choosing to search for planets that are near the home base and prolonging contact as much as possible. 


    SDM - 2/24/2014

    I think we need to organize things from a planet to planet way where each planet is doing it's own thing that makes the 
    most sense for a planet (with a certain amount of weighting based on overall goals), unless a overall 'need' forces the 
    planet to do something it might not have normally decided it would have wanted to do on it's own. Hopefully if each 
    planet maximizes it's ability the AI will be reasonably strong. 


    SDM - A long time ago


    How to do this, do we look at the current state of the puzzle and come up with a new action, or do we create a plan and follow 
    it unless we think we need to do something different. Can we create a base plan that we follow, based on conditions or when things 
    are completed and then make tweaks to the current state of the game as needed. 

    1. Overall Plan

    We create a set of requirements, i.e. 5-6 steps that will end up with a win scenario, i.e. (1) Control 50% of the planets, (2) Max Fleet at 60% 
    (3) Target Enemy Capital

    These three overall tasks, will then trigger smaller tasks until everything is completed. 

    Smaller tasks may be triggered based on other things that occur in the game. 

    We need to be able to translate a task into something the game can do. 

    1. A task should be a series of actions that happen in parallel or serial to get an end result. The task may be successful or may fail. 

    Example: (1) Explore 50% of the planets

    We will know the number of planets in a map, so we'll know when to stop. We need a list of planets that we own, and a list of planets that we do 
    not own but that we know about. From that list we get a planet (deciding somehow, maybe just the top one), and explore it. We keep putting that 
    task into the queue until we have reached our main goal. 

    Sub Task : Get Planet Not Explored
    Sub Task : Explore Planet


    2. Calculate Budget, this will be passed into each Event Builder so it knows how many events 
       it can build (they may or may not actually get spent depending on priorities).


*/


// Doesn't do any logic, that comes from AIConfig, however does go through the process of figuring out how to do stuff
function AIManager(options) {

    //options.aiConfig; // the instructions for how this particular AI should work

    this.aiConfig = {
        goals: [
            {
                type: "Explore",
                priority: 1,
                percentage: 50
            },
            {
                type: "Military Expansion",
                priority: 2,
                percentage: 60
            },
            {
                type: "Conquest",
                priority: 3,
                strategy: "Direct"
            }
        ],
        technologyPreference: {
            engines: {
                cap: 6,
                chance: 20
            },
            exploration: {
                cap: 3,
                chance: 60
            },
            military: {
                cap: 10,
                chance: 25
            }
        },
        discoverChance: "0"
    }

    this.player = options.player; // the player object that holds the state of everything for the AI

    this.actions = []; // List of actions to do 

    this.util = new this.utilities(this.player);

    this.af = new this.actionFunctions();

    this.planetHandler = new this.planetManager(this).init();

    // may have other things to set like race, and etc.. 

}


AIManager.prototype.update = function (dt) {

    // Update Inputs - takes in the state of the board

    // Process Outputs - Based on new inputs makes decisions regarding long term and short term plans

    // Run Actions in the Queue



    // Create an action example




    //myAction.run();
    //myActionDiscover.run();

    this.planetHandler.update();

}




// Action Object
AIManager.prototype.action = function (options) {

    this.AIManager = options.AIManager;
    this.name = options.name;
    this.description = options.description;

    this.type = options.type; // Long term plan or short term
    this.actionFunction = options.actionFunction; // function to call when the action is ready

    this.priority = options.priority;

    this.completed = false;

    this.update = function () {

    }

    this.run = function (AIPlanetHandler) {
        this.actionFunction(this.AIManager, AIPlanetHandler);
        this.completed = true;


        // update planet production after action
        // should this be handled elsewhere where there we know this might change ?

        AIPlanetHandler.planetHandler.planet.production.updateAvailableProduction();
    }

}


// Helpers
AIManager.prototype.utilities = function (player) {

    this.getPlanetPathsToExplore = function (planetHelper) {

        // loop through the paths and return the paths that are not explored

        var pathsToExplore = [];

        for (var i = 0; i < player.paths.pathArray.length; i++) {
            if (player.paths.pathArray[i].explored == false && player.paths.pathArray[i].planet == planetHelper.planet) {
                pathsToExplore.push(player.paths.pathArray[i]);
            }
        }

        return pathsToExplore;

    }

}


// No idea
AIManager.prototype.actionFunctionGetter = function (goal) {
    switch (goal.type) {

        case "Explore":

            break;

        case "Military Expansion":

            break;

        case "Conquest":

            break;

    }
}


// These helpers are the actual actions that allow the AI to do something
AIManager.prototype.actionFunctions = function () {

    this.explorePath = function (AIManager, AIPlanetHandler) {

        var pathsToExplore = AIManager.util.getPlanetPathsToExplore(AIPlanetHandler.planetHandler);

        // Any logic to pick a path? Lets just get the first one available for exploration - should prob
        // do this decision on a planet by planet level, instead of this global list... pass a planet in, 
        // use it to pick out paths... etc..?

        if (pathsToExplore.length > 0) {
            for (var i = 0; i < pathsToExplore.length; i++) {
                if (pathsToExplore[i].canExplore()) {
                    pathsToExplore[i].explore();
                    break;
                }
            }
        }
        else {
            AIPlanetHandler.allPathsExplored = true;
        }

    }

    this.discoverPath = function (AIManager, AIPlanetHandler) {

        var planetHandler = AIPlanetHandler.planetHandler;

        var checkDiscoverPaths = !planetHandler.planet.player.owner.planets.contains(planetHandler.planet).allPathsFound;
        if (checkDiscoverPaths) {
            if (planetHandler.planet.production.lastAvailableProduction >= planetHandler.planet.player.owner.stats.getCost("path", "discoverCost")) {
                planetHandler.planet.player.owner.paths.discoverPath(planetHandler.planet);
            }
        }
        else {
            AIPlanetHandler.allPathsDiscovered = true;
        }

    }

}




// Planet manager
AIManager.prototype.planetManager = function (AIManager) {

    this.AI = AIManager;
    this.planets = [];

    this.init = function () {
        var planets = this.AI.player.planets.planetArray;

        for (var i = 0; i < planets.length; i++) {
            this.planets.push(new this.PlanetHelper({ planetHandler: planets[i] }));
        }

        return this;
    }

    // each planet will do what it needs to do unless there are things (i.e. the weights or something!? that makes it do something else)
    this.update = function (weight1, weight2, weight3, weight4, weight5) {

        var planets = this.planets;

        for (var i = 0; i < planets.length; i++) {
            this.processPlanet(planets[i]);
        }

    }

    this.processPlanet = function (AIPlanetHandler) {
        //console.log("AI Updating : " + planetHandler.planet.id);

        // We'll look at the planet type to do things, for now we'll just do things if we can do them

        // We'll pick one thing to do at a time based on weighting/priority
        
        if (!AIPlanetHandler.allPathsExplored) {
            this.actions.explore.run(AIPlanetHandler); // Try and Explore
        }

        
        if (!AIPlanetHandler.allPathsDiscovered) {
            this.actions.discover.run(AIPlanetHandler); // Try and Discover
        }

    }

    // Explore Action
    this.actions = {
        explore: new this.AI.action({
            AIManager: this.AI,
            name: "Explore Path",
            description: "Find a path to explore.",
            type: 'Long',
            actionFunction: this.AI.af.explorePath,
            priority: 1
        }),

        // Second action example
        discover: new this.AI.action({
            AIManager: this.AI,
            name: "Discover Path",
            description: "Discover a Path",
            type: 'Long',
            actionFunction: this.AI.af.discoverPath,
            priority: 1
        })
    }


    // Planet object to maintain state of AI plans
    this.PlanetHelper = function (options) {

        this.planetHandler = options.planetHandler;

        this.allPathsDiscovered = false;
        this.allPathsExplored = false;
    }

    return this;
}


// I think these are supposed to be the overall guys
AIManager.prototype.actionFunctionBuilder_Explore = function () {

    /* Exploration manager can queue up the following
      - Explore new path 
      - Discover new path
    */


}

AIManager.prototype.actionFunctionBuilder_MilitaryExpansion = function () {

}

AIManager.prototype.actionFunctionBuilder_Conquest = function () {

}