
var Game = {

    Players: [],

    SciencePoints: 3,
    ScienceBeaker: 0,
    ScienceBeakerRate : 5000 // seconds

}

Game.init = function () {

    this.Players.push(new Player({id:1}));
    this.Players.push(new Player({id:2, ai: true }));

}




Game.update = function (dt) {
    // put here your update computations, relative to dt	
    // dt is time passed in the game

    lm.update(dt, Game);

    Game.ScienceBeaker += dt;

    if (Game.ScienceBeaker > Game.ScienceBeakerRate) {
        Game.SciencePoints += 1;
        Game.ScienceBeaker = 0;
        Game.ScienceBeakerRate += 250;
    }

};

Game.draw = function (ctx) {
    // ...


};



Game.init();

// Starts the Loop
var GameLoop = new ge.GameLoop(document.getElementById("GameCanvas").getContext("2d"), Game.update, Game.draw);
GameLoop.gameRun();