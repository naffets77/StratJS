function Waypoint(options) {

    this.player = options.player;
    this.id = options.id;
    this.waypointImage = ge.Assets.images["waypoint"];

    // It's in-game physical x,y position when drawn
    this.location = options.location;

    // Whether or not it's placed on the game (vs in the waypoint holder UI) - NO MORE UI THIS CAN PROBABLY BE REMOVED
    this.active = false;

    // Where It is when idle - It has to be on a planet or a path
    this.planet = null;
    this.path = null;

    // Travel Helpers
    this.targetPlanet = null;
    this.allTravelPlanets = [];
    this.currentTravelPlanets = [];
    this.currentTravelPath = null;
    this.lastPlanet = null;
    this.nextPlanet = null;
    this.distanceTraveledOnPath = null;
    



    // % of ships allocated
    this.allocation = {


    }

    this.ships = [];
    this.power = 0;

    this.incomingShips = [];
    this.commander = null;

    this.pickedUp = false;
    this.idle = true;
}

Waypoint.prototype.update = function (dt) {

    // we're doing something!
    if (this.idle == false) {

        // we need to figure out what path to start traveling on
        if (this.currentTravelPath == null) {

            var nextPlanet = this.currentTravelPlanets.pop();

            // We were on a planet
            if (this.lastPlanet != null) {
                this.currentTravelPath = Game.Utilities.GameObject.getPathBetweenPlanets(this.player, this.lastPlanet, nextPlanet);

                // set location to edge of planet and path
                // Get diameter of current planet, and get point between path and planet at that location


                // Might want to build this into the path object in case there are other variables to consider that are path specific
                this.location.x = this.lastPlanet.location.x; //Game.Utilities.Math.pointBetweenLine(this.lastPlanet.location.x, nextPlanet.location.x, radius / this.currentTravelPath.length),
                this.location.y = this.lastPlanet.location.y; //Game.Utilities.Math.pointBetweenLine(this.lastPlanet.location.y, nextPlanet.location.y, radius / this.currentTravelPath.length)

                this.distanceTraveledOnPath = 0;
                this.nextPlanet = nextPlanet;
            }
            
            // We are on a Path
            else if (this.path != null) {
                alert("Not handling waypoints traveling from paths yet");
            }
            

        }
        // we're on a path calculate next location position
        else {

            var speed = .15;
            this.distanceTraveledOnPath += speed * dt;

            // if we've reached the next planet
            if (this.distanceTraveledOnPath > this.currentTravelPath.length) {

                // check if we're at our destination
                if (this.nextPlanet == this.targetPlanet) {
                    this.idle = true;
                    this.targetPlanet.waypoints.add(this);
                }
                // reset with next planet
                else {
                    this.lastPlanet = this.nextPlanet;
                    this.currentTravelPath = null;
                }


            }

            // else continue
            else {
                
                this.location.x = Game.Utilities.Math.pointBetweenLine(this.lastPlanet.location.x, this.nextPlanet.location.x, this.distanceTraveledOnPath / this.currentTravelPath.length),
                this.location.y = Game.Utilities.Math.pointBetweenLine(this.lastPlanet.location.y, this.nextPlanet.location.y, this.distanceTraveledOnPath / this.currentTravelPath.length)

            }
        }


    }


}

Waypoint.prototype.draw = function (ctx) {
    //console.log("drawing waypoint");
    if (this.pickedUp == true) {
        
        // Draw the boxes around the planets

        var planets = this.player.planets.planetArray;

        for (var i = 0; i < planets.length; i++) {


            var planet = planets[i].planet;

            if (this.planet.id != planet.id) {
                ctx.beginPath();
                ctx.rect(planet.location.x - planet.diameter, planet.location.y - planet.diameter, planet.diameter * 2, planet.diameter * 2);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#efefef';
                ctx.stroke();
            }
        }

        // Draw the waypoint on the mouse cursor
        ctx.drawImage(this.waypointImage, Game.InputHandler.Mouse.location.dx, Game.InputHandler.Mouse.location.dy, this.waypointImage.width, this.waypointImage.height);
    }

    // need to handle drawing waypoint, no longer responsibility of planet or path
    if (this.idle == false) {
        ctx.drawImage(this.waypointImage, this.location.x, this.location.y, this.waypointImage.width * .4, this.waypointImage.height * .4);
        Game.Utilities.Canvas.drawLine(ctx, this.location.x, this.location.y, this.targetPlanet.location.x, this.targetPlanet.location.y);

    }

}


Waypoint.prototype.setPlanet = function (planet) {
    this.planet = planet;
}

Waypoint.prototype.setTargetPlanet = function (planet) {
    this.targetPlanet = planet;
    this.allTravelPlanets = [];
    this.currentTravelPath = null;

    // get paths to planet
    var pathNodeArray = Game.Utilities.GameObject.getPlanetsToTravel(this.player, this.lastPlanet, this.targetPlanet);

    // should sort these by length first!

    for (var i = 0; i < pathNodeArray.length; i++) {
        this.allTravelPlanets.push(pathNodeArray[i].planetList.reverse())
    }

    this.currentTravelPlanets = this.allTravelPlanets[0];
    this.idle = false;

}

Waypoint.prototype.unsetPlanet = function () {
    this.lastPlanet = this.planet;
    this.planet = null;
}

Waypoint.prototype.addIncomingShip = function (ship) {
    this.incomingShips.push(ship);
}

Waypoint.prototype.selected = function () {
    Game.LayoutManager.InfoBoxUI.setWaypoint(this);
}

Waypoint.prototype.pickUp = function () {
    this.pickedUp = true;
    Game.InputHandler.Mouse.pickedUp = this;
}

Waypoint.prototype.putDown = function () {
    this.pickedUp = false;

    // Check if we're on a planet, otherwise nothing happens!

    var mouseX = Game.InputHandler.Mouse.location.dx;
    var mouseY = Game.InputHandler.Mouse.location.dy;
    var planets = this.player.planets.planetArray;

    for (var i = 0; i < planets.length; i++) {


        var planet = planets[i].planet;
        if (this.planet.id != planet.id) {

            if (Game.Utilities.Math.simpleCollision(mouseX, mouseY,
                planet.location.x - planet.diameter, planet.location.y - planet.diameter, planet.diameter * 2, planet.diameter * 2)) {
                this.planet.waypoints.remove(this);
                this.setTargetPlanet(planet);
                
                break;
                
            }

        }
    }

}



