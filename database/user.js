const prisma = require('./prisma');

 const novoUsuario = (user) => {
      return prisma.User.create({
          data: {
                name: user.name,
                email: user.email,
                password: user.password,
        }
    })
}

const findByEmail = (email) => {
    return prisma.User.findUnique({
         where: {
                email
        },
    })
};

 const findById = (id) => {
    return prisma.User.findUnique({
        select: {
         id: true,
         name: true,
        email: true,
        password: false,
        },
        where: {
            id
        },
    })
};

module.exports = {
    novoUsuario: novoUsuario,
    findByEmail,
    findById,
}