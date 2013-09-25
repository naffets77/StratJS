var lm = {
    uiHolder :[]
};


lm.update = function (dt, Game) {

    for (var i = 0; i < this.uiHolder.length; i++) {
        this.uiHolder[i](dt, Game);
    }
}


lm.debugUI = function (dt) {
    var value = $("#dt").attr("TotalTime") == undefined ? 0 : parseInt($("#dt").attr("TotalTime"));
    $("#dt").attr("TotalTime", dt + value);
    $("#dt").html((Math.floor(value / 1000)) + "s");

    $("#science-points").html(Game.SciencePoints);
    $("#science-beaker-percentage").html(Math.round((Game.ScienceBeaker / Game.ScienceBeakerRate) * 100));
    $("#science-beaker-rate").html(Game.ScienceBeakerRate);
}


// Add all the Default UIs
lm.uiHolder.push(lm.debugUI);