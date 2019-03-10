import { GraphQLServer, PubSub } from 'graphql-yoga';
import { default as resolvers } from './resolvers'
import { default as typeDefs } from './typeDefs'

const pubsub = new PubSub()
function createServer(context: {
    models: any,
    db: any,
    pubsub: any
}) {
    context.pubsub = pubsub;
    return new GraphQLServer({
        typeDefs: typeDefs,
        resolvers,
        context: req => ({ ...req, ...context }),
    });
}

export default createServer;