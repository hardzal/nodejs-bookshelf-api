const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const addedBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, reading, createdAt, updatedAt
    };

    books.push(addedBook);
  
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });

        response.code(201);
        response.header('Access-Control-Allow-Origin', '*');

        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan!',
    });
    response.code(500);
    return response;
};
const getAllBookHandler = () => {};
const getBookHandler = () => {};
const updateBookHandler = () => {};
const deleteBookHandler = () => {}

module.exports = {
    addBookHandler,
    getAllBookHandler,
    getBookHandler,
    updateBookHandler,
    deleteBookHandler
};