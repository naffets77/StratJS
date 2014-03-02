



function Player(options) {

    this.id = options.id;
    this.ai = typeof options.ai != "undefined" ? options.ai : false;
    
    
    this.stats = new PlayerUtilities.statsHandler({ player: this });
    this.technology = new PlayerUtilities.technologyHandler({
        player: this,
        technologyBonuses: options.technologyBonusConfig,
        technologyUpgrades: options.technologyUpgradesConfig
    });
    this.resources = new PlayerUtilities.resourcesHandler({ player: this });
    this.planets = new PlayerUtilities.planetHandler({ player: this });
    this.ships = new PlayerUtilities.shipHandler({ shipConfig: options.shipConfig, player:this });
    this.waypoints = new PlayerUtilities.waypointHandler({player:this});
    this.paths = new PlayerUtilities.pathHandler({ player: this });
    this.science = new PlayerUtilities.scienceHandler({ player: this });



}

Player.prototype.update = function (dt, doProduction) {


    this.planets.updatePlanetStats();

    this.science.update(dt);

    var productionPercentAvailable = this.resources.getProductionAvailable();

    for (var i = 0; i < this.planets.planetArray.length; i++) {

        if (this.planets.planetArray[i].planet.player.owner == this) {
            this.planets.planetArray[i].update(dt, doProduction, productionPercentAvailable);
        }
    }

    for (var i = 0; i < this.paths.pathArray.length; i++) {
        this.paths.pathArray[i].update(dt);
    }

    for (var i = 0; i < this.waypoints.waypointArray.length; i++) {
        this.waypoints.waypointArray[i].update(dt);
    }
}


Player.prototype.draw = function (ctx) {

    for (var i = 0; i < this.paths.pathArray.length; i++) {
        this.paths.pathArray[i].draw(ctx);
    }

    for (var i = 0; i < this.planets.planetArray.length; i++) {
        this.planets.planetArray[i].draw(ctx);
    }

    for (var i = 0; i < this.waypoints.waypointArray.length; i++) {
        this.waypoints.waypointArray[i].draw(ctx);
    }
}

Player.prototype.drawVisible = function (ctx) {

    var planets = this.planets.planetArray;

    for (var i = 0; i < planets.length; i++) {
        var planet = planets[i].planet;
        if (planet.player.owner == this) {
            clearCircle(ctx, planet.location.x, planet.location.y, 300);
        }
    }


}

var PlayerUtilities = {
    statsHandler : function(options) {
        
        var self = this;
        var player = options.player;


        this.percentageBonuses = {
            populationGrowthRateBonus:{
                sources: [],
                cachedValue: 0
            },
            explorationRateBonus:{
                sources: [],
                cachedValue: 0
            },
            explorationCostBonus:{
                sources:[],
                cachedValue:0
            },
            discoverRateBonus: {
                sources: [],
                cachedValue: 0
            },
            discoverCostBonus: {
                sources: [],
                cachedValue: 0
            },
            sciencePointResearchBonus: {
                sources: [],
                cachedValue : 0
            },
            speedBonus: {
                sources: [],
                cachedValue: 0
            },
            sensorBonus: {
                sources: [],
                cachedValue: 0
            },
            shipUpkeepPercentage : {
                sources: [],
                cachedValue: 0
            }
        }


        this.Culture = 500;


        // options require: name, value, source
        this.registerStatusBonus = function (options) {

            if (self.percentageBonuses[options.name] != null) {

                self.percentageBonuses[options.name].sources.push({
                    name: options.name,
                    value: options.value,
                    source: options.source
                });

                self.percentageBonuses[options.name].cachedValue += parseInt(options.value);
            }
            else {
                alert("Trying to apply unknown bonus");
            }

        }

        this.getCost = function (type, name) {
            var baseCost = gameConfig[type][name];            
            return baseCost;
        }

    },
    technologyHandler: function (options) {

        var self = this;
        var player = options.player;


        this.technologies = {
            engines: 0,
            exploration: 0,
            military: 0,
            defenses: 0,
            science: 0,
            culture: 0,
            economy: 0
        };

        
        this.technologyBonuses = options.technologyBonuses; // comes from config

        this.technologyUpgrades = options.technologyUpgrades; 

        this.upgrade = function (technology, amount) {
            // this likely will only ever go up by 1, but for debugging purposes making it easier to change
            self.technologies[technology] += amount;

            // Handle new tech upgrade bonuses
            var techUpgradeArray = this.technologyUpgrades[technology][self.technologies[technology] - 1];//technologyConfig[technology][self.technologies[technology] - 1]; // array is 0 indexed
            for (var i = 0; i < techUpgradeArray.length; i++) {
                var upgrade = techUpgradeArray[i];

                switch (upgrade.type) {
                    case "STAT PERCENT BOOST":
                        player.stats.registerStatusBonus(upgrade);
                        break;
                    default:
                        alert("Unknown upgrade type: " + upgrade.type);
                }

            }

            // See if any multi-tech bonuses should be activated
            for (var i = 0; i < this.technologyBonuses.length; i++) {
                var bonus = this.technologyBonuses[i];
                if (bonus.active == false && this.checkTechnologyBonus(bonus)) {
                    console.log("Activated New Tech Bonus: " + bonus.name);
                    bonus.active = true;
                }
            }


        }

        this.checkTechnologyBonus = function (bonus) {

            var result = true;
            var techCache = this.technologies;


            for (var i = 0; i < bonus.requirements.length; i++) {
                var requirement = bonus.requirements[i];

                if (techCache[requirement.technology] < requirement.level) {
                    result = false;
                }
            }

            return result;
        }


        
    },
    resourcesHandler: function (options) {

        var player = options.player;

        this.resourceLocked = null;
        
        this.resourceAllocation = {
            production: 34,
            science: 33,
            culture: 33
        };

        this.updateResourceAllocation = function(resource, direction){
            
            var resourceUpdated = false;

            // Update the resource being changed
            if (direction == "-") {
                if (self.resourceAllocation[resource] > 0) {
                    self.resourceAllocation[resource]--;
                    resourceUpdated = true;
                }
                else if (self.resourceAllocation[resource] == 0) { // can't decrease from 0
                    return;
                }
            }
            else {
                if (self.resourceAllocation[resource] < 100) {
                    self.resourceAllocation[resource]++;
                    resourceUpdated = true;
                }
                else if (self.resourceAllocation[resource] == 100) { // can't increase from 100
                    return;
                }
            }

            // Update Other Resources

            var resourceToChange = null;
            for (var prop in self.resourceAllocation) {

                var resourceToCheck = prop;

                // Don't change the current resource or a locked resource
                if (resourceToCheck == resource || resourceToCheck == self.resourceLocked) {
                    continue;
                }

                if (resourceToChange != null) {
                    if (direction == "-" && self.resourceAllocation[resourceToChange] > self.resourceAllocation[prop]) {
                        resourceToChange = prop;
                    }

                    if (direction == "+" && self.resourceAllocation[resourceToChange] < self.resourceAllocation[prop]) {
                        resourceToChange = prop;
                    }
                    
                }
                else {
                    resourceToChange = prop;
                }
            }

            if (direction == "-" && self.resourceAllocation[resourceToChange] < 100) {
                self.resourceAllocation[resourceToChange]++;
            }

            if (direction == "+" && self.resourceAllocation[resourceToChange] > 0) {
                self.resourceAllocation[resourceToChange]--;
            }


        }

        this.getShipUpkeepCost = function () {
            return player.ships.upkeepCache * (player.stats.percentageBonuses.shipUpkeepPercentage.cachedValue / 100)
        }

        this.getShipUpkeepPercentage = function () {
            return this.getShipUpkeepCost() / player.planets.planetStats.productionRate;
        }

        this.getProductionAvailable = function () {
            var productionPercentAvailable = 100;
            var shipUpkeepPercent = Math.floor(this.getShipUpkeepPercentage() * 100);

            // Subtract all of the things that create global cost
            productionPercentAvailable -= shipUpkeepPercent;

            // there will be more..? otherwise this can all be one line!

            return productionPercentAvailable;
        }
    },
    planetHandler: function (options) {
        var self = this;
        var player = options.player;

        this.planetArray = [];

        this.planetStats = {
            count: 0,
            productionRate: 0,
            population: 0,
            infrastructure: 0
        }

        this.add = function (planet) {


            self.planetArray.push(new planetHandler({planet:planet})); // Planets that are known (not necessarily owned)

            //planet.player.setOwner(player); // This sets the ownership of the planet
            if (planet.player.owner == null) {

                planet.player.setOwner(player);
            
                for (var i = 0; i < planet.paths.pathsArray.length; i++) {
                    var path = planet.paths.pathsArray[i];

                    if (path.defaultActive && !player.paths.contains(path)) {
                        player.paths.add(path, planet);
                    }

                }

            }

        }

        this.contains = function (planet) {
            
            var result = null;
            for (var i = 0; i < this.planetArray.length; i++) {
                if (planet.id == this.planetArray[i].planet.id) {
                    result = this.planetArray[i];
                    break;
                }
            }

            return result;
        }

        this.updatePlanetStats = function () {
            
            self.planetStats.count = 0;
            self.planetStats.productionRate = 0;
            self.planetStats.population = 0;
            self.planetStats.infrastructure = 0;

            for (var i = 0; i < this.planetArray.length; i++) {
                if (player == this.planetArray[i].planet.player.owner) {
                    self.planetStats.count ++;
                    self.planetStats.productionRate += this.planetArray[i].planet.production.calculateRaw();
                    self.planetStats.population += this.planetArray[i].planet.population.value;

                    self.planetStats.infrastructure += this.planetArray[i].planet.infrastructure.level;
                }
            }
        }

        this.getProductionCost = function (planet) {
            // get's the current cost of everything that's happening on the planet before production (currently only exploration costs)

            var cost = 0;
            cost += player.paths.getProductionCost(planet);

            return cost;
        }

        // local object
        function planetHandler(options) {
            this.planet = options.planet;
            this.allPathsFound = false;
            
            this.update = function (dt, doProduction, productionPercentAvailable) {
                this.planet.update(dt, player, doProduction, productionPercentAvailable);
            }

            this.draw = function (ctx) {
                this.planet.draw(ctx, !this.allPathsFound);
            }

            this.checkOver = function (x, y, mouseClick, mouseDown) {
                return this.planet.mouse.checkOver(x, y, mouseClick, mouseDown);
            }

            // Checks if it has any paths that are not
            this.checkPathsCompleted = function () {

                var foundCounter = 0;
                var numPlanetPaths = this.planet.paths.pathsArray.length;
                var numPlayerPaths = player.paths.pathArray.length;

                for (var i = 0; i < numPlanetPaths; i++) {

                    var planetPath = this.planet.paths.pathsArray[i];

                    for (var j = 0; j < numPlayerPaths; j++) {
                        
                        var playerPath = player.paths.pathArray[j].path;

                        if (planetPath.id == playerPath.id) {
                            foundCounter++;
                        }

                        if(foundCounter == numPlanetPaths){ break; }
                    }

                    if(foundCounter == numPlanetPaths){break;}
                }

                if (foundCounter == numPlanetPaths) {
                    //alert("All Paths Found");
                    this.allPathsFound = true;
                }

            }
        }
    },
    pathHandler: function (options) {

        var self = this;

        this.pathArray = [];
        this.player = options.player;
        this.pathsBeingExplored = [];

        // takes a path or array of paths, if an array will select one to add. Array version will return path selected
        this.add = function (path, planet) {

            var selectedPath_PathHandler;

            // array of paths need to select one
            if (path instanceof Array) {
                for (var i = 0; i < path.length; i++) {
                    if (!this.contains(path[i])) {
                        selectedPath_PathHandler = new pathHandler({ path: path[i], planet: planet, active: path[i].defaultActive, player: self.player })
                        this.pathArray.push(selectedPath_PathHandler);
                        break;
                    }
                }

            }
            else {
                selectedPath_PathHandler = new pathHandler({ path: path, planet: planet, active: path.defaultActive, player: self.player })
                this.pathArray.push(selectedPath_PathHandler);
            }

            return selectedPath_PathHandler;
            
        }

        this.contains = function (path) {

            var result = false;
            for (var i = 0; i < this.pathArray.length; i++) {
                if (path.id == this.pathArray[i].path.id) {
                    result = true;
                    break;
                }
            }

            return result;
        }

        this.getByPlanet = function (planet) {
            var result = [];

            for (var i = 0; i < this.pathArray.length; i++) {
                if (planet == this.pathArray[i].path.planet) {
                    result.push(this.pathArray[i]);
                }
            }

            return result;
        }

        this.discoverPath = function (planet) {

            // update planet to see if it has any more paths to discover
            var planetHelper = this.player.planets.contains(planet);

            planetHelper.checkPathsCompleted();

            if (!planetHelper.allPathsFound) {

                // trigger the discover 
                this.add(planet.paths.pathsArray, planet).discover();
            }
            else {
                console.log("tried to discover path that didn't exist...TROUBLESHOOT (PID: " + planet.id + ")");
            }

            
            

        }

        // current production cost of all paths
        this.getProductionCost = function (planet) {

            var cost = 0;

            for (var i = 0; i < this.pathArray.length; i++) {
                var path = this.pathArray[i];

                if (path.planet == planet && path.exploring == true) {
                    cost += path.exploreCost;
                }
            }

            return cost;
        }

        // Private object used to manage paths
        function pathHandler(options) {
            this.path = options.path;
            this.planet = options.planet;
            this.active = options.active;
            this.player = options.player;
            
            this.explored = false;
            this.exploring = false;
            this.distanceExplored = 0;
            this.exploreRate = null;
            this.exploreCost = null;
            this.exploredPlanet = null;

            this.explore = function () {

                if (this.canExplore()) {
                    var explorationCost = this.player.stats.getCost("path", "exploreCost");
                    var explorationRate = this.player.stats.getCost("path", "exploreRate");

                    explorationCost -= explorationCost * (this.player.stats.percentageBonuses.explorationCostBonus.cachedValue / 100);

                    explorationRate += explorationRate * (this.player.stats.percentageBonuses.explorationRateBonus.cachedValue / 100);
                    explorationRate += explorationRate * (this.player.stats.percentageBonuses.speedBonus.cachedValue / 100);

                    this.exploreRate = explorationRate;
                    this.exploreCost = explorationCost;
                    this.distanceExplored = this.planet.radius;
                    this.exploring = true;
                }
            }

            this.discover = function () {
                if (this.canDiscover()) {
                    var discoverCost = this.player.stats.getCost("path", "discoverCost");
                    var discoverRate = this.player.stats.getCost("path", "discoverRate");

                    discoverCost -= discoverCost * (this.player.stats.percentageBonuses.discoverCostBonus.cachedValue / 100);

                    discoverRate += discoverRate * (this.player.stats.percentageBonuses.discoverRateBonus.cachedValue / 100);
                    discoverRate += discoverRate * (this.player.stats.percentageBonuses.speedBonus.cachedValue / 100);

                    this.exploreRate = discoverRate;
                    this.exploreCost = discoverCost;
                    this.distanceExplored = this.planet.radius;
                    this.exploring = true;
                }
            }

            this.checkOver = function (x, y, mouseClick) {

                if (this.explored == false) {
                    this.path.mouse.checkOver(x, y, mouseClick, this);
                }

            }

            this.update = function (dt) {


                if (this.exploring) {
                    //console.log("Explored: " + this.distanceExplored + " of " + this.path.length + " (" + this.distanceExplored / this.path.length + ")");
                    this.distanceExplored += this.exploreRate * dt;
                }

                if (this.exploring && this.distanceExplored > this.path.length) {
                    this.startExploring = false;
                    this.explored = true;
                    this.exploring = false;


                    // This should only add the Planet if it's not owned by someone else
                    var oppositePlanet = this.path.getOppositePlanet(this.planet);
                    
                    if (!self.player.planets.contains(oppositePlanet)) {
                        self.player.planets.add(oppositePlanet);
                    }

                }

                this.path.update(dt);
            }

            this.draw = function (ctx) {

                this.path.draw(ctx, this.canExplore(), this.explored, this.exploring, this.distanceExplored);
            }

            this.canExplore = function () {

                var explorationCost = this.planet.player.owner.stats.getCost("path", "exploreCost");
                explorationCost -= explorationCost * (self.player.stats.percentageBonuses.explorationCostBonus.cachedValue / 100);
                return !this.explored && !this.exploring && this.planet.production.lastAvailableProduction >= explorationCost;

            }

            this.canDiscover = function () {
                var discoverCost = this.planet.player.owner.stats.getCost("path", "discoverCost");
                discoverCost -= discoverCost * (self.player.stats.percentageBonuses.discoverCostBonus.cachedValue / 100);
                return !this.explored && !this.exploring && this.planet.production.lastAvailableProduction >= discoverCost;
            }


        }

    },
    waypointHandler: function (options) {


        var self = this;
        var player = options.player;

        this.waypointArray = [];

        this.add = function () {

            var waypoint = new Waypoint({
                player: player,
                id: this.waypointArray.length + 1,
                location: { x: 0, y: 0 }
            });


            self.waypointArray.push(waypoint);
        }

        this.getById = function (id) {

            for (var i = 0; i < self.waypointArray.length; i++) {
                var waypoint = self.waypointArray[i];

                if (waypoint.id == id) {
                    return waypoint;
                }
            }

        }


    },
    shipHandler : function(options){
        var self = this;
        var player = options.player;
        this.shipTemplates = options.shipConfig;
        this.shipsArray = [];
        this.upkeepCache = 0;

        // init count and queue
        for (var shipType in shipConfig) {
            for (var shipSize in shipConfig[shipType].shipSizes) {
                var ship = shipConfig[shipType].shipSizes[shipSize];
                ship.queue = 0;
                ship.count = 0;
            }
        }

        this.addShip = function (ship) {
            self.shipsArray.push(ship);
            this.upkeepCache += ship.cost;
            
            // update ship count cache
            self.shipTemplates[ship.role].shipSizes[ship.size].count++;
        }

        this.removeShip = function (ship, reason) {
            ship.destroyed = true;
            ship.destroyedReason = reason;
            this.upkeepCache -= ship.cost;
        }

        this.getShipToBuild = function (infrastructureLevel) {

            // 
            for (var shipType in shipConfig) {
                for (var shipSize in shipConfig[shipType].shipSizes) {
                    var ship = shipConfig[shipType].shipSizes[shipSize];

                    // planet is high enough level, and we 
                    if (ship.infrastructureLevel <= infrastructureLevel && ship.count < ship.queue) {
                        return ship;
                    }

                }
            }

            return null;

        }

        this.setShipQueue = function(shipRole, shipSize, count){
            Game.activePlayer.ships.shipTemplates[shipRole].shipSizes[shipSize].queue = count;
        }
    },
    scienceHandler: function (options) {

        var self = this;
        var player = options.player;

        this.SciencePoints = 3;
        this.ScienceEnergy = 0;
        this.ScienceEnergyNeeded = 500;


        this.useSciencePoint = function (prop) {
            var result = false;
            if (self.SciencePoints > 0) {
                self.SciencePoints--;
                player.technology.upgrade(prop, 1)
                result = true;
            }

            return result;
        }

        this.update = function (dt) {
            if (self.ScienceEnergy > self.ScienceEnergyNeeded) {
                self.SciencePoints += 1;
                self.ScienceEnergy = self.ScienceEnergy - self.ScienceEnergyNeeded;
                self.ScienceEnergyNeeded += (250 * self.SciencePoints) / 2; // need to figure out exactly how we want to calc this
            }
        }

        this.produceScience = function (planetBaseScienceProduction) {

            var bonusPercent = player.stats.percentageBonuses.sciencePointResearchBonus.cachedValue;
            var bonusAmount = 0;
            
            if(bonusPercent != 0){
                bonusAmount += planetBaseScienceProduction * (bonusPercent / 100);
            }

            self.ScienceEnergy += Math.ceil(planetBaseScienceProduction + bonusAmount);
        }
    }
}



// Draw Helper (this should be some drawing lib helper?)

function clearCircle(ctx, x, y, radius) {
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.clip();
    ctx.clearRect(x - radius - 1, y - radius - 1,
                      radius * 2 + 2, radius * 2 + 2);
    ctx.restore();
};



