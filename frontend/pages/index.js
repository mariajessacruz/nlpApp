import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import PopularBooks from '../components/PopularBooks';
import { fetchPopularBooks } from '../utils/googleBooksApi';

export default function Home() {
  const [popularBooks, setPopularBooks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch popular books on initial load
    const loadPopularBooks = async () => {
      const books = await fetchPopularBooks();
      setPopularBooks(books);
    };
    loadPopularBooks();
  }, []);

  const handleEmotionClick = async (emotionId) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      // User is not logged in, save emotion in localStorage and redirect to login
      localStorage.setItem('selectedEmotion', JSON.stringify([emotionId]));
      router.push('/login'); // Redirect to login page
    } else {
      // User is logged in, save emotion and redirect to homepage
      try {
        // Save the selected emotion to Supabase
        const { error } = await supabase
          .from('user_emotion_preferences')
          .insert([{ user_id: session.user.id, emotion_id: emotionId }]);

        if (error) {
          console.error('Error saving emotion to Supabase:', error);
          return;
        }

        // Update local storage with the selected emotion
        localStorage.setItem('selectedEmotion', JSON.stringify([emotionId]));

        // Redirect to the homepage
        router.push('/homepage');
      } catch (err) {
        console.error('Error during emotion saving process:', err);
      }
    }
  };

  return (
    <div className="text-center bg-[#fefffb]">
      <h1 className="text-3xl md:text-5xl font-bold my-8">How are you feeling today?</h1>

      {/* Emotion Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-8">
        {[{id: 0, name: 'Sadness'}, {id: 1, name: 'Joy'}, {id: 2, name: 'Love'}, {id: 3, name: 'Anger'}, {id: 4, name: 'Fear'}, {id: 5, name: 'Surprise'}].map((emotion) => (
          <button
            key={emotion.id}
            onClick={() => handleEmotionClick(emotion.id)}
            className="bg-green-200 text-green-800 py-2 px-4 rounded"
          >
            {emotion.name}
          </button>
        ))}
      </div>

      {/* Popular Books Section */}
      <section className="my-8">
        <PopularBooks books={popularBooks} />
      </section>
    </div>
  );
}
