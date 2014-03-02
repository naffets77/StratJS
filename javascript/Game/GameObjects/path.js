function Path(planet1, planet2, id) {
    
    var self = this;
    
    this.id = id;
    this.planet1 = planet1;
    this.planet2 = planet2;
    this.defaultActive = true;

    this.unlockImage = ge.Assets.images["iconUnlock"];

    this.highlight = false;

    this.length = Game.Utilities.Math.distance(planet1.location, planet2.location);

    this.mouse = {
        isOver: false,
        checkOver: function (x, y, ClickEvent, pathHandler) {

            var player = pathHandler.planet.player.owner;
            var resultClicked = false;

            if (!pathHandler.explored) {

                if (Game.Utilities.Math.lineIntersect(self.planet1.location.x, self.planet1.location.y, self.planet2.location.x, self.planet2.location.y, x, y, x + 1, y + 1)) {
                    self.setOver();
                }

                var midpoint_x = Game.Utilities.Math.pointBetweenLine(self.planet1.location.x, self.planet2.location.x, .5);
                var midpoint_y = Game.Utilities.Math.pointBetweenLine(self.planet1.location.y, self.planet2.location.y, .5);

                //var mouseOverLock = x > midpoint_x - self.unlockImage.width / 2 && y > midpoint_y - self.unlockImage.height / 2 && x < midpoint_x - self.unlockImage.width / 2 + self.unlockImage.width && y < midpoint_y - self.unlockImage.height / 2 + self.unlockImage.height;

                
                var mouseOverLock = Game.Utilities.Math.simpleCollision(x, y, midpoint_x - self.unlockImage.width / 2, midpoint_y - self.unlockImage.height / 2, self.unlockImage.height, self.unlockImage.width);


                //console.log("checking path for " + self.id + " : (" + midpoint_x + ", " + midpoint_y + ") - " + mouseOverLock);

                //if (mouseOverLock) {
                //    console.log('over: ' + x + "," + y + " vs " + midpoint_x + "," + midpoint_y);
                //}

                // need to check for collision and click event on the unlock icon
                if (ClickEvent && mouseOverLock) {
                    console.log("Exploring started");
                    //self.startExploring = true;

                    pathHandler.explore();

                    resultClicked = true;
                }
            }

            return resultClicked;

        }
    }
}

Path.prototype.draw = function (ctx, unlockable, isExplored, isBeingExplored, distanceExplored) {


        var midpoint_x = Game.Utilities.Math.pointBetweenLine(this.planet1.location.x, this.planet2.location.x, .5);
        var midpoint_y = Game.Utilities.Math.pointBetweenLine(this.planet1.location.y, this.planet2.location.y, .5);


        ctx.save();

        ctx.beginPath();
        ctx.moveTo(this.planet1.location.x, this.planet1.location.y);
        ctx.lineTo(this.planet2.location.x, this.planet2.location.y);
        ctx.lineWidth = 6;

        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgb(200, 200, 200)';

        
        ctx.strokeStyle = isExplored ? '#efefef' : '#999';

        if (this.highlight && !isExplored && !isBeingExplored) {
            ctx.strokeStyle = '#efefef';
            ctx.lineWidth = 10;
            ctx.stroke();

            if (unlockable) {
                ctx.drawImage(this.unlockImage, midpoint_x - this.unlockImage.width / 2, midpoint_y - this.unlockImage.height / 2, this.unlockImage.width, this.unlockImage.height);
            }
            //ctx.strokeStyle = '#ffffff';
            //ctx.lineWidth = 1;
            //ctx.rect(midpoint_x - this.unlockImage.width / 2, midpoint_y - this.unlockImage.height / 2, this.unlockImage.width, this.unlockImage.height);
            //ctx.stroke();

        }
        else {
            ctx.stroke();
        }


        // This will show the animation of exploring
        if (isBeingExplored) {
            ctx.beginPath();
            ctx.moveTo(this.planet1.location.x, this.planet1.location.y);
            ctx.lineTo(
                Game.Utilities.Math.pointBetweenLine(this.planet1.location.x, this.planet2.location.x, distanceExplored / this.length),
                Game.Utilities.Math.pointBetweenLine(this.planet1.location.y, this.planet2.location.y, distanceExplored / this.length)
            );
            //console.log("Exploring Path " + this.id + "(" + distanceExplored + "): " + Game.Utilities.Math.pointBetweenLine(this.planet1.location.x, this.planet2.location.x, distanceExplored / this.length) + " and " + Game.Utilities.Math.pointBetweenLine(this.planet1.location.y, this.planet2.location.y, distanceExplored / this.length));
            ctx.lineWidth = 6;
            ctx.strokeStyle = 'yellow';
            ctx.stroke();
        }


        // Debug id
        //ctx.fillStyle = 'orange';
        //ctx.font = "bold 16px sans-serif";
        //ctx.fillText(this.id, midpoint_x, midpoint_y);


        ctx.restore();

}

Path.prototype.update = function (dt) {

    if ((this.planet1.mouse.isOver || this.planet2.mouse.isOver)) {
        this.setOver();
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

Path.prototype.hasPlanet = function (planet) {
    return this.planet1 == planet || this.planet2 == planet ;
}

// Make sure that the planet 1 is the new planet, and planet 2 is the non-explored other planet
Path.prototype.fixForOwner = function (primaryPlanet) {
    if (primaryPlanet != this.planet1) {
        this.planet2 = this.planet1;
        this.planet1 = primaryPlanet;
    }
}