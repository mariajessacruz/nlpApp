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

export async function fetchBooksBasedOnEmotion(emotionIds) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const emotionQueries = emotionIds.map(id => `subject:${id}`).join('+');
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${emotionQueries}&orderBy=relevance&maxResults=20&key=${apiKey}`
    );
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching books based on emotion:', error);
    return [];
  }
}

export async function fetchBooksBasedOnSimilarUsers(userId) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const response = await fetch(`/api/get_books_by_emotion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        emotion_ids: [], // This should be filled with the emotions of similar users from the backend
      }),
    });

    const data = await response.json();

    if (data.success) {
      const bookPromises = data.books.map(async (bookId) => {
        const bookResponse = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
            bookId
          )}&key=${apiKey}`
        );
        const bookData = await bookResponse.json();
        return bookData.items ? bookData.items[0] : null;
      });

      const books = await Promise.all(bookPromises);
      return books.filter(book => book !== null);
    }

    return [];
  } catch (error) {
    console.error('Error fetching books based on similar users:', error);
    return [];
  }
}
