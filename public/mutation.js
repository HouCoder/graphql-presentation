const graph = graphql('/graphql', {
    asJSON: true,
});

$('.js-add-book').on('click', (e) => {
    e.preventDefault();

    const bookName = $('#book_name').val();

    graph(`
        mutation {
            addBook(name:"${bookName}") {
                id
                message
            }
        }
    `)().then((res) => {
        if (res.errors) {
            alert(res.errors);
        } else {
            alert(`添加成功 - ${res.addBook.id}`);
        }
    });
});
