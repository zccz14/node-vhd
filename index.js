const fs = require('fs');
const buffer = require('buffer');

class VHD {
    constructor(size = 0) {
        var appendix = fs.readFileSync('./lib/vhd_appendix');
        this.buffer = new buffer.Buffer.alloc(size + 512);
        appendix.copy(this.buffer, size, 0, 512);
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