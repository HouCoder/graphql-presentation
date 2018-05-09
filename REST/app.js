const baseURL = 'http://127.0.0.1:3001'

function getBooks() {
    return axios.get(baseURL + '/books');
}

function getAuthors() {
    return axios.get(baseURL + '/authors');
}

function getPublishers() {
    return axios.get(baseURL + '/publishers');
}

axios.all([getBooks(), getAuthors(), getPublishers()])
    .then(axios.spread((books, authors, publishers) => {
        // Prepare template date
        const booksList = books.data;
        const authorsList = authors.data;
        const publishersList = publishers.data;

        booksList.forEach((book) => {
            book.author_name = authorsList.find((author) => author.id === book.author).name;
            book.publisher_name = publishersList.find((publisher) => publisher.id === book.publisher).name;
            book.publisher_website = publishersList.find((publisher) => publisher.id === book.publisher).website;
        });

        const template = `{{#books}}
            <tr>
                <th scope="row">{{id}}</th>
                <td>{{name}}</td>
                <td>{{publishing_data}}</td>
                <td>{{price}}</td>
                <td>{{author_name}}</td>
                <td>{{length}}</td>
                <td>
                    <a href="{{{publisher_website}}}">
                        {{publisher_name}}
                    </a>
                </td>
            </tr>
        {{/books}}`;

        const $tbody = document.createElement('tbody');

        $tbody.innerHTML = Mustache.render(template, {books: booksList});
        document.querySelector('#table-content').appendChild($tbody);
    }));
