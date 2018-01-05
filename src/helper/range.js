module.exports = (totalSize,req,res) => {
    const range = req.header['range'];
    if(!range) {
        return {code:200}
    }

    const sizes = range.match(/bytes=(\d*)-(\d*)/); //返回匹配结果的数组
    const end = sizes[2] || totalSize-1;
    const start = sizes[1] || totalSize -end;

    if(start > end || start < 0 || end > totalSize ) {
        return {coed:0};
    }
    res.setHeader('Accept-Range','bytes');
    res.setHeader('Content-Range',`bytes ${start}-${end}/${totalSize}`);
    res.setHeader('Content-Length',end-start)
    return {
        code:206,
        start:parseInt(start),
        end:parseInt(end)
    }
}
