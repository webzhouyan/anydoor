const fs = require('fs');
const path = require('path')
const promisify = require('util').promisify;
const Handlebars = require('handlebars')
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config  =  require('../config/defaultConfig');
const mimie = require('../helper/mime');
const compress = require('./compress')
const isFresh = require('./cache')


const tplPath = path.join(__dirname,'../template/dir.tpl');
const source = fs.readFileSync(tplPath);

const template = Handlebars.compile(source.toString());

module.exports = async function (req,res,filePath) {
    try {
        const stats = await stat(filePath)
        if(stats.isFile()) {
            res.statusCode = 200;
            res.setHeader('Content-Type',mimie(filePath));

            //判断是否缓存
            if(isFresh(stats,req,res)) {
                res.statusCode = 304;
                res.end();
                return;
            }


            let rs = fs.createReadStream(filePath);
            if(filePath.match(config.compress)) {
                rs = compress(rs,req,res);
            }
            rs.pipe(res)
        } else if (stats.isDirectory()) {
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type','text/html');
            const dir = path.relative(config.root,filePath);
            //传给tpl的data
            const data = {
                title:path.basename(filePath),
                dir: dir?`/${dir}`:'',
                files
            }
            res.end(template(data))
        }
    } catch (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type','text/plain');
        res.end(`${filePath} is not exist ++++${err}`);
    }
}
