

ge.Assets.images = {};

ge.Assets.loadImages = function(sources, callback) {
    var images = this.images;
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for(var src in sources) {
        numImages++;
    }
    for(var src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
            if (++loadedImages >= numImages) {
                if (typeof callback == 'function') {
                    callback(images);
                }
            }
        };

        images[src].src = sources[src];
    }
}