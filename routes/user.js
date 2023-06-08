const express = require('express');
const {novoUsuario, findByEmail} = require('../database/user');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const zod = require('zod');


const userValidation = zod.object({
    name: zod.string().min(4),
    email: zod.string().email(),
    password: zod.string().min(6),
})

const login = zod.object({
    email: zod.string().email(),
    password: zod.string(),
})

    router.post('/newUser', async (req, res) => {
   try {
    const user = userValidation.parse(req.body);
    const email = await findByEmail(user.email);
     if (email) {
        return res.status(400).json({ messagem: 'Esse email ja esta em uso' });
     }
      
     const password = bcrypt.hashSync(user.password, 10);
      user.password = password;
      const User = await novoUsuario(user);
      
      delete User.password;
        res.status(201).json({
            user: User,
        })
    } catch (err) {
        if (err instanceof zod.ZodError) {
            return res.status(422).json({
                message: err.errors,
            });
        }
        res.status(500).json({
            messagem: 'Server error',
        });
    }

    });

    router.post('/login', async (req, res) => {
    try {
        const info = login.parse(req.body);
        const user = await findByEmail(info.email);
        if (!user) return res.status(401).send();
        const validPassword = bcrypt.compare(info.password, user.password);
        if (!validPassword) return res.status(401).send();
        const token = jwt.sign(
            {
             userId: user.id,
            },
                  process.env.KEY_TOKEN,
        );
        res.status(200).json({
             token,
        });
    } catch (error) {
        if  (error instanceof zod.ZodError) {
              return res.status(422).json({
                    messagem: error.errors,
              });
        }
        res.status(500).json({
            messagem: 'Error',
        });
    }

    });

module.exports = { router };