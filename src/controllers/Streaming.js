const fs = require('fs');
const caminho = require('path');
const jwt = require("jsonwebtoken");

module.exports = {
    async getRange(req, res){
                const range = req.headers.range;
                const content = req.params.contentid;
                if(content){
                    if(range){
                        try{
                            const path = caminho.join(__dirname + '/contents/' + content + '.mp4');
                            const stat = fs.statSync(path);
                            const fileSize = stat.size;
                            const CHUNK_SIZE = 500000;
                            const start = Number(range.replace(/\D/g, ""));
                            const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
                            const contentLength = end - start + 1;
                            const head = {
                                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                                'Accept-Ranges': 'bytes',
                                'Content-Length': contentLength,
                                'Content-Type': 'video/mp4'
                            };
                            res.writeHead(206, head);
                            const videoStream = fs.createReadStream(path, { start, end });
                            videoStream.pipe(res);
                        }catch(err){
                            res.status(404).send();
                        }
                    }else{
                        res.status(403).send();
                    }
                }else{
                    res.status(404).send();
                }
    },
    async getCover(req, res){
        const content = req.params.coverid;
        try{
            res.sendFile(caminho.join(__dirname + '/covers/' + content)); 
        }catch(err){
            res.status(404).send();
        }
    }
};