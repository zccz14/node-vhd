const fs = require('fs');
const buffer = require('buffer');

class VHD {
    constructor(size = 0) {
        this.buffer = new buffer.Buffer.alloc(size + 512);
        this.footer = this.buffer.slice(size, size + 512);
        this.originSize = this.footer.slice(0x028, 0x030);
        this.currentSize = this.footer.slice(0x030, 0x038);
        this.CHS = this.footer.slice(0x038, 0x03C);
        this.UUID = this.footer.slice(0x044, 0x054);
        this.checkSum = this.footer.slice(0x040, 0x044);

        var footer = fs.readFileSync('./lib/vhd_footer_default');

        // Timestamp
        footer.writeInt32BE(~~((Date.now() - 946728000000) / 1000), 0x018);

        // origin size
        footer.writeIntBE(size, 0x028, 8);
        // current size
        footer.writeIntBE(size, 0x030, 8);

        // CHS Algorithm XXXX 04 11 in 0x038
        footer.writeInt32BE(this.getCHS(size), 0x038);

        // UUID
        for (var i = 0x044; i < 0x054; i++)
            footer[i] = ~~(Math.random() * 256);

        // CheckSum
        footer.writeInt32BE(
            ~(
                footer.slice(0x000, 0x040).reduce((a, b) => a + b, 0) +
                footer.slice(0x044, 0x200).reduce((a, b) => a + b, 0)
            ),
            0x040
        );

        footer.copy(this.footer, 0, 0, 512);

        return this;
    }

    getCHS(size) {
        var totalSectors = Math.min(~~(size / 512), 65535 * 16 * 255);
        if (totalSectors >= 65535 * 16 * 63) {
            var sectorsPerTrack = 255;
            var heads = 16;
            cylinderTimeHeads = ~~(totalSectors / sectorsPerTrack);
        } else {
            var sectorsPerTrack = 17;
            var cylinderTimeHeads = ~~(totalSectors / sectorsPerTrack);
            var heads = Math.max(~~((cylinderTimeHeads + 1023) / 1024), 4);
            if (cylinderTimeHeads >= (heads * 1024) || heads > 16) {
                sectorsPerTrack = 31;
                heads = 16;
                cylinderTimeHeads = ~~(totalSectors / sectorsPerTrack);
            }
            if (cylinderTimeHeads >= (heads * 1024)) {
                sectorsPerTrack = 63;
                heads = 16;
                cylinderTimeHeads = ~~(totalSectors / sectorsPerTrack);
            }
        }
        var cylinders = ~~(cylinderTimeHeads / heads);
        return (cylinders << 16) + (heads << 8) + sectorsPerTrack;
    }

    save(url) {
        fs.writeFileSync(url, this.buffer);
        return this;
    }

    load(url) {
        this.buffer = fs.readFileSync(url);
        return this;
    }
    
    initMBR() {
        this.MBR = this.buffer.slice(0, 512);
        var MBR = fs.readFileSync('./lib/mbr_default');
        MBR.copy(this.MBR, 0, 0, 512);
        return this;
    }

    static load(url) {
        return (new VHD()).load(url);
    }
};

module.exports = VHD;
