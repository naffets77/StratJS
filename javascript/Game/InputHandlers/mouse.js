
Game.InputHandler.Mouse = {

    location : {x:0,y:0,dx:0,dy:0},

    startCoords : { x: 0, y: 0 },
    last : { x: 0, y: 0 },
    isDown: false,

    pickedUp: null,

    init : function(canvas, ctx){

        var self = this;

        canvas.onmousemove = function (e) {

            var xLoc = e.x - self.startCoords.x - ctx.xLoc;
            var yLoc = e.y - self.startCoords.y - ctx.yLoc;

            self.location.x = e.x;
            self.location.y = e.y;
            self.location.dx = xLoc;
            self.location.dy = yLoc;

            if (self.isDown) {
                //if (xLoc < 200 && yLoc < 200) {
                //    ctx.setTransform(1, 0, 0, 1, xLoc, yLoc);
                //    ctx.xLoc = xLoc;
                //    ctx.yLoc = yLoc;
                //}
            }
            else { // not down we're moving and hovering
                self.MouseMoveUIHandler(xLoc, yLoc);
            }
        };

        canvas.onmousedown = function (e) {

            self.isDown = true;
            //self.startCoords.x = e.pageX - this.offsetLeft - self.last.x;
            //self.startCoords.y = e.pageY - this.offsetTop - self.last.y
            self.MouseDownUIHandler(self.location.dx, self.location.dy);
        };

        canvas.onmouseup = function (e) {

            self.isDown = false;
            //self.last.x = e.x - self.startCoords.x + ctx.xLoc;
            //self.last.y = e.y - self.startCoords.y + ctx.yLoc;

            // We're carrying something, update it that it's no longer being carried
            if (self.pickedUp != null) {
                self.pickedUp.putDown();
                self.pickedUp = null;
            }
            

        };

        canvas.onclick = function (e) {

            self.isDown = false;

            self.MouseClickUIHanlder(self.location.dx, self.location.dy);
        }
    }
}

Game.InputHandler.Mouse.MouseDownUIHandler = function (x, y) {

    if (this.pickedUp != null) {
        return;
    }

    var Player = Game.activePlayer;
    var resultClicked = false;

    // This should prob be pushed into the player object
    for (var i = 0; i < Player.planets.planetArray.length; i++) {
        if (!resultClicked) {
            resultClicked = Player.planets.planetArray[i].checkOver(x, y, false, true);
        }
    }

    if (!resultClicked) {
        for (var i = 0; i < Player.paths.pathArray.length; i++) {
            if (!resultClicked) {
                resultClicked = Player.paths.pathArray[i].checkOver(x, y, false, true);
            }
        }
    }

}

Game.InputHandler.Mouse.MouseClickUIHanlder = function (x, y) {

    if (this.pickedUp != null) {
        return;
    }

    var Player = Game.activePlayer;
    var resultClicked = false;

    // This should prob be pushed into the player object
    for (var i = 0; i < Player.planets.planetArray.length; i++) {
        if (!resultClicked) {
            resultClicked = Player.planets.planetArray[i].checkOver(x, y, true, false);
        }
    }

    if(!resultClicked){
        for (var i = 0; i < Player.paths.pathArray.length; i++) {
            if (!resultClicked) {
                resultClicked = Player.paths.pathArray[i].checkOver(x, y, true, false);
            }
        }
    }

    // Nothing was handled - Do default click on nothing UI
    if (!resultClicked) {
        Game.LayoutManager.InfoBoxUI.showTechnology();
    }

}

Game.InputHandler.Mouse.MouseMoveUIHandler = function (x, y) {
    //console.log("(" + x + "," + y + ")");

    if (this.pickedUp != null) {
        return;
    }
    
    var Player = Game.activePlayer;


    // This should prob be pushed into the player object
    for (var i = 0; i < Player.planets.planetArray.length; i++) {
        Player.planets.planetArray[i].checkOver(x, y, false, false);
    }

    for (var i = 0; i < Player.planets.planetArray.length; i++) {
        Player.paths.pathArray[i].checkOver(x, y, false, false);
    }

}