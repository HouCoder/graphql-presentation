import jsonServer from 'json-server';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { schema } from './schema';

const app = jsonServer.create();
const apiRouter = jsonServer.router('data.json');
const middlewares = jsonServer.defaults();
const PORT = 3000;

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

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

app.listen(PORT, () => {
    console.log(`GraphQL Server is now running on http://localhost:${PORT}/graphql`);
    console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`);
});
