

function Planet(options) {

    this.diameter = 80;
    this.radius = 40;
    this.location = options.location;
    this.connectedness = 0; // How connected a planet is to an empire

    this.infrastructure = new PlanetUtilities.infrastructureHandler(this);
    this.production = new PlanetUtilities.productionHandler(this);
    this.population = new PlanetUtilities.populationHandler(this, options.population);
    this.player = new PlanetUtilities.playerHandler(this, options.player);
    this.paths = new PlanetUtilities.pathHandler(this);
    this.mouse = new PlanetUtilities.mouseHandler(this);
    this.waypoints = new PlanetUtilities.waypointHandler({ planet: this });
    this.uiHandler = new PlanetUtilities.planetUIHandler({ planet: this });

    this.imageName = options.imageName;
    this.image = null;


    this.id = options.id;

    // Has certain strengths/weaknesses in production
    this.type = options.type;

    // Limits maximum population size
    this.size = options.size;
}

Planet.prototype.update = function (dt, player, doProduction, productionPercentAvailable) {
    this.population.update(dt, doProduction);
    this.production.update(dt, doProduction, productionPercentAvailable);
}

Planet.prototype.draw = function (ctx, showDiscoverPaths) {

    /*
        We only draw if the planet is in the activePlayers list of planets. Later we'll do a check to see if it's in the 
        range of the player based on exploration stats...etc... which will make it slightly different color and 
        information will not be up to date. 
    */

        var x = this.location.x - this.radius;
        var y = this.location.y - this.radius;


        // Collision rect    
        //ctx.beginPath();
        //ctx.rect(x, y, this.diameter, this.diameter);
        //ctx.fillStyle = 'yellow';
        //ctx.fill();


        this.image = this.image == null ? ge.Assets.images[this.imageName] : this.image;

        ctx.drawImage(this.image, x, y, this.diameter, this.diameter);// , this.diameter, this.diameter);

        //ctx.fillStyle = 'red';
        //ctx.font = "bold 16px sans-serif";
        //ctx.fillText(this.id, this.location.x, this.location.y);

        if (this.player.owner !== null) {
            if (this.mouse.isOver) {
                ctx.fillStyle = 'yellow';
            } else {
                ctx.fillStyle = 'red';
            }
            ctx.font = "bold 16px sans-serif";
            ctx.fillText("P " + this.player.owner.id + " - ID " + this.id + " (" + this.location.x + "," + this.location.y + ")", x, y + this.diameter + 10);

        }

        this.uiHandler.draw(ctx, showDiscoverPaths);
}



var PlanetUtilities = {

    infrastructureHandler: function(planet){
        var self = this;
        this.planet = planet;

        this.config = infrastructureConfig;

        this.level = 0;
        this.points = 0;

        this.levelCache = [0];

        this.nextLevelPointsRequired = this.config.thresholdStart;
        this.prevLevelPointsRequired = 0;

        this.update = function (production) {

            self.points += production;

            // we're going up a level
            if (self.nextLevelPointsRequired < self.points) {
                self.level++;
                self.prevLevelPointsRequired = this.nextLevelPointsRequired;

                // add it to levelCache if it's not already there
                if (self.levelCache[self.level] == undefined) {
                    self.levelCache[self.level] = self.nextLevelPointsRequired + self.nextLevelPointsRequired * self.config.levelIncrement;
                    self.nextLevelPointsRequired = Math.floor(self.levelCache[self.level]);
                }

                // set the next level requirement from the cache
                else {
                    self.nextLevelPointsRequired = self.levelCache[self.level];
                }

                console.log("Increased Level: " + self.level + " ( Next Level At - " + self.nextLevelPointsRequired + ")");
            }
        }

    },

    productionHandler: function (planet) {

        var self = this;
        this.planet = planet;
        this.shipBuildingAllocation = 50; // the other percent goes to infrastructure while we only have two options... for now

        this.lastAvailableProduction = 0;

        this.shipFactory = {
            shipTemplate: null,
            currentShipProduction: null,
            currentShipCost : null,

            setShip: function (ship) {
                this.shipTemplate = ship;
                this.currentShipProduction = 0;
                this.currentShipCost = ship.cost;
            },

            shipCompleted: function(){
                return this.currentShipCost < this.currentShipProduction;
            },

            newShip: function (ship) {
                this.shipTemplate = ship;

                if (ship != null) {
                    this.setShip(this.shipTemplate);
                }
            }
        }


        this.update = function (dt, doProduction, productionPercentAvailable) {

            var player = this.planet.player.owner;

            if (doProduction && player != null) {
                var BaseEnergy = self.calculateRaw() * (productionPercentAvailable/100);
                var ResourceAllocation = player.resources.resourceAllocation;

                this.lastAvailableProduction = BaseEnergy;

                var productionAvailable = Math.floor((BaseEnergy * ResourceAllocation.production / 100));

                // put production towards ships/infrastructure (NEED TO FIGURE OUT HOW MUCH TO EACH)
                if (this.shipFactory.shipTemplate != null) {

                    

                    var shipProductionAvailable = productionAvailable * (self.shipBuildingAllocation / 100);
                    var infrastructureProduction = productionAvailable - shipProductionAvailable;

                    this.shipFactory.currentShipProduction += shipProductionAvailable;

                    if (player == Game.activePlayer) {
                        console.log("Planet " + this.planet.id + " : Producing Ship - " + this.shipFactory.currentShipProduction + " ( " + shipProductionAvailable + ")");
                    }
                    

                    if (this.shipFactory.shipCompleted()) {

                        if (player == Game.activePlayer) {
                            console.log("Planet " + this.planet.id + " : SHIP COMPLETED");
                        }

                        player.ships.addShip(new Ship({
                            shipTemplate: this.shipFactory.shipTemplate,
                            player: this.planet.player.owner,
                            locationObject: this.planet,
                            cost: this.shipFactory.currentShipCost
                        }));
                        
                        this.shipFactory.shipTemplate = null;
                        this.shipFactory.currentShipProduction = 0;
                    }

                    // Remaining production goes to infrastructure
                    self.planet.infrastructure.update(infrastructureProduction);
                }
                else {
                    // All production resources goes to infrastructure
                    self.planet.infrastructure.update(productionAvailable);

                    // See if any ships can be built from this planet
                    self.shipFactory.newShip(player.ships.getShipToBuild(self.planet.infrastructure.level));
                    //console.log("Searched for new ship");
                }

                player.science.produceScience(Math.floor((BaseEnergy * ResourceAllocation.science / 100)));

                // put culture towards culture
                player.stats.Culture += Math.floor((BaseEnergy * ResourceAllocation.culture / 100) * dt);

            }

            

        }

        this.calculateRaw = function () {
            var player = this.planet.player.owner;
            var maxProduction = 0;

            switch (self.planet.size) {
                case "big":
                    maxProduction = 100;
                    break;
                case "medium":
                    maxProduction = 75;
                    break;
                case "small":
                    maxProduction = 50;
                    break;
            }

            var baseProduction = maxProduction * (self.planet.population.value/100);

            // Do other modifiers here
            baseProduction -= player.planets.getProductionCost(this.planet); // deduct any current costs against baseEnergy

            return baseProduction;

        }
    },

    populationHandler : function(planet, options){

        var self = this;
        this.planet = planet;
        this.value = options.initialPopulation;
        this.incrementCache = null;
        this.initialIncrement = .0025; // this will need to come from some sort of planet setup based on planet type
        this.increment = this.initialIncrement;

        this.update = function (dt, player, doProduction) {

            if (doProduction) {

                var initialIncrement = self.increment;
                var currentPopulation = self.value;

                var increment = initialIncrement;

                // Player Bonuses
                if (player.stats.percentageBonuses.populationGrowthRateBonus.cachedValue > 0) {
                    increment = increment + increment * (player.stats.percentageBonuses.populationGrowthRateBonus.cachedValue/100);
                }


                self.value = currentPopulation + increment;
                

                if (self.value > 100) {
                    self.value = 100;
                }

                self.incrementCache = increment;

            }
            

        }

    },

    playerHandler : function(planet, options){

        var self = this;
        var planet = planet;

        this.owner = null;

        this.setOwner = function (player) {
            self.owner = player;
        }
    },

    pathHandler : function(planet){
        var self = this;
        this.pathsArray = [];
        this.planet = planet;

        this.hasPath = function (path) {

            var result = false;

            for (var i = 0; i < self.pathsArray.length; i++) {

                if (self.pathsArray[i].planet1 == path.planet1 && self.pathsArray[i].planet2 == path.planet2 ||
                    self.pathsArray[i].planet1 == path.planet2 && self.pathsArray[i].planet2 == path.planet1) {

                    result = true;
                    break;
                }
            }

            return result;
        }



    },

    mouseHandler: function (planet) {

        this.isOver = false;

        this.checkOver = function (x, y, clickEvent, mouseDownEvent) {

            var resultClicked = false;

            // check other UI elements otherwise check planet itself
            if (!planet.uiHandler.checkMouse(x, y, clickEvent, mouseDownEvent)) {

                var rectx = planet.location.x - planet.radius;
                var recty = planet.location.y - planet.radius;

                
                this.isOver = Game.Utilities.Math.simpleCollision(x,y,rectx,recty,planet.diameter,planet.diameter);

                if (this.isOver && clickEvent) {
                    Game.LayoutManager.InfoBoxUI.setPlanet(planet);
                    resultClicked = true;
                }
            }
            else {
                resultClicked = true;
            }

            return resultClicked;

            
        }

    },

    waypointHandler : function(options){

        var self = this;

        this.planet = options.planet;

        this.waypointArray = [];

        this.add = function (waypoint) {
            self.waypointArray.push(waypoint);
            waypoint.setPlanet(this.planet);
        }

        this.remove = function (waypoint) {

            self.waypointArray.remove(waypoint);
            waypoint.unsetPlanet();

        }

    },

    planetUIHandler: function (options) {
        var self = this;
        var planet = options.planet;
        this.bulbImage = ge.Assets.images["iconBulb"];
        this.unlockPlanetImage = ge.Assets.images["iconUnlock"];
        this.waypointImage = ge.Assets.images["waypoint"];

        this.bulbLoc = { x: planet.location.x + 30, y: planet.location.y - 45 };
        this.unlockPlanetLoc = { x: planet.location.x - planet.diameter / 2, y: planet.location.y - planet.diameter / 2 };

        this.draw = function (ctx, showDiscoverPaths) {

            if (showDiscoverPaths && planet.player.owner == Game.Players[0]) {

                if (planet.production.lastAvailableProduction >= planet.player.owner.stats.getCost("path", "discoverCost")) {
                    ctx.drawImage(this.bulbImage, this.bulbLoc.x, this.bulbLoc.y, this.bulbImage.width * .8, this.bulbImage.height * .8);
                }


            }

            // Draw Waypoints if any
            if (planet.waypoints.waypointArray.length > 0) {
                var waypoints = planet.waypoints.waypointArray;

                for (var i = 0; i < waypoints.length; i++) {

                    var waypointLocX = planet.location.x - planet.diameter;
                    var waypointLocY = planet.location.y - planet.diameter / 2 - i * (this.waypointImage.height * .6 + 10);

                    ctx.drawImage(this.waypointImage, waypointLocX, waypointLocY, this.waypointImage.width * .6, this.waypointImage.height * .6);
                }
            }

        }

        // We'll return whether something was clicked, if that's the case we'll ignore the planet check
        this.checkMouse = function (x, y, clickEvent, mouseDownEvent) {

            var result = false;


            // TODO: Have an "active player", so i can debug other players w/out being the 0 player
            if ((clickEvent || mouseDownEvent) && planet.player.owner == Game.Players[0]) {

                // checkDiscoverPaths is true if all paths are not found
                var checkDiscoverPaths = !planet.player.owner.planets.contains(planet).allPathsFound ; 

                var bulbImageHeight = this.bulbImage.height * .8;
                var bulbImageWidth = this.bulbImage.width * .8;

                // Check Bulb
                var mouseOverBulb = Game.Utilities.Math.simpleCollision(x, y, this.bulbLoc.x, this.bulbLoc.y, bulbImageHeight, bulbImageWidth);

                    //x > this.bulbLoc.x - this.bulbImage.width / 2
                    //&& y > this.bulbLoc.y - this.bulbImage.height / 2
                    //&& x < this.bulbLoc.x - bulbImageWidth / 2 + bulbImageWidth
                    //&& y < this.bulbLoc.y - bulbImageHeight / 2 + bulbImageHeight;

                if (mouseOverBulb && clickEvent && checkDiscoverPaths) {
                    //alert("Bulb Clicked");
                    result = true;
                    Game.activePlayer.paths.discoverPath(planet);
                }

                // Check Waypoints



                if (planet.waypoints.waypointArray.length > 0) {
                    var waypoints = planet.waypoints.waypointArray;

                    var waypointImageHeight = this.bulbImage.height * .6;
                    var waypointImageWidth = this.bulbImage.width * .6;

                    for (var i = 0; i < waypoints.length; i++) {

                        var waypointLocX = planet.location.x - planet.diameter;
                        var waypointLocY = planet.location.y - planet.diameter / 2 - i * (waypointImageHeight + 10);

                        if (Game.Utilities.Math.simpleCollision(x, y, waypointLocX, waypointLocY, waypointImageHeight, waypointImageWidth)) {
                            result = true;

                            if (clickEvent) {
                                console.log('waypoint clicked');
                                waypoints[i].selected();
                            }

                            if (mouseDownEvent) {
                                console.log('waypoint down');
                                waypoints[i].pickUp();
                            }
                        }
                    }
                }
            }

            

            return result;

        }

    }
}