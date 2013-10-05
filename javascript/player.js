



function Player(options) {

    this.id = options.id;
    this.ai = typeof options.ai != "undefined" ? options.ai : false;
    
    
    this.stats = new PlayerUtilities.statsHandler({ player: this });
    this.technology = new PlayerUtilities.technologyHandler();
    this.resources = new PlayerUtilities.resourcesHandler();
    this.planets = new PlayerUtilities.planetHandler({ player: this });
    this.ships = new PlayerUtilities.shipHandler({ shipConfig: options.shipConfig });
    this.waypoints = new PlayerUtilities.waypointHandler();
    this.paths = new PlayerUtilities.pathHandler();



}

Player.prototype.update = function (dt, doProduction) {


    if (this.stats.ScienceEnergy > this.stats.ScienceEnergyNeeded) {
        this.stats.SciencePoints += 1;
        this.stats.ScienceEnergy = this.stats.ScienceEnergy - this.stats.ScienceEnergyNeeded;
        this.stats.ScienceEnergyNeeded += (250 * this.stats.SciencePoints)/2; // need to figure out exactly how we want to calc this
    }

    for (var i = 0; i < this.planets.planetArray.length; i++) {
        this.planets.planetArray[i].update(dt, this, doProduction);
    }

    for (var i = 0; i < this.paths.pathArray.length; i++) {
        this.paths.pathArray[i].update(dt);
    }

}


Player.prototype.draw = function (ctx) {

    for (var i = 0; i < this.paths.pathArray.length; i++) {
        this.paths.pathArray[i].draw(ctx);
    }

    for (var i = 0; i < this.planets.planetArray.length; i++) {
        this.planets.planetArray[i].draw(ctx);
    }
}

var PlayerUtilities = {

    statsHandler : function(options) {
        
        var self = this;
        var player = options.player;

        this.useSciencePoint = function (prop) {
            var result = false;
            if (self.SciencePoints > 0) {
                self.SciencePoints--;
                player.technology.update(prop, 1)
                result = true;
            }

            return result;
        }

        this.Culture = 500;

        this.SciencePoints = 3;
        this.ScienceEnergy = 0;
        this.ScienceEnergyNeeded = 3000;

    },
    technologyHandler: function (options) {

        var self = this;

        this.technologies = {
            speed: 0,
            exploration: 0,
            weapons: 0,
            defenses: 0,
            science: 0,
            culture: 0,
            economy: 0
        };

        this.update = function (technology, amount) {
            // this likely will only ever go up by 1, but for debugging purposes making it easier to change
            self.technologies[technology] += amount; 
        }
    },
    resourcesHandler: function (options) {

        var self = this;

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
            }
            else {
                if (self.resourceAllocation[resource] < 100) {
                    self.resourceAllocation[resource]++;
                    resourceUpdated = true;
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

            if (direction == "-") {
                self.resourceAllocation[resourceToChange]++;
            }
            else {
                self.resourceAllocation[resourceToChange]--;
            }


        }
    },
    planetHandler: function (options) {
        var self = this;
        var player = options.player;

        this.planetArray = [];
        this.set = function (planet) {
            self.planetArray.push(planet); // Planets that are known (not necessarily owned)
            planet.player.setOwner(player); // This sets the ownership of the planet

            for (var i = 0; i < planet.paths.pathsArray.length; i++) {
                var path = planet.paths.pathsArray[i];

                if (path.defaultActive) {
                    player.paths.add(path);
                }

            }

        }
    },
    pathHandler: function(){
        this.pathArray = [];
        this.add  = function(path){
            this.pathArray.push(path);
        }
    },
    waypointHandler: function () {

        var self = this;
        this.waypointsArray = [];

        this.addWaypoint = function (waypoint) {
            self.waypointsArray.push(waypoint);
        }
    },
    shipHandler : function(options){
        var self = this;
        this.shipTemplates = options.shipConfig;
        this.shipsArray = [];

        this.addShip = function (ship) {
            self.shipsArray.push(ship);
        }
    }
}





