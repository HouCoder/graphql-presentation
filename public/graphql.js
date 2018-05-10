const graph = graphql('/graphql', {
    asJSON: true,
});
const books = graph(`
    query {
        books {
            id
            name
            publishing_data
            price
            author_detail {
                name
            }
            length
            publisher_detail {
                name
                website
            }
        }
    }
`);

const template = `{{#books}}
    <tr>
        <th scope="row">{{id}}</th>
        <td>{{name}}</td>
        <td>{{publishing_data}}</td>
        <td>{{price}}</td>
        <td>{{author_detail.name}}</td>
        <td>{{length}}</td>
        <td>
            <a href="{{{publisher_detail.website}}}">
                {{publisher_detail.name}}
            </a>
        </td>
    </tr>
{{/books}}`;

const $tbody = document.createElement('tbody');

books().then(({ books }) => {
    $tbody.innerHTML = Mustache.render(template, {books});
    document.querySelector('#table-content').appendChild($tbody);
});
