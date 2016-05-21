const fs = require('fs');
const buffer = require('buffer');

class VHD {
    constructor(size = 0) {
        this.buffer = new buffer.Buffer(size);
    }

    save(url) {
        fs.writeFileSync(url, this.buffer);
        return this;
    }

    load(url) {
        this.buffer = fs.readFileSync(url);
        return this;
    }
    
    static load(url) {
        return (new VHD()).load(url);
    }
};

module.exports = VHD;