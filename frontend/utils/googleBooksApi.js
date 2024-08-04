// frontend/utils/googleBooksApi.js

// Function to fetch books by query
export async function fetchBooksByQuery(query) {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`);
  const data = await response.json();
  return data.items || [];
}

// Function to fetch popular books
export async function fetchPopularBooks() {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:popular&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`);
  const data = await response.json();
  return data.items || [];
}
