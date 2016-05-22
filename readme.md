# Node VHD
Microsoft Virtual Hard Disk built with JavaScript
# create a new virtual hard disk
```
const VHD = require('node-vhd');
var vhd = new VHD(10 * 1024 * 1024); // 10MiB
```
# save the vhd to the file
```
vhd.save('a.vhd'); // save to the a.vhd
```
# load vhd from the file
```
vhd.load('a.vhd'); // load from the a.vhd
```
## Using static method to build object
```
var vhd = VHD.load('a.vhd'); // load from the a.vhd
```
# Initialize the Master Boot Record
```
vhd.initMBR(); 
```
