

function Planet(options) {

    this.diameter = 80;

    this.production = new PlanetUtilities.productionHandler(this);
    this.population = new PlanetUtilities.populationHandler(this, options.population);
    this.player = new PlanetUtilities.playerHandler(this, options.player);
    this.paths = new PlanetUtilities.pathHandler(this);
    this.mouse = new PlanetUtilities.mouseHandler(this);

    this.imageName = options.imageName;
    this.image = null;


    this.id = options.id;

    // x,y location 
    this.location = options.location;

    // Has certain strengths/weaknesses in production
    this.type = options.type;

    // Limits maximum popuplation size
    this.size = options.size;
}

Planet.prototype.update = function (dt, player, doProduction) {
    this.population.update(dt, player, doProduction);
    this.production.update(dt, player, doProduction);
    

}

Planet.prototype.draw = function (ctx) {

    /*
        We only draw if the planet is in the activePlayers list of planets. Later we'll do a check to see if it's in the 
        range of the player based on exploration stats...etc... which will make it slightly different color and 
        information will not be up to date. 
    */

    //var player = Game.activePlayer;

    //if ($.inArray(this, player.planets.planetArray) != -1) {

    var x = this.location.x - this.diameter / 2;
    var y = this.location.y - this.diameter / 2;

    /*
        var radius = 25;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    */

        // Collision rect    
        //ctx.beginPath();
        //ctx.rect(x, y, this.diameter, this.diameter);
        //ctx.fillStyle = 'yellow';
        //ctx.fill();


        this.image = this.image == null ? ge.Assets.images[this.imageName] : this.image;

        ctx.drawImage(this.image, x , y , this.diameter, this.diameter);

        //ctx.fillStyle = 'red';
        //ctx.font = "bold 16px sans-serif";
        //ctx.fillText(this.id, this.location.x, this.location.y);


        if (this.player.owner != null) {
            if (this.mouse.isOver) {
                ctx.fillStyle = 'yellow';
            } else {
                ctx.fillStyle = 'red';
            }
            ctx.font = "bold 16px sans-serif";
            ctx.fillText("Player " + this.player.owner.id + "(" + this.location.x + "," + this.location.y + ")", x, y + this.diameter+10);
        }
    //}

}



var PlanetUtilities = {

    productionHandler: function (planet) {

        var self = this;
        this.planet = planet;
        this.shipFactory = {
            shipTemplate: null,
            currentShipProduction: null,

            setShip: function (ship) {
                this.shipTemplate = ship;
                this.currentShipProduction = 0;
            },

            shipCompleted: function(){
                return this.shipTemplate.cost < this.currentShipProduction;
            },

            newShip: function () {
                this.setShip(this.shipTemplate);
            }
        }


        this.update = function (dt, player, doProduction) {

            if (doProduction) {
                var BaseEnergy = self.calculateRaw();
                var ResourceAllocation = player.resources.resourceAllocation;

                // put production towards ships/infrastructure (NEED TO FIGURE OUT HOW MUCH TO EACH)
                if (this.shipFactory.currentShipProduction != null) {
                    this.shipFactory.currentShipProduction += Math.floor((BaseEnergy * ResourceAllocation.production / 100) * dt)

                    if (this.shipFactory.shipCompleted()) {
                        this.planet.player.owner.ships.addShip(new Ship({
                            shipTemplate: this.shipFactory.shipTemplate,
                            player: this.planet.player.owner,
                            locationObject: this.planet
                        }));
                        this.shipFactory.newShip();
                    }

                }

                // put research towards beakers
                player.stats.ScienceEnergy += Math.floor((BaseEnergy * ResourceAllocation.science / 100) * dt);

                // put culture towards culture
                player.stats.Culture += Math.floor((BaseEnergy * ResourceAllocation.culture / 100) * dt);

            }

            

        }
        this.calculateRaw = function () {
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

            return baseProduction;
        }
    },

    populationHandler : function(planet, options){

        var self = this;
        this.planet = planet;
        this.value = options.initialPopulation;

        this.update = function (dt, player, doProduction) {

            // increment population

        }

    },

    playerHandler : function(planet, options){

        var self = this;
        var planet = planet;

        this.owner = null;

        this.setOwner = function (player) {
            self.owner = player;
            planet.production.shipFactory.setShip(player.ships.shipTemplates.fighter.small);
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

        this.checkOver = function (x,y, clickEvent) {


            var rectx = planet.location.x - planet.diameter / 2;
            var recty = planet.location.y - planet.diameter / 2;

            if (x > rectx && y > recty && x < rectx + planet.diameter && y < recty + planet.diameter) {
                this.isOver = true;
            }
            else {
                this.isOver = false;
            }

            if (this.isOver && clickEvent) {
                alert("clicked");
            }
        }

    }
}