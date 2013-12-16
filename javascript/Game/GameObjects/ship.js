function Ship(options) {

    //this.id = options.id;
    this.player = options.player;
    this.locationObject = options.locationObject; // Planet or Path
    this.state = "idle";

    this.techLevel = options.player.technology.technologies.weapons;
    this.role = options.shipTemplate.role; // Support, Fighter, Missile 
    this.size = options.shipTemplate.size; // small, medium, large, capitol

    this.cost = options.cost;

    this.destroyed = false;
    this.destroyedReason = null;
}


