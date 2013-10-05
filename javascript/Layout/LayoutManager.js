var lm = {
    uiHolder :[]
};


lm.update = function (dt) {

    for (var i = 0; i < this.uiHolder.length; i++) {
        this.uiHolder[i].update(dt);
    }
}

lm.resize = function () {
    var height = $(window).height();
    var width = $(window).width();

    for (var i = 0; i < this.uiHolder.length; i++) {
        if (typeof this.uiHolder[i].resize == 'function') {
            this.uiHolder[i].resize(height, width);
        }
    }

    // todo: Make sure canvas is the right size ... this doesn't work stretches it out, need to figure something out
    /*
    $("#game-canvas").css('height', height);
    $("#game-canvas").css('width', width);
    */
}

lm.init = function () {

    var self = this;

    window.onresize = function (event) {
        self.resize();
    }

    this.uiHolder.push(new this.debugUI());
    this.uiHolder.push(new this.infoboxUI());
    this.uiHolder.push(new this.managementUI());



    // setup events
    for (var i = 0; i < this.uiHolder.length; i++) {
        if (typeof this.uiHolder[i].events == 'function') {
            this.uiHolder[i].events();
        }
    }


    this.resize();

}

lm.debugUI = function () {

    this.update = function (dt) {
        var value = $("#dt").attr("TotalTime") == undefined ? 0 : parseInt($("#dt").attr("TotalTime"));
        $("#dt").attr("TotalTime", dt + value);
        $("#dt").html((Math.floor(value / 1000)) + "s");

        $("#mouseCoords").html("(" + Game.InputHandler.Mouse.location.x + "," + Game.InputHandler.Mouse.location.y + ")");
        $("#mouseCoordsDx").html("(" + Game.InputHandler.Mouse.location.dx + "," + Game.InputHandler.Mouse.location.dy + ")");


        for (var i = 0; i < Game.Players.length; i++) {

            var player = Game.Players[i];

            if (document.getElementById("player-debug-table_" + player.id) == null) {
                $("#players").append("<table playerid='" + player.id + "' class='player-debug-table' id='player-debug-table_" + player.id + "'></table>");

                $("#player-debug-table_" + player.id).append("<tr class='header'><td colspan='2'>Player Info</td></tr>");

                $("#player-debug-table_" + player.id).append("<tr><td colspan='2'>Player " + player.id + "</td></tr>");
                $("#player-debug-table_" + player.id).append("<tr><td>AI</td><td>" + player.ai + "</td></tr>");

                $("#player-debug-table_" + player.id).append("<tr class='header'><td colspan='2'>Stats</td></tr>");

                for (var prop in player.stats) {
                    if (typeof player.stats[prop] != 'function') {
                        $("#player-debug-table_" + player.id).append("<tr proptype='stats' prop='" + prop + "'><td>" + prop + "</td><td class='" + prop.replace(/\s+/g, '-').toLowerCase() + "'>" + player.stats[prop] + "</td></tr>");
                    }
                }

                $("#player-debug-table_" + player.id).append("<tr class='header'><td colspan='2'>Resource Allocation</td></tr>");

                for (var prop in player.resources.resourceAllocation) {
                    $("#player-debug-table_" + player.id).append("<tr class='resourceAllocation' proptype='resourceAllocation' prop='" + prop + "'><td>" + prop + "</td><td class='" + prop.replace(/\s+/g, '-').toLowerCase() + "'>" + player.resources.resourceAllocation[prop] + "</td><td>&nbsp;<span>+</span>&nbsp;<span>-</span> <input class='debug-change-resource-allocation' name='resourceAllocation_" + player.id + "' type='radio' value='" + prop + "' /></td></tr>");
                }

                $("#player-debug-table_" + player.id).append("<tr class='header'><td colspan='2'>Technology</td></tr>");

                for (var prop in player.technology.technologies) {
                    $("#player-debug-table_" + player.id).append("<tr class='technology' proptype='technology' prop='" + prop + "'><td>" + prop + "</td><td class='" + prop.replace(/\s+/g, '-').toLowerCase() + "'>" + player.technology.technologies[prop] + "</td><td> &nbsp;<span>+</span>&nbsp;<span>-</span></td></tr>");
                }


                $(".player-debug-table span").off('click').on('click', function () {
                    var playerId = $(this).parents('table').attr('playerid');
                    var prop = $(this).parents('tr').attr("prop");
                    var propType = $(this).parents('tr').attr("proptype");

                    switch (propType) {

                        case "resourceAllocation":
                            Game.Players[playerId].resources.updateResourceAllocation(prop, $(this).html())
                            break;
                        case "technology":
                            if ($(this).html() == "+") {
                                Game.Players[playerId].stats.useSciencePoint(prop)
                            }
                            else {
                                Game.Players[playerId].technology.update(prop, -1)
                            }
                            break;
                    }
                });

                $(".debug-change-resource-allocation").off('click').on('click', function () {
                    console.log("Locking resource allocation: " + $(this).val());
                });

            }
            else {
                // Update
                for (var prop in player.stats) {
                    var propClass = prop.replace(/\s+/g, '-').toLowerCase();
                    $("#player-debug-table_" + player.id + " ." + propClass).html(player.stats[prop]);
                }

                for (var prop in player.resources.resourceAllocation) {
                    var propClass = prop.replace(/\s+/g, '-').toLowerCase();
                    $("#player-debug-table_" + player.id + " .resourceAllocation ." + propClass).html(player.resources.resourceAllocation[prop]);
                }

                for (var prop in player.technology.technologies) {
                    var propClass = prop.replace(/\s+/g, '-').toLowerCase();
                    $("#player-debug-table_" + player.id + " .technology ." + propClass).html(player.technology.technologies[prop]);
                }

            }

        }
    }

}

lm.infoboxUI = function (Game) {

    this.update = function (dt) {

    }

    this.events = function () {

        $("#info-box-technology .plus-icon").on('click', function () {
            var prop = $(this).attr("prop");
            if (Game.activePlayer.stats.useSciencePoint(prop)) {
                Game.activePlayer.technology.update(prop, 1)
            }
        });

    }
}

lm.managementUI = function (dt, Game) {

    this.update = function (dt, Game) {

    }

    this.resize = function (height, width) {
        
        //$("#game-manager-background").
        // Space available = height - info-box-background height - 30 spacing

        if ($("#info-box-background").is(":visible")) {
            $("#game-manager-background").css('height', height - parseInt($("#info-box-background").css('height')) - 65 + "px");
        }
        else {
            $("#game-manager-background").css('height', height - 50 + "px");
        }

    }

}


// This should prob be moved somewhere else?
$(document).on('ready', function () {

    lm.init();

});