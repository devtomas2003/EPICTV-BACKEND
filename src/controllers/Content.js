const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    async getPosterAndCategories(req, res){
        const contentCount = await prisma.content.count({
            where: {
                NOT: {
                    bigPoster: null
                }
            }
        });
        const skip = Math.floor(Math.random() * contentCount);
        const content = await prisma.content.findMany({
            where: {
                NOT: {
                    bigPoster: null
                }
            },
            take: 1,
            skip,
            orderBy: {
                id: 'desc',
            }
        });
        const categories = await prisma.categories.findMany({
            include: { members: {
                take: 6
            }}
        });
        const data = {
            content,
            categories
        }
        return res.status(200).json(data);
    },
    async selectStrSrv(req, res){
        const ip = req.headers['x-real-ip'];
        const subnets = await prisma.blocos.findMany();
        var ocaURL = "ipv4-imm-epictv-001.imm.epictv.com";
        for(var i = 0; i <= subnets.length-1; i++){
            if(inSubNet(ip, subnets[i].cidr)){
                const oca = await prisma.ocas.findFirst({
                    where: {
                        idOCA: subnets[i].ocaID
                    }
                });
                ocaURL = oca.urlOca;
            }
        }
        res.status(200).json({
            ocaURL
        });
    }
};

var ip2long = function(ip){
    var components;

    if(components = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/))
    {
        var iplong = 0;
        var power  = 1;
        for(var i=4; i>=1; i-=1)
        {
            iplong += power * parseInt(components[i]);
            power  *= 256;
        }
        return iplong;
    }
    else return -1;
};

var inSubNet = function(ip, subnet)
{   
    var mask, base_ip, long_ip = ip2long(ip);
    if( (mask = subnet.match(/^(.*?)\/(\d{1,2})$/)) && ((base_ip=ip2long(mask[1])) >= 0) )
    {
        var freedom = Math.pow(2, 32 - parseInt(mask[2]));
        return (long_ip > base_ip) && (long_ip < base_ip + freedom - 1);
    }
    else return false;
};