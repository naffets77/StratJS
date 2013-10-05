function Path(planet1, planet2, id) {
    
    var self = this;
    
    this.id = id;
    this.planet1 = planet1;
    this.planet2 = planet2;
    this.defaultActive = true;

    this.unlockImage = ge.Assets.images["iconUnlock"];

    this.highlight = false;

    this.startExploring = false;
    this.distanceExplored = 0;
    this.explored = false;

    this.length = Game.Utilities.Math.distance(planet1.location, planet2.location);

    this.mouse = {
        isOver: false,
        checkOver: function (x, y, ClickEvent, pathHandler) {

            if (!pathHandler.explored) {

                if (Game.Utilities.Math.lineIntersect(self.planet1.location.x, self.planet1.location.y, self.planet2.location.x, self.planet2.location.y, x, y, x + 1, y + 1)) {
                    self.setOver();
                }

                var midpoint_x = Game.Utilities.Math.pointBetweenLine(self.planet1.location.x, self.planet2.location.x, .8);
                var midpoint_y = Game.Utilities.Math.pointBetweenLine(self.planet1.location.y, self.planet2.location.y, .8);

                var mouseOverLock = x > midpoint_x - self.unlockImage.width / 2 && y > midpoint_y - self.unlockImage.height / 2 && x < midpoint_x - self.unlockImage.width / 2 + self.unlockImage.width && y < midpoint_y - self.unlockImage.height / 2 + self.unlockImage.height;



                console.log("checking path for " + self.id + " : (" + midpoint_x + ", " + midpoint_y + ") - " + mouseOverLock);



                // need to check for collision and click event on the unlock icon
                if (ClickEvent && mouseOverLock) {
                    console.log("Exploring started");
                    //self.startExploring = true;
                    pathHandler.explore();
                }
            }

        }
    }
}

Path.prototype.draw = function (ctx, isExplored, isBeingExplored, distanceExplored) {

    //if (this.active) {

        var midpoint_x = Game.Utilities.Math.pointBetweenLine(this.planet1.location.x, this.planet2.location.x, .8);
        var midpoint_y = Game.Utilities.Math.pointBetweenLine(this.planet1.location.y, this.planet2.location.y, .8);


        ctx.beginPath();
        ctx.moveTo(this.planet1.location.x, this.planet1.location.y);
        ctx.lineTo(this.planet2.location.x, this.planet2.location.y);
        ctx.lineWidth = 6;


        
        ctx.strokeStyle = isExplored ? '#efefef' : '#999';

        if (this.highlight && !isExplored && !isBeingExplored) {
            ctx.strokeStyle = '#efefef';
            ctx.lineWidth = 10;
            ctx.stroke();

            ctx.drawImage(this.unlockImage, midpoint_x - this.unlockImage.width / 2, midpoint_y - this.unlockImage.height / 2, this.unlockImage.width, this.unlockImage.height);

        }
        else {
            ctx.stroke();
        }


        // This will show the animcation of exploring
        if (isBeingExplored) {
            ctx.beginPath();
            ctx.moveTo(this.planet1.location.x, this.planet1.location.y);
            ctx.lineTo(
                Game.Utilities.Math.pointBetweenLine(this.planet1.location.x, this.planet2.location.x, distanceExplored / this.length),
                Game.Utilities.Math.pointBetweenLine(this.planet1.location.y, this.planet2.location.y, distanceExplored / this.length)
            );
            ctx.lineWidth = 6;
            ctx.strokeStyle = 'yellow';
            ctx.stroke();
        }


        // Debug id
        ctx.fillStyle = 'orange';
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(this.id, midpoint_x, midpoint_y);

    //}

}

Path.prototype.update = function (dt) {

    if ((this.planet1.mouse.isOver || this.planet2.mouse.isOver)) {
        this.setOver();
    }

    var exploreRate = .05; // .05 pixels a millisecond
    if (this.startExploring) {
        //console.log("Explored: " + this.distanceExplored + " of " + this.length + " (" + this.distanceExplored / this.length + ")");
        this.distanceExplored += exploreRate * dt;
    }

    if (this.startExploring && this.distanceExplored > this.length) {
        this.startExploring = false;
        this.explored = true;
        
        
        this.planet1.player.owner.planets.set(this.planet2);

    }

}

// Helpers
Path.prototype.setOver = function () {
    var self = this;
    if (this.highlight == false) {
        this.highlight = true;
        setTimeout(function () { self.highlight = false; }, 3000);
    }
}

Path.prototype.getOppositePlanet = function (planet) {
    return this.planet1.id == planet.id ? this.planet2 : this.planet1;
}