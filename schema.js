import { makeExecutableSchema } from 'graphql-tools';
import { find, filter } from 'lodash';

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./REST/data.json', 'utf8'));

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

    type Query {
        books: [Books]
    }
`;

function getBooks() {
    return data.books;
}

const resolvers = {
    Query: {
        books: getBooks,
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
