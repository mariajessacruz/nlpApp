import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import EmotionBasedRecommendations from '../components/EmotionBasedRecommendations';
import { supabase } from '../utils/supabaseClient';

export default function Homepage() {
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    const storedEmotions = JSON.parse(localStorage.getItem('selectedEmotions')) || [];
    setSelectedEmotions(storedEmotions);

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserSession(session);

      if (session) {
        const { data, error } = await supabase
          .from('user_emotion_preferences')
          .select('emotion_id')
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error fetching user emotions:', error);
        } else if (data.length > 0) {
          const userEmotions = data.map((record) => record.emotion_id);
          setSelectedEmotions(userEmotions);
          localStorage.setItem('selectedEmotions', JSON.stringify(userEmotions)); // Sync with local storage
        }
      }
    };
    checkSession();
  }, []);

  const handleEmotionClick = async (emotionId) => {
    const emotionAlreadySelected = selectedEmotions.includes(emotionId);

    let updatedEmotions;
    if (emotionAlreadySelected) {
      updatedEmotions = selectedEmotions.filter((id) => id !== emotionId);
    } else {
      updatedEmotions = [...selectedEmotions, emotionId];
    }

    setSelectedEmotions(updatedEmotions);
    localStorage.setItem('selectedEmotions', JSON.stringify(updatedEmotions)); // Save to local storage

    if (userSession) {
      const { error } = await supabase
        .from('user_emotion_preferences')
        .upsert(
          updatedEmotions.map((emotion_id) => ({
            user_id: userSession.user.id,
            emotion_id,
          })),
          { onConflict: ['user_id', 'emotion_id'] }
        );

      if (error) {
        console.error('Error saving emotions:', error);
      }
    }
  };

  return (
    <div className="text-center bg-[#fefffb]">
      <h1 className="text-4xl md:text-6xl font-bold my-8">How are you feeling today?</h1>

      <div className="grid grid-cols-3 gap-4 my-8">
        {['Sadness', 'Joy', 'Love', 'Anger', 'Fear', 'Surprise'].map((emotion, index) => (
          <button
            key={index}
            onClick={() => handleEmotionClick(index + 1)}
            className={`py-2 px-4 rounded ${selectedEmotions.includes(index + 1) ? 'bg-green-800 text-white' : 'bg-green-200 text-green-800'}`}
          >
            {emotion}
          </button>
        ))}
      </div>

      <div className="my-8">
        <input
          type="text"
          placeholder="SEARCH BY TITLE, AUTHOR OR KEYWORD"
          className="w-full py-2 px-4 border rounded text-black placeholder-gray-500"
        />
      </div>

      {selectedEmotions.length > 0 && (
        <section className="my-8">
          <EmotionBasedRecommendations emotions={selectedEmotions} />
        </section>
      )}

      <button className="bg-black text-white py-2 px-4 rounded mt-8">
        Free Trial For 30 Days
      </button>
    </div>
  );
}
