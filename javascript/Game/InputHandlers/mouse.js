
Game.InputHandler.Mouse = {

    location : {x:0,y:0,dx:0,dy:0},

    startCoords : { x: 0, y: 0 },
    last : { x: 0, y: 0 },
    isDown : false,

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
                if (xLoc < 200 && yLoc < 200) {
                    ctx.setTransform(1, 0, 0, 1, xLoc, yLoc);
                    ctx.xLoc = xLoc;
                    ctx.yLoc = yLoc;
                }
            }
            else { // not down we're moving and hovering
                self.MouseMoveUIHandler(xLoc, yLoc);
            }
        };

        canvas.onmousedown = function (e) {

            self.isDown = true;
            //self.startCoords.x = e.pageX - this.offsetLeft - self.last.x;
            //self.startCoords.y = e.pageY - this.offsetTop - self.last.y
        };

        canvas.onmouseup = function (e) {

            self.isDown = false;
            //self.last.x = e.x - self.startCoords.x + ctx.xLoc;
            //self.last.y = e.y - self.startCoords.y + ctx.yLoc;

            self.MouseClickUIHanlder(self.location.dx, self.location.dy);

        };
    }
}

Game.InputHandler.Mouse.MouseClickUIHanlder = function (x, y) {

    var Player = Game.activePlayer;

    // This should prob be pushed into the player object
    for (var i = 0; i < Player.planets.planetArray.length; i++) {
        Player.planets.planetArray[i].mouse.checkOver(x, y, true);
    }

    for (var i = 0; i < Player.planets.planetArray.length; i++) {
        Player.paths.pathArray[i].mouse.checkOver(x, y, true);
    }

}

Game.InputHandler.Mouse.MouseMoveUIHandler = function (x, y) {
    //console.log("(" + x + "," + y + ")");


    
    var Player = Game.activePlayer;


    // This should prob be pushed into the player object
    for (var i = 0; i < Player.planets.planetArray.length; i++) {
        Player.planets.planetArray[i].mouse.checkOver(x, y);
    }

    for (var i = 0; i < Player.planets.planetArray.length; i++) {
        Player.paths.pathArray[i].mouse.checkOver(x, y);
    }

}