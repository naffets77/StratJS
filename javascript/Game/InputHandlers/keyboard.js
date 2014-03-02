Game.InputHandler.Keyboard = {

    init: function (game) {
        var self = this;
        this.game = game;


        document.onkeypress = function (e) {

            // We'll want to switch based on the UI currently shown for now we only have one...

            self.gameUIInputs(e);
        };


    }

}


Game.InputHandler.Keyboard.gameUIInputs = function (e) {

    //console.log(e);

    switch (e.keyCode) {
        
        case 119: // w            
            this.game.ctx.yLoc += 30;
            this.game.ctx.setTransform(1, 0, 0, 1, this.game.ctx.xLoc, this.game.ctx.yLoc);
            this.game.fogctx.yLoc += 30;
            this.game.fogctx.setTransform(1, 0, 0, 1, this.game.fogctx.xLoc, this.game.fogctx.yLoc);
            break;
        case 115: // s
            this.game.ctx.yLoc -= 30;
            this.game.ctx.setTransform(1, 0, 0, 1, this.game.ctx.xLoc, this.game.ctx.yLoc);
            this.game.fogctx.yLoc -= 30;
            this.game.fogctx.setTransform(1, 0, 0, 1, this.game.fogctx.xLoc, this.game.fogctx.yLoc);
            break;
        case 97: // a
            this.game.ctx.xLoc += 30;
            this.game.ctx.setTransform(1, 0, 0, 1, this.game.ctx.xLoc, this.game.ctx.yLoc);
            this.game.fogctx.xLoc += 30;
            this.game.fogctx.setTransform(1, 0, 0, 1, this.game.fogctx.xLoc, this.game.fogctx.yLoc);
            break;
        case 100: // d
            this.game.ctx.xLoc -= 30;
            this.game.ctx.setTransform(1, 0, 0, 1, this.game.ctx.xLoc, this.game.ctx.yLoc);
            this.game.fogctx.xLoc -= 30;
            this.game.fogctx.setTransform(1, 0, 0, 1, this.game.fogctx.xLoc, this.game.fogctx.yLoc);
            break;
    }
}









