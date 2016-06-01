function Annot(tierName, value, beginTime, endTime) {
    this.id = '';
    this.name = tierName;
    this.content = value ? value : '';
    this.link = '';
    this.typeannot = '';
    this.dependantAnnotations = [];

    if (beginTime !== undefined && endTime !== undefined) {
        this.start = Number(beginTime);
        this.end = Number(endTime);
        /*
        * correct values if end time before begin time
        */
        if (this.end < this.start && this.end >= 0) {
            var sw = this.end;
            this.end = this.start;
            this.start = sw;
        }
    } else {
        this.start = '';
        this.end = '';
    }

    this.toString = function() {
        var s = "NAME = " + name + "; ID = " + this.id ; 
        if (this.typeannot === "ref"){
            s += "; LINK = " + this.link;
        }
        else {
            s += "; START = " + this.start + "; END = " + this.end;
        }
        s += "; CONTENT = " + this.content;
        var i = 0;
        if (this.dependantAnnotations.length > 9) {
            while (i<10) {				
                s += "\n\t" + this.dependantAnnotations[i].toString();
                i++;
            }
        }
        return s;
    }
}
