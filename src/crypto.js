const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const rs = fs.createReadStream(`${__dirname}/app.js`);
const hash = crypto.createHash('md5');
// rs.on('readable',()=>{
//     const data = rs.read();
//     if(data) {
//         hash.update(data);
//     } else {
//         console.log(`${hash.digest('hex')}`);

//     }
// })
let filePath = path.join(__dirname,'../package.json');
const fileData = fs.readFileSync(filePath);
hash.update(fileData);
console.log(`${hash.digest('hex')}`);

