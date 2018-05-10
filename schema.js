import { makeExecutableSchema } from 'graphql-tools';
import { find, filter } from 'lodash';

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

const typeDefs = `
    type Books {
        id: Int
        name: String
        author_detail: Authors
        publisher_detail: Publishers
        publishing_data: String
        price: String
        ISBN: String
        thumbnail: String
        length: Int
    }

    type Authors {
        id: Int
        name: String
        weibo: String
        birth_day: String
        books: [Books]
    }

    type Publishers {
        id: Int
        name: String
        location: String
        website: String
        books: [Books]
    }

    type newlyAddedBook {
        id: Int
        message: String
    }

    type Mutation {
        addBook(name: String!): newlyAddedBook
    }

    type Query {
        books(id: Int): [Books]
        authors(id: Int): [Authors]
        publishers(id: Int): [Publishers]
    }
`;

function getBooks(root, {id}) {
    if (id !== undefined) {
        return [find(data.books, {id})];
    } else {
        return data.books;
    }
}

function getAuthors(root, {id}) {
    if (id !== undefined) {
        return [find(data.authors, {id})];
    } else {
        return data.authors;
    }
}

function getPublishers(root, {id}) {
    if (id !== undefined) {
        return [find(data.publishers, {id})];
    } else {
        return data.publishers;
    }
}

const resolvers = {
    Query: {
        books: getBooks,
        authors: getAuthors,
        publishers: getPublishers,
    },

    Mutation: {
        addBook: (root, {name}) => {
            console.log(`New 📖 added - ${name}`);

            return {
                id: parseInt(Date.now() / 1000, 10),
                message: `New 📖 added - ${name}`,
            };
        },
    },

    Books: {
        author_detail: (book) => find(data.authors, {id: book.author}),
        publisher_detail: (book) => find(data.publishers, {id: book.publisher}),
    },

    Authors: {
        books: (author) => filter(data.books, {author: author.id}),
    },

    Publishers: {
        books: (publisher) => filter(data.books, {publisher: publisher.id}),
    },
};

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
