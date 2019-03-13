import { GraphQLServer } from 'graphql-yoga';
import { default as resolvers } from './resolvers'
import { default as typeDefs } from './typeDefs'

function createServer(context: {
    models: any,
    db: any
}) {
    return new GraphQLServer({
        typeDefs: typeDefs,
        resolvers,
        context: req => ({ ...req, ...context }),
    });
}

export default createServer;