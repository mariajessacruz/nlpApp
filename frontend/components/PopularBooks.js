// frontend/components/PopularBooks.js

import React, { useEffect, useState } from 'react';
import { fetchPopularBooks } from '../utils/googleBooksApi';

export default function PopularBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function loadBooks() {
      const popularBooks = await fetchPopularBooks();
      setBooks(popularBooks);
    }
    loadBooks();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Popular Books</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-8">
        {books.map((book, index) => (
          <div key={index} className="bg-gray-200 text-gray-800 py-2 px-4 rounded">
            <img src={book.volumeInfo.imageLinks?.thumbnail || '/default-book.png'} alt={book.volumeInfo.title} />
            <h3>{book.volumeInfo.title}</h3>
            <p>{book.volumeInfo.authors?.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
