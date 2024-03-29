const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;

  if (readPage === pageCount) {
    finished = true;
  }

  const addedBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  let message = { message: 'Buku berhasil ditambahkan', status: true };
  const errorMessages = {
    ERROR_NAME: 'Gagal menambahkan buku. Mohon isi nama buku',
    ERROR_PAGECOUNT:
      'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
  };

  // requirement menyimpan buku
  if (typeof name === 'undefined' || name === '') {
    message = {
      message: errorMessages.ERROR_NAME,
      status: false,
    };
  } else if (readPage > pageCount) {
    message = {
      message: errorMessages.ERROR_PAGECOUNT,
      status: false,
    };
  }

  if (message.status) {
    // memasukkan buku
    books.push(addedBook);
  }

  // mengecek apakah id buku sudah masuk apa belum
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (!isSuccess && !message.status) {
    const response = h.response({
      status: 'fail',
      message: message.message,
    });

    response.code(400);
    return response;
  }
  const response = h.response({
    status: 'success',
    message: message.message,
    data: {
      bookId: id,
    },
  });

  response.code(201);
  response.header('Access-Control-Allow-Origin', '*');

  return response;
};

const getAllBookHandler = (request, h) => {
  if (books.length > 0) {
    //  mengecek apakah query tersedia
    if (Object.keys(request.query).length) {
      let data = [];
      let filterData = [];
      const keys = Object.keys(request.query);

      if (keys.length > 0) {
        if (keys.includes('name')) {
          filterData = books.filter((book) => book.name
            .toLowerCase().includes(request.query.name.toLowerCase()));
        } else if (keys.includes('reading')) {
          filterData = books.filter((book) => book.reading
            === Boolean(parseInt(request.query.reading, 10)));
        } else if (keys.includes('finished')) {
          filterData = books.filter((book) => book.finished
            === Boolean(parseInt(request.query.finished, 10)));
        }
      }
      data = filterData.map((book) => (
        {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }
      ));

      const response = h.response({
        status: 'success',
        message: 'Berhasil mendapatkan data buku',
        data: { books: data },
      });

      response.code(200);
      response.header('Access-Control-Allow-Origin', '*');

      return response;
    }

    const data = books.map((book) => (
      {
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }
    ));
    const response = h.response({
      status: 'success',
      message: 'Berhasil mendapatkan data buku',
      data: { books: data },
    });
    response.code(200);
    response.header('Access-Control-Allow-Origin', '*');

    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Data belum tersedia!',
  });
  response.code(200);
  return response;
};

const getBookHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBookHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const message = {
    message: 'Buku berhasil diperbarui',
    status: true,
    http_code: 200,
  };
  const errorMessages = {
    ERROR_DEFAULT: 'Gagal memperbarui buku. Id tidak ditemukan',
    ERROR_NAME: 'Gagal memperbarui buku. Mohon isi nama buku',
    ERROR_PAGECOUNT:
      'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
  };

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    // requirement menyimpan buku
    if (typeof name === 'undefined' || name === '') {
      message.message = errorMessages.ERROR_NAME;
      message.status = false;
      message.http_code = 400;
    } else if (readPage > pageCount) {
      message.message = errorMessages.ERROR_PAGECOUNT;
      message.status = false;
      message.http_code = 400;
    }

    if (message.status) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      };

      const response = h.response({
        status: 'success',
        message: message.message,
      });
      response.code(message.http_code);
      return response;
    }
  } else {
    message.message = errorMessages.ERROR_DEFAULT;
    message.status = false;
    message.http_code = 404;
  }

  const response = h.response({
    status: 'fail',
    message: message.message,
  });

  response.code(message.http_code);
  return response;
};

const deleteBookHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookHandler,
  updateBookHandler,
  deleteBookHandler,
};
