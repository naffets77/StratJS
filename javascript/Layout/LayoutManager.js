var lm = {
    uiHolder :[]
};


lm.update = function (dt, Game) {

    for (var i = 0; i < this.uiHolder.length; i++) {
        this.uiHolder[i](dt, Game);
    }
}


lm.debugUI = function (dt, Game) {
    var value = $("#dt").attr("TotalTime") == undefined ? 0 : parseInt($("#dt").attr("TotalTime"));
    $("#dt").attr("TotalTime", dt + value);
    $("#dt").html((Math.floor(value / 1000)) + "s");


    for (var i = 0; i < Game.Players.length; i++) {

        var player = Game.Players[i];

        if (document.getElementById("player-debug-table_" + player.id) == null) {
            $("#players").append("<table class='player-debug-table' id='player-debug-table_" + player.id + "'></table>");

            $("#player-debug-table_" + player.id).append("<tr><td colspan='2'>Player " + player.id + "</td></tr>");
            $("#player-debug-table_" + player.id).append("<tr><td>AI</td><td>" + player.ai + "</td></tr>");

            for (var prop in player.stats) {

                $("#player-debug-table_" + player.id).append("<tr><td>" + prop + "</td><td>" + player.stats[prop] + "</td></tr>");
            }


        }
        else {


        }

    }


    $("#science-points").html(Game.SciencePoints);
    $("#science-beaker-percentage").html(Math.round((Game.ScienceBeaker / Game.ScienceBeakerRate) * 100));
    $("#science-beaker-rate").html(Game.ScienceBeakerRate);
}


// Add all the Default UIs
lm.uiHolder.push(lm.debugUI);