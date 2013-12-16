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
                percentage:50
            },
            {
                type: "Military Expansion",
                priority: 2,
                percentage:60
            },
            {
                type: "Conquest",
                priority: 3,
                strategy: "Direct"
            }
        ],
        technologyPreference: {
            speed: {
                cap: 6,
                chance: 20
            },
            exploration: {
                cap:3,
                chance:60
            },
            weapons: {
                cap: 10,
                chance:25
            }
        },
        discoverChance : "0"
    }

    this.player = options.player; // the player object that holds the state of everything for the AI

    this.actions = []; // List of actions to do 

    this.util = new this.utilities(this.player);

    this.af = new this.actionFunctions();

    // may have other things to set like race, and etc.. 

}


AIManager.prototype.update = function (dt) {

    // Update Inputs - takes in the state of the board

    // Process Outputs - Based on new inputs makes decisions regarding long term and short term plans

    // Run Actions in the Queue



    // Create an action example

    var myAction = new this.action({
        AIManager : this,
        name: "Explore Path",
        description: "Find a path to explore.",
        type: 'Long',
        actionFunction: this.af.explorePath,
        priority: 1
    });


    myAction.run();

}





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

    this.run = function () {
        this.actionFunction(this.AIManager);
        this.completed = true;
    }

}

AIManager.prototype.utilities = function (player) {

    this.getPathsToExplore = function () {

        // loop through the paths and return the paths that are not explored

        var pathsToExplore = [];

        for (var i = 0; i < player.paths.pathArray.length; i++) {
            if (player.paths.pathArray[i].explored == false) {
                pathsToExplore.push(player.paths.pathArray[i]);
            }
        }

        return pathsToExplore;

    }

}

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

AIManager.prototype.actionFunctions = function () {

    this.explorePath = function (AIManager) {

        var pathsToExplore = AIManager.util.getPathsToExplore();

        // Any logic to pick a path? Lets just get the first one available for exploration

        for (var i = 0; i < pathsToExplore.length; i++) {
            if (pathsToExplore[i].canExplore()) {
                pathsToExplore[i].explore();
                break;
            }
        }

    }

}



AIManager.prototype.actionFunctionBuilder_Explore = function(){

    /* Exploration manager can queue up the following
      - Explore new path 
      - Discover new path
    */


}

AIManager.prototype.actionFunctionBuilder_MilitaryExpansion = function () {

}

AIManager.prototype.actionFunctionBuilder_Conquest = function () {

}