


(function () {
    var w = window, foundRaF = w.requestAnimationFrame ||
                     w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame ||
                     w.msRequestAnimationFrame || function (cb) { setTimeout(cb, 16) };
    window.requestAnimationFrame = requestAnimationFrame;
})();

var ge = {}; // game engine

ge.gameTime = {  // we define just an object since 
    //  there is only one instance.
    lastTime: Date.now(),
    frameTime: 0,
    typicalFrameTime: 20,
    minFrameTime: 12,
    time: 0
};

// move the clock one tick. return true if new frame, 
//      false otherwise.
ge.gameTime.tick = function () {
    var now = Date.now();
    var delta = now - this.lastTime;
    if (delta < this.minFrameTime) return false; if (delta > 2 * this.typicalFrameTime) { // +1 frame if too much time elapsed
        this.frameTime = this.typicalFrameTime;
    } else {
        this.frameTime = delta;
    };
    this.time += this.frameTime;
    this.lastTime = now;
    return true;
}

ge.GameLoop = function (nCtx, nUpdate, nDraw) {
    this.ctx = nCtx;
    this.update = nUpdate;
    this.draw = nDraw;
    this.boundGameRun = this.gameRun.bind(this);
};

ge.GameLoop.prototype.gameRun = function () {
    if (ge.gameTime.tick()) { this.run(); }
    requestAnimationFrame(this.boundGameRun);
};

ge.GameLoop.prototype.run = function () {
    this.draw(this.ctx);
    this.update(ge.gameTime.frameTime);
};

