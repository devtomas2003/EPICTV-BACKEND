const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');

module.exports = {
    async updateOCABGP(req, res){
        const ocaid = req.body.ocaid;
        await prisma.blocos.deleteMany({
            where: {
                ocaID: ocaid
            }
        });
        const routes = req.body.bgpNow.split("\n");
        routes.pop();
        routes.shift();
        for(var i = 0; i <= routes.length-1; i++){
            const ipbase = routes[i].split("/");
            const maskComplete = ipbase[1].split(" ");
            const cidr = ipbase[0] + "/" + maskComplete[0];
            await prisma.blocos.create({
                data: {
                    idbloco: uuidv4(),
                    ocaID: ocaid,
                    cidr
                }
            });
        }
        res.send('updated');
    }
};