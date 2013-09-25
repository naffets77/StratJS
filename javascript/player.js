


function PlayerStats(options) {

    this.SciencePoints = 3;
    this.ScienceBeaker = 0;
    this.ScienceBeakerRate = 5000;

}

function Player(options) {

    this.id = options.id;
    this.ai = typeof options.ai != "undefined" ? options.ai : false;
    this.stats = new PlayerStats();

}