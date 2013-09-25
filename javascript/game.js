
var Game = {

    SciencePoints: 3,
    ScienceBeaker: 0,
    ScienceBeakerRate : 5000 // seconds

}






var myUpdate = function (dt) {
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

var myDraw = function (ctx) {
    // ...


};




// Starts the Loop
var GameLoop = new ge.GameLoop(document.getElementById("GameCanvas").getContext("2d"), myUpdate, myDraw);
GameLoop.gameRun();