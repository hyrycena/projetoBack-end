const prisma = require('./prisma');

const novaReceita = (receita, idUser) => {
    return prisma.Receita.create({
        data: {
            idUser,
            name: receita.name,
            description: receita.description,
            tempPreparo: receita.tempPreparo,
        }
    });
}

const updateReceita = async (id, receita, idUser) => {
    const receita = await prisma.Receita.findFirst({
        where: {
            id,
        }
    })
    if (receita.idUser != idUser) {
        throw new Error("Usuario não autorizado")
    } else{
        return prisma.Receita.update({
        where: {
            id
        },
        data: {
            name: receita.name,
            description: receita.description,
            tempPreparo: receita.tempPreparo,
        }
    });
    }
   
}
const deleteReceita = async (id, idUser, receita) => {
    const receita = await prisma.Receita.findFirst({
        where: {
            id,
        }
    })
    if (receita.idUser != idUser) {
        throw new Error("Usuario não está autorizado")
    } else {
    return prisma.Receita.delete({
        where: {
            id
        },
        data: receita,
    });
    }
};
const viewById = (idUser) => {
    return prisma.Receita.findMany({
        where: {
            idUser
        }
    });
};

module.exports = {
    novaReceita: novaReceita,
    updateReceita,
    deleteReceita,
    viewById,
};