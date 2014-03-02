


Game.init = function (options) {

    var self = this;

    this.canvas = options.canvas;
    this.ctx = options.ctx;

    this.fogCanvas = options.fogCanvas;
    this.fogctx = options.fogctx;

    this.ctx.xLoc = 0;
    this.ctx.yLoc = 0;
    this.fogctx.yLoc = 0;
    this.fogctx.xLoc = 0;


    this.InputHandler.Mouse.init(this.fogCanvas, this.ctx);
    this.InputHandler.Keyboard.init(this);

    // attach the layout manager (maybe make this occur by default, so it's not ever detached?)
    this.LayoutManager = lm;

    // Game Inits, these need to be handled by some kind of state manager/game manager etc...

    var Player1 = new Player({
        id: 0,
        shipConfig: shipConfig,
        technologyUpgradesConfig: technologyConfig,
        technologyBonusConfig: technologyBonusesConfig
    });

    var Player2 = new Player({
        id: 1,
        ai: true,
        shipConfig: shipConfig,
        technologyUpgradesConfig: technologyConfig,
        technologyBonusConfig: technologyBonusesConfig
    });




    // This will be more automated once races are defined
    Player1.stats.registerStatusBonus({
        name: "shipUpkeepPercentage",
        value: "1",
        source: "Racial",
    });
    Player2.stats.registerStatusBonus({
        name: "shipUpkeepPercentage",
        value: "1",
        source: "Racial",
    });

    this.Players.push(Player1);
    this.Players.push(Player2);


    // Builds Map
    this.Utilities.Management.buildMap(this);

    // Set Active Player For Easier Debugging
    this.activePlayer = this.Players[0];

    // Setup Initial Planets
    this.Planets[0].population.value = 75;
    this.Players[0].planets.add(this.Planets[0]);
    this.Planets[0].player.setOwner(this.Players[0]);

    this.Planets[this.Planets.length - 1].population.value = 75;
    this.Players[1].planets.add(this.Planets[this.Planets.length - 1]);
    this.Planets[this.Planets.length - 1].player.setOwner(this.Players[1]);



    // Setup Initial Waypoints

    this.Players[0].waypoints.add();
    this.Players[1].waypoints.add();


    // Set waypoint onto first planet for user player
    Game.activePlayer.planets.planetArray[0].planet.waypoints.add(this.Players[0].waypoints.getById(1));


    // Set the player that the layout manager will display values for
    this.LayoutManager.setPlayer(this.activePlayer);
    this.InputHandler.Mouse.setPlayer(this.activePlayer);


    Game.AIManagers.push(new AIManager({
        aiConfig: null,
        player: Player2
    }));

    options.start();

}






Game.update = function (dt) {
    // put here your update computations, relative to dt	
    // dt is time passed in the game

    Game.gameTime += dt;
    

    var players = Game.Players;

    var sendGameTic = Game.Utilities.Management.sendTic(Game);

    // sendGameTic is what pushes the game forward, because we don't do everything every dt
    for (var i = 0; i < players.length; i++) {
        players[i].update(dt, sendGameTic);
    }

    for (var i = 0; i < Game.AIManagers.length; i++) {
        Game.AIManagers[i].update(dt);
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
    ctx.rect(0, 0, 2000, 2200);
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#666';
    ctx.stroke();


    Game.activePlayer.draw(ctx);

    // Draw Everything
    if (Game.AIDebug == true) {

        for (var i = 0; i < Game.Players.length; i++) {

            var player = Game.Players[i];

            for (var j = 0; j < player.paths.pathArray.length; j++) {
                player.paths.pathArray[j].draw(ctx);
            }
        }

        for (var i = 0; i < Game.Planets.length; i++) {
            Game.Planets[i].draw(ctx, false);
        }
    }



    var fogctx = Game.fogctx;


    fogctx.save();
    // Use the identity matrix while clearing the canvas
    fogctx.setTransform(1, 0, 0, 1, 0, 0);
    fogctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);

    // Restore the transform
    fogctx.restore();

    ////// Draw Fog
    fogctx.beginPath();
    fogctx.rect(0, 0, 2000, 2200);
    fogctx.fillStyle = "rgba(15, 15, 15, .45)";
    fogctx.fill();


    Game.activePlayer.drawVisible(fogctx);


    //clearCircle(fogctx, 400, 400, 400);


};


var clearCircle = function (ctx, x, y, radius) {
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.clip();
    ctx.clearRect(x - radius - 1, y - radius - 1,
                      radius * 2 + 2, radius * 2 + 2);
    ctx.restore();
};



$(document).on('ready', function () {

    
    var canvas = document.getElementById("game-canvas");
    var fogCanvas = document.getElementById("fog-game-canvas");
    var ctx = canvas.getContext("2d");
    var fogctx = fogCanvas.getContext("2d");

    
    canvas.width = document.body.clientWidth; 
    canvas.height = document.body.clientHeight;

    fogCanvas.width = document.body.clientWidth;
    fogCanvas.height = document.body.clientHeight;



    // This should be handled a little more robustly. What if i don't have any assets??
    ge.Assets.loadImages({
        planet5: 'Images/Planets/planetrender_5.png',
        iconUnlock: 'Images/Icons/unlocksmall.png',
        iconBulb: 'Images/Icons/bulb.png',
        waypoint: 'Images/Icons/ship.png'
    }, function () {

        Game.init({
            canvas: canvas,
            fogCanvas: fogCanvas,
            ctx: ctx,
            fogctx: fogctx,
            start: function () {
                // Starts the Loop
                var GameLoop = new ge.GameLoop(ctx, Game.update, Game.draw);
                GameLoop.gameRun();
            }
        });


    });



    // Initialize Any Non Game Elements / JQuery Plugins etc...

    setupTooltips();

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



// Tooltip setup TODO: Not sure where this should go yet

function setupTooltips() {

    $("#info-box-technology table .plus-icon").each(function (index, element) {

        var td = $(element).parents('tr').children('.tech-points');

        $(td).children('div').each(function (index2, element2) {

            //console.log("Setting up tool tip for: " + element2);

            $(element2).qtip({
                content: 'test',
                show:'mouseover',
                hide:'mouseout'
            });

        });

    });



}



/* This should be put somewhere else ???? */

Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};