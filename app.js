import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';


const PORT = 3000;

const app = express();

import { schema } from './schema';

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(PORT, () => {
    console.log(`GraphQL Server is now running on http://localhost:${PORT}/graphql`);
    console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`);
});
