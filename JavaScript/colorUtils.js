function Colors(startingIndex) {

    this.startingIndex = startingIndex;
    this.colorSets = [];
    this.uses = 0;

    this.colorSets.push([
        [27, 204, 183],
        [22, 173, 156],
        [17, 128, 115],
        [14, 100, 90],
        [7, 94, 84],
        [6, 82, 73],
        [5, 56, 63]
    ]);

    this.colorSets.push([
        [7, 94, 84]
    ]);

    this.colorSets.push([
        [172, 117, 0]
    ]);

    this.getNumberOfColors = function() {
        return colorSets.length;
    }

    this.getIndexOfSubsequentColorSet = function() {
        let index = this.startingIndex + this.uses;
        if (this.uses == this.colorSets.length - 1) {
            this.uses = this.startingIndex;
        } else {
            this.uses++;
        }

        return index;
    }

    this.generateRandomTriplet = function() {
        var r, g, b, rg, gb, rb;
        var range = 255; 
        // controls the range of r,g,b you would like
        //reduce the range if you want more darker colors
        var sep = range / 4; 
        // controls the minimum separation for saturation
        //note- keep sep < range/3 otherwise may crash browser due to performance
        //reduce the sep if you do not mind pastel colors
        //generate r,g,b, values as long as any difference is < separation
        //do {
            r = 0;
          //r = Math.floor(Math.random() * range);
          g = Math.floor(Math.random() * range);
          b = Math.floor(Math.random() * range);
      
          rg = Math.abs(r - g);
          gb = Math.abs(g - b);
          rb = Math.abs(r - b);
        //} while (rg < sep || gb < sep || rb < sep);
      
        return [r, g, b];
      }

    this.getRGBAString = function(triplet, opacity) {
        let r = triplet[0];
        let g = triplet[1];
        let b = triplet[2];
        return "rgba(" + r + ", " + g + ", " + b + ", " + opacity + ")";
    }

    this.getRGBAStringSetByIndex = function(index, opacity) {
        let rgbaStringSet = [];

        if (index > this.colorSets.length-1) {
            index = 0;
            console.log("the index is to high!")
        }

        let triplets = this.colorSets[index];

        for(let triplet of triplets) {
            let string = this.getRGBAString(triplet, opacity);
            rgbaStringSet.push(string);
        }

        return rgbaStringSet;
    } 
}