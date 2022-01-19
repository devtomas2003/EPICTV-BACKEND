const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    async sendLogin(req, res){
        const { user, password } = req.body;
        const userResult = await prisma.users.findFirst({
            where: {
                user
            }
        });
        if(!userResult){
            return res.status(404).json({
                "message": "User not exists!"
            });
        }
        const validPassword = await bcrypt.compare(password, userResult.password);
        if(validPassword){
            const token = jwt.sign({ id: userResult.id }, process.env.ENC_PASSWORD, {
                expiresIn: 18000
            });
            return res.status(200).json({
                "message": "User authenticated",
                token
            });
        }else{
            return res.status(404).json({
                "message": "User not exists!"
            });
        }
    }
};