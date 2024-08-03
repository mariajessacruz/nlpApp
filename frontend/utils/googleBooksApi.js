// frontend/utils/googleBooksApi.js

export async function fetchPopularBooks() {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=best+seller&orderBy=relevance&maxResults=20&key=${apiKey}`
      );
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching popular books:', error);
      return [];
    }
  }
  