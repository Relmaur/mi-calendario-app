const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

const typeDefs = require('./api/schema/schema');
const resolvers = require('./api/resolvers/resolvers');

const prisma = require('./database/database');

async function startServer(typeDefs, resolvers) {

    const app = express();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context:
            ({ req }) => {
                const user = req.user || null;
                return { prisma, user };
            }
    });

    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });


    const PORT = process.env.PORT || 4001;

    app.use(authenticateToken);
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}

function authenticateToken(req, res, next) {
    // Assuming the token is sent witht the header "Authorizatio: Bearer TOJEN"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token
    if (token == null) return res.sendStatus(401); // UIf no token, deny access

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);  // If token is not valid or expired
        req.user = user;
        next();
    });
}

startServer(typeDefs, resolvers);