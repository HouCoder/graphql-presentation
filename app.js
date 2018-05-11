import jsonServer from 'json-server';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';

// For subscriptions server - https://www.apollographql.com/docs/graphql-subscriptions/setup.html
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import { schema } from './schema';

const app = jsonServer.create();
const apiRouter = jsonServer.router('data.json');
const middlewares = jsonServer.defaults();
const PORT = 3000;

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
}));

app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

// Routes
app.use('/api', apiRouter);

app.get('/rest-demo', (req, res) => {
    res.render('rest.html');
});

app.get('/graphql-demo', (req, res) => {
    res.render('graphql.html');
});

app.get('/mutation', (req, res) => {
    res.render('mutation.html');
});

app.get('/', (req, res) => {
    res.render('index.html');
});

app.use(middlewares);

// Wrap the Express server
const ws = createServer(app);
ws.listen(PORT, () => {
    console.log(`GraphQL Server is now running on http://localhost:${PORT}/graphql`);
    console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`);

    // Set up the WebSocket for handling GraphQL subscriptions
    new SubscriptionServer({
        execute,
        subscribe,
        schema
    }, {
        server: ws,
        path: '/subscriptions',
    });
});
