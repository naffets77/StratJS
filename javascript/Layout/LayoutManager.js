var lm = {
    player: null,
    uiHolder: [],

    setPlayer: function (player) {
        this.player = player;
        this.init();
        this.WaypointUI.updateWaypoints();
    }
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


    //shortcut
    this.InfoBoxUI = new this.infoboxUI(Game); // this is required because we need access to this object specifically
    this.WaypointUI = new this.waypointUI(this.player);

    this.uiHolder.push(new this.debugUI(Game));
    this.uiHolder.push(this.InfoBoxUI);
    this.uiHolder.push(new this.managementUI(Game, this.player));




    // setup events
    for (var i = 0; i < this.uiHolder.length; i++) {
        if (typeof this.uiHolder[i].events == 'function') {
            this.uiHolder[i].events();
        }
    }


    this.resize();

}


lm.waypointUI = function (player) {

    var player = player;

    this.events = function () {

    }

    // This should get called when player is set and when a waypoint is added.
    // Updates the waypoint UI
    this.updateWaypoints = function () {

        var waypointCount = player.waypoints.waypointArray.length;

        for (var i = 0; i < waypointCount; i++) {
            $("#waypoint-box-background").append('<div class="ui-waypoint">' + i + '</div>');
        }

    }

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

            }
            else {
                // Update

            }

        }
    }

}

lm.infoboxUI = function (Game) {

    this.planet = null;
    this.waypoint = null;


    this.setPlanet = function (planet) {
        this.waypoint = null;
        this.planet = planet;
    }

    this.setWaypoint = function (waypoint) {
        this.planet = null;
        this.waypoint = waypoint;
    }

    this.update = function (dt) {

        var player = Game.activePlayer;

        // Update number of science points
        $("#technology-points-available .counter").html(player.science.SciencePoints);


        if (this.planet != null) {
            this.showPlanet(this.planet);
        }

        if (this.waypoint != null) {
            this.showWaypoint(this.waypoint);
        }

    }

    this.events = function () {



        // menu handler
        $(".info-box-content .menu li").on('click', function () {

            if ($(this).hasClass('current')) {
                return;
            }

            $(this).parents(".menu").children('li').removeClass('current');

            $(this).addClass('current');

            $(this).parents(".info-box-content").children('.info-box-content-subcontent').hide();

            $("#info-box-content-subcontent_" + $(this).attr('id').split("_")[1]).show();





        });


        // Technology click events
        $("#info-box-technology .plus-icon").off('click').on('click', function () {
            var prop = $(this).attr("prop");
            if (Game.activePlayer.science.useSciencePoint(prop)) {

                $($(this).parents("tr").children(".tech-points").children("div:not(.active)")[0]).addClass('active');

                // Update UI
                if ($(this).parents("tr").children(".tech-points").children("div:not(.active)").length == 0) {
                    $(this).hide();
                }

            }
        });



    }

    this.showPlanet = function (planet) {

        var player = Game.activePlayer;

        this.planet = planet;
        var ticMultiplier = 1000 / Game.gameTicRate;


        // need to figure out how to get this number from one location automatically
        var explorationCost = planet.player.owner.stats.getCost("path", "exploreCost");
        explorationCost -= explorationCost * (planet.player.owner.stats.percentageBonuses.explorationCostBonus.cachedValue / 100);

        var discoverCost = planet.player.owner.stats.getCost("path", "discoverCost");
        discoverCost -= discoverCost * (planet.player.owner.stats.percentageBonuses.discoverCostBonus.cachedValue / 100);


        $("#info-box-planet-population").html((Math.round(planet.population.value * 100) / 100) + " %");
        $("#info-box-planet-population-growth").html((Math.round(planet.population.incrementCache * ticMultiplier * 1000) / 1000) + " % / sec");
        $("#info-box-planet-level").html(planet.infrastructure.level);

        $("#info-box-planet-available-production").html(planet.production.lastAvailableProduction);
        $("#info-box-planet-exploration-cost").html(explorationCost);
        $("#info-box-planet-discover-cost").html(discoverCost);


        // Set ship building stuff
        if (planet.production.shipFactory.shipTemplate != null) {
            $("#info-box-planet-ship-role").html(planet.production.shipFactory.shipTemplate.role);
            $("#info-box-planet-ship-size").html(planet.production.shipFactory.shipTemplate.size);

            $("#info-box-planet-ship-progress").progressbar({
                max: planet.production.shipFactory.currentShipCost,
                value: planet.production.shipFactory.currentShipProduction
            });
        }
        else {
            $("#info-box-planet-ship-role").html("None");
            $("#info-box-planet-ship-size").html("None");

            $("#info-box-planet-ship-progress").progressbar({
                max: 100,
                value: 0
            });
        }

        // Set available ship building stuff that planet can build


        var shipConfig = player.ships.shipTemplates;

        var planetInfrastructureLevel = planet.infrastructure.level;
        var playerMilitaryLevel = player.technology.technologies.weapons;


        $("#info-box-content-subcontent_available_ships").html(""); 


        $("#info-box-content-subcontent_available_ships").append(
            "<tr class='header'><td></td><td></td><td>Build</td><td>Queue</td><td>Queued</td></tr>");

        for (var shipType in shipConfig) {
            for (var shipSize in shipConfig[shipType].shipSizes) {

                // check if it is available to build
                var ship = shipConfig[shipType].shipSizes[shipSize];

                if (ship.technology <= playerMilitaryLevel && ship.infrastructureLevel <= planetInfrastructureLevel) {
                    $("#info-box-content-subcontent_available_ships").append(
                        "<tr>" +
                        "<td>" + ship.role + "</td>"+
                        "<td>" + ship.size + "</td>"+
                        "<td><input type='checkbox' /></td>" +
                        "<td><span>+</span>&nbsp;&nbsp;<span>-</span></td>" +
                        "<td><span>3</span></td>" + 
                        "</tr>");
                }
                else {
                    $("#info-box-content-subcontent_available_ships").append("<tr><td>" + ship.role + "</td><td>" + ship.size + "</td><td colspan='3'>Not Available</td></tr>");
                }
            }
        }



        if (!$("#info-box-planet").is(":visible")) {

            // swap the infobox UI
            $("#info-box-background .info-box-content").hide();
            $("#info-box-planet").show();
            $("#info-box-background .game-ui-header .title").html("Planet Name");
        }

        $("#info-box-planet-production-slider").slider({
            value: planet.production.shipBuildingAllocation,
            min: 0,
            max: 100,
            step: 1,
            slide: function (event, ui) {
                planet.production.shipBuildingAllocation = ui.value

            }
        });

        $("#info-box-planet-level-progress").progressbar({
            max: planet.infrastructure.nextLevelPointsRequired - planet.infrastructure.prevLevelPointsRequired,
            value: planet.infrastructure.points - planet.infrastructure.prevLevelPointsRequired
        });




    }

    this.showWaypoint = function (waypoint) {

        var player = Game.activePlayer;

        document.getElementById("info-box-waypoint-ship-count").innerHTML = waypoint.ships.length;
        document.getElementById("info-box-waypoint-ship-power").innerHTML = waypoint.power;
        document.getElementById("info-box-waypoint-ship-percent").innerHTML = "N/A";

        document.getElementById("info-box-waypoint-current-planet").innerHTML = waypoint.planet.id;

        document.getElementById("info-box-waypoint-last-planet").innerHTML = waypoint.lastPlanet != null ? 
            waypoint.lastPlanet.id : "N/A";
             
            
        

        if (!$("#info-box-waypoint").is(":visible")) {

            // swap the infobox UI
            $("#info-box-background .info-box-content").hide();
            $("#info-box-waypoint").show();
            $("#info-box-background .game-ui-header .title").html("Waypoint Name");
        }

    }

    this.showTechnology = function () {

        this.planet = null;

        console.log("Showing Technology");

        $("#info-box-background .game-ui-header .title").html("Technology");

        // swap the infobox UI
        $("#info-box-background .info-box-content").hide();
        $("#info-box-technology").show();

    }
}

lm.managementUI = function (Game, player) {

    this.update = function (dt) {


        // Todo : Only Make Updates for Screens that are visible

        // Update Overview Info

        // Update Resource Allocation
        for (var prop in player.resources.resourceAllocation) {
            var propClass = prop.replace(/\s+/g, '-').toLowerCase();
            $("#game-manager-resource-allocation-container  tr." + propClass + " .value").html(player.resources.resourceAllocation[prop]);
        }


        

        var ticMultiplier = 1000 / Game.gameTicRate;

        var shipUpkeep = player.resources.getShipUpkeepCost() * ticMultiplier;
        var shipUpkeepPercent = player.resources.getShipUpkeepPercentage();

        var rawProductionRatePerSecond = player.planets.planetStats.productionRate * ticMultiplier;


        var netProductionRatePerSecond = rawProductionRatePerSecond - shipUpkeep;


        var scienceProductionRate = Math.floor(netProductionRatePerSecond * (player.resources.resourceAllocation.science / 100));
        var scienceBonusPercent = player.stats.percentageBonuses.sciencePointResearchBonus.cachedValue;
        var scienceNetProductionRate = scienceBonusPercent != 0 ? scienceProductionRate + scienceProductionRate * (scienceBonusPercent / 100) : scienceProductionRate;




        

        $("#info-table-resources-net").html(Math.round(rawProductionRatePerSecond) + " units / sec");

        $("#info-table-resources-ship-upkeep").html(Math.round(shipUpkeep) + " units / sec ( " + Math.floor((shipUpkeepPercent * 100)) + "% )");

        $("#info-table-resources-available").html(Math.round(netProductionRatePerSecond) + " units / sec");

        $("#info-table-production-rate").html(Math.floor(netProductionRatePerSecond * (player.resources.resourceAllocation.production / 100)) + " units / sec");

        $("#info-table-science-rate").html(scienceProductionRate + " units / sec");

        $("#info-table-culture-rate").html(Math.floor(netProductionRatePerSecond * (player.resources.resourceAllocation.culture / 100)) + " units / sec");

        $("#info-table-science-point-cost").html(player.science.ScienceEnergyNeeded);

        $("#info-table-next-science-point-time").html(Math.floor(player.science.ScienceEnergyNeeded / scienceProductionRate) + " sec")

        $("#info-table-science-bonus-research").html(scienceBonusPercent + "%");

        $("#info-table-science-research-net").html(Math.ceil(scienceNetProductionRate) + " units / sec");

        $("#info-table-planets-count").html(player.planets.planetStats.count);

        $("#info-table-planets-population-avg").html(Math.floor((player.planets.planetStats.population / player.planets.planetStats.count) * 100) / 100 + "%");

        $("#info-table-avg-infrastructure-level").html(player.planets.planetStats.infrastructure / player.planets.planetStats.count);


        // Update Ship Counts
        
        // Set them all to 0
        $("#game-manager-spaceship-queue-holder .current-count").html("0");

        // Loop through array incrementing 

        var ships = player.ships.shipsArray;

        for (var i = 0; i < ships.length; i++) {
            var shipSize = ships[i].size;
            var shipRole = ships[i].role;

            var shipCountElement = $("#spaceship-queue-holder_" + shipRole + " ." + shipSize + " .current-count");
            var count = parseInt(shipCountElement.html());
            count = count + 1;
            $("#spaceship-queue-holder_" + shipRole + " ." + shipSize + " .current-count").html(count);
        }

    }

    this.resize = function (height, width) {

        //$("#game-manager-background").
        // Space available = height - info-box-background height - 30 spacing

        if ($("#info-box-background").is(":visible")) {
            $("#game-manager-background").css('height', height - parseInt($("#info-box-background").css('height')) - 65 + "px");

            $("#game-manager-background .info-table-container").css('height', height - 290 - parseInt($("#info-box-background").css('height')) - 65 + "px");

            $("#game-manager-spaceship-queue-holder").css('height', height - 100 - parseInt($("#info-box-background").css('height')) - 50 + "px");
        }
        else {
            $("#game-manager-background").css('height', height - 50 + "px");

            $("#game-manager-background .info-table-container").css('height', height - 290 - parseInt($("#info-box-background").css('height')) - 50 + "px");

            $("#game-manager-spaceship-queue-holder").css('height', height - 100 - parseInt($("#info-box-background").css('height')) - 50 + "px");
        }

    }

    this.events = function () {

        // Changes Management UI
        $("#game-manager-background ul li").off('click').on('click', function () {

            if ($(this).hasClass("current")) { return }

            $("#game-manager-background ul li").removeClass('current');

            $(this).addClass('current');

            $(".game-manager-content").hide();

            $("#game-manager-content-" + $(this).attr('id').split("_")[1]).fadeIn();

        });


        // Resource Allocation Events
        $("#game-manager-resource-allocation-container table tr td span").off('click').on('click', function () {

            var prop = $(this).parents('tr').attr("prop");
            Game.Players[0].resources.updateResourceAllocation(prop, $(this).html())
        });

        $("#game-manager-resource-allocation-container .resource-allocation-lock img").off('click').on('click', function () {

            if ($(this).hasClass('locked')) {
                $(this).hide();
                $(this).parent().children('.unlocked').show();
                Game.Players[0].resources.resourceLocked = "";
            }
            else {

                $("#game-manager-resource-allocation-container .resource-allocation-lock .locked").hide();
                $("#game-manager-resource-allocation-container .resource-allocation-lock .unlocked").show();

                var prop = $(this).parents('tr').attr('prop');

                $(this).hide();
                $(this).parent().children('.locked').show();

                Game.Players[0].resources.resourceLocked = prop;
            }

        })

        // Ship Queue Events

        var initialValue = 20;
        var min = 0;
        var max = 100;

        // initializing label
        $("#ship-queue-maintenance-slider-label").css("margin-left", (initialValue - min) / (max - min) * 100 + "%");
        $("#ship-queue-maintenance-slider-label").css("left", "-27px");

        // Initializing Slider
        $("#ship-queue-maintenance-slider").slider({
            value: initialValue,
            min: min,
            max: max,
            step: 1, slide: function (event, ui) {

                if (ui.value > 75) {
                    return false;
                }
                else {

                    $("#ship-queue-maintenance-slider-label").text(ui.value + "%");
                    $("#ship-queue-maintenance-slider-label").css("margin-left", (ui.value - min) / (max - min) * 100 + "%");
                    $("#ship-queue-maintenance-slider-label").css("left", "-27px");
                }
            }
        });

        // Building Spaceship Queue

        for (var shipType in shipConfig) {
            if (shipConfig.hasOwnProperty(shipType)) {
                
                var shipTypeHolderId = "spaceship-queue-holder_" + shipType;

                $("#game-manager-spaceship-queue-holder").append("<div class='spaceship-type-queue-holder' id='" + shipTypeHolderId + "'></div>");

                $("#" + shipTypeHolderId).append("<h2>" + shipType.charAt(0).toUpperCase() + shipType.slice(1) + "</h2>");

                for (var shipSize in shipConfig[shipType].shipSizes) {
                    $("#" + shipTypeHolderId).append(
                        "<div class='shipSize " + shipSize + "'>" +
                            "<div class='name'>" + shipSize.charAt(0).toUpperCase() + shipSize.slice(1) + "</div>" +
                            "<div class='slider-holder' style='display:none'><div class='label'>0</div><div class='slider'></div></div>" +
                            "<div class='current-count' style='display:none'>0</div>" +
                            "<div class='unlock-info'>?</div>" +
                        "</div>");

                    var slider = $("#" + shipTypeHolderId + " ." + shipSize + " .slider-holder .slider");
                    var label = $("#" + shipTypeHolderId + " ." + shipSize + " .slider-holder .label");


                    setupShipQueueSlider(shipType, shipSize, slider, label, false, "", 0, 0, 100);

                    if (shipConfig[shipType].shipSizes[shipSize].unlocked) {
                        $("#" + shipTypeHolderId + " ." + shipSize + " .slider-holder").show();
                        $("#" + shipTypeHolderId + " ." + shipSize + " .current-count").show();
                        $("#" + shipTypeHolderId + " ." + shipSize + " .unlock-info").hide();
                    }

                }

            }


            function setupShipQueueSlider(shipType, shipSize, sliderElement, sliderLabelElement, dynamicSlider, sliderSuffix, initialValue, min, max) {

                lm.utilities.bindSlider(sliderElement, sliderLabelElement, dynamicSlider, sliderSuffix, initialValue, min, max, function (event, ui) {
                    player.ships.setShipQueue(shipType, shipSize, ui.value)
                });
            }
        }

        



        //$("#game-manager-spaceship-queue-holder")

    }

}


lm.utilities = {
    bindSlider: function (sliderElement, sliderLabelElement, dynamicSlider, sliderSuffix, initialValue, min, max, callback) {

        // initializing label
        sliderLabelElement.css("margin-left", (initialValue - min) / (max - min) * 100 + "%");
        sliderLabelElement.css("left", "-27px");

        // Initializing Slider
        sliderElement.slider({
            value: initialValue,
            min: min,
            max: max,
            step: 1,
            slide: function (event, ui) {

                sliderLabelElement.text(ui.value + sliderSuffix);

                // Slider UI Element Needs to Move With The Slider
                if (dynamicSlider) {
                    sliderLabelElement.css("margin-left", (ui.value - min) / (max - min) * 100 + "%");
                    sliderLabelElement.css("left", "-27px");
                }

                if (typeof callback == 'function') {
                    callback(event, ui);
                }

            }
        });
    }
}

