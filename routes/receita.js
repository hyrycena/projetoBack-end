const express = require('express');
const router = express.Router();
const {novaReceita, viewById, deleteReceita, updateReceita } = require('../database/receitas');
const auth = require('../middleware/auth');
const zod = require('zod');

const   Schema = zod.object({
      name: zod.string({
           required_error: 'O nome é obrigatorio', invalid_type_error: 'nome deve ser um texto', }),
       description: zod.string().min(5),
       tempPreparo: zod.string(),
})

router.post('/novaReceita', auth, async (req, res) => {
    try {
     
     const user = req.idUser;
     const criarNovaReceita = Schema.parse(req.body);
     const salvarReceita = await novaReceita(criarNovaReceita, user);

        res.status(201).json({
            data: salvarReceita,
        });
    } catch (error) {
        if (error instanceof zod.ZodError) {
            return res.status(422).json({
                messagem: error.errors,
            });
        }
        res.status(500).json({ messagem:"erro" });
    }
})

router.get('/receitas', auth, async (req, res) => {
    try {
        const verReceita = await viewById(req.idUser);
        res.json({
            data: verReceita,
        })
    } catch (error) {
        if (error instanceof zod.ZodError) {
            return res.status(422).json({
                messagem: error.errors,
            });
        }
        res.status(500).json({ messagem: "erro no servidor" });
    }
})

router.put('/atualizarReceita/:id', auth, async (req, res) => {
    try {
         const id = Number(req.params.id);
         const receitas = Schema.parse(req.body);
         const atualizarReceita = await updateReceita(id, receitas, req.idUser);
           res.json({
             data: atualizarReceita,
        })
    }  catch (error) {
         if (error instanceof zod.ZodError) {
             return res.status(422).json({
                 messagem: error.errors,
             });
          } else if (error.messagem === "erro,usuario sem autorização") {
              return res.status(401).json({
                 messagem: error.messagem,
             });
        }
            res.status(500).json({ messagem: "erro no servidor" });
    }

})

router.delete('/excluirReceita/:id', auth, async (req, res) => {
    try {
         const id = Number(req.params.id);
            await deleteReceita(id, req.idUser);
            res.status(204).send('a receita foi deletada');
         } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(422).json({
                    messagem: error.errors,
                });
            } else if (error.message === "erro, usuario sem autorização") {
                return res.status(401).json({
                    messagem: error.messagem,
             });
         }
            res.status(500).json({ messagem: "erro no servidor" });
    }
})

module.exports = { router, };