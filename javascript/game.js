


Game.init = function (options) {

    var self = this;

    this.canvas = options.canvas;
    this.ctx = options.ctx;

    this.ctx.xLoc = 0;
    this.ctx.yLoc = 0;


    this.InputHandler.Mouse.init(this.canvas, this.ctx);
    this.InputHandler.Keyboard.init(this);

    // Game Inits, these need to be handled by some kind of state manager/game manager etc...


    this.Players.push(new Player({
        id: 0,
        shipConfig: shipConfig
    }));
    this.Players.push(new Player({
        id: 1,
        ai: true,
        shipConfig: shipConfig
    }));



    //this.Paths.push(new Path(this.Planets[0], this.Planets[1]));
  
    //this.Planets[0].paths.pathsArray.push(this.Paths[0]);
    //this.Planets[1].paths.pathsArray.push(this.Paths[0]);

    this.Utilities.Management.buildMap(this);

    this.activePlayer = this.Players[0];

    this.Players[0].planets.set(this.Planets[0]);
    this.Players[1].planets.set(this.Planets[this.Planets.length - 1]);

    options.start();



    

}






Game.update = function (dt) {
    // put here your update computations, relative to dt	
    // dt is time passed in the game


    this.gameTime += dt;

    var players = Game.Players;

    var sendGameTic = Game.Utilities.Management.sendTic(Game);

    for (var i = 0; i < players.length; i++) {
        players[i].update(dt, sendGameTic);
    }

    lm.update(dt);

};



//var mouse = { x: 0, y: 0 }; //make an object to hold mouse position

Game.draw = function (ctx) {
    // ...
    //canvas.width = canvas.width;
    
    // Store the current transformation matrix
    ctx.save();

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);

    // Restore the transform
    ctx.restore();




    ctx.beginPath();
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    //ctx.fillRect(0, 0, canvas.width, canvas.height); //fill the background. color is default black
    //ctx.arc(mouse.x, mouse.y, 250, 0, 6.28, false);//draw the circle
    ctx.restore();
    ctx.save();
    ctx.clip();//call the clip method so the next render is clipped in last path
    //ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
    ctx.closePath();
    ctx.restore();

    ctx.beginPath();
    ctx.rect(0, 0, 2000, 2200);
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#666';
    ctx.stroke();


    /* Lets do these from the player 

    for (var i = 0; i < Game.Paths.length; i++) {
        Game.Paths[i].draw(ctx);
    }

    for (var i = 0; i < Game.Planets.length; i++) {
        Game.Planets[i].draw(ctx);
    }
    */


    Game.activePlayer.draw(ctx);


};




$(document).on('ready', function () {

    
    var canvas = document.getElementById("game-canvas");
    var ctx = canvas.getContext("2d");

    
    canvas.width = document.body.clientWidth; 
    canvas.height = document.body.clientHeight;




    // This should be handled a little more robustly. What if i don't have any assets??
    ge.Assets.loadImages({
        planet5: 'Images/Planets/planetrender_5.png',
        iconUnlock: 'Images/Icons/unlocksmall.png'
    }, function () {

        Game.init({
            canvas: canvas,
            ctx: ctx,
            start: function () {
                // Starts the Loop
                var GameLoop = new ge.GameLoop(ctx, Game.update, Game.draw);
                GameLoop.gameRun();
            }
        });


    });


});


// We'll eventually have a input js file to take care of this stuff

function mouseEvents(ctx) {

    
    var startCoords = { x: 0, y: 0 };
    var last = { x: 0, y: 0 };
    var isDown = false;

    canvas.onmousemove = function (e) {

        var xVal = e.pageX - this.offsetLeft,
            yVal = e.pageY - this.offsetTop;
        mouse = {
            x: e.pageX,
            y: e.pageY
        };

        xLoc = xVal - startCoords.x;
        yLoc = yVal - startCoords.y;



        if (isDown) {
            if (xLoc < 200 && yLoc < 200) {
                ctx.setTransform(1, 0, 0, 1, xLoc, yLoc);
            }
        }
    };

    canvas.onmousedown = function (e) {

        isDown = true;
        startCoords = {
            x: e.pageX - this.offsetLeft - last.x,
            y: e.pageY - this.offsetTop - last.y
        };
    };

    canvas.onmouseup = function (e) {

        isDown = false;
        last = {
            x: e.pageX - this.offsetLeft - startCoords.x,
            y: e.pageY - this.offsetTop - startCoords.y
        };
    };


}





