import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import EmotionBasedRecommendations from '../components/EmotionBasedRecommendations';
import { supabase } from '../utils/supabaseClient';

export default function Homepage() {
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [userSession, setUserSession] = useState(null);

  // Load emotions from local storage on initial load
  useEffect(() => {
    const storedEmotions = JSON.parse(localStorage.getItem('selectedEmotions')) || [];
    setSelectedEmotions(storedEmotions);

    // Check session and load any saved emotions from Supabase
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

    // Save the selected emotions in Supabase if user is logged in
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
        <h1 className="text-3xl md:text-5xl font-bold my-8">Welcome Back!</h1>

        {/* Emotion-Based Recommendations Section */}
        {selectedEmotions.length > 0 && (
          <section className="my-8">
            <EmotionBasedRecommendations emotions={selectedEmotions} />
          </section>
        )}

        {/* Emotion Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-8">
          {[{id: 1, name: 'Sadness'}, {id: 2, name: 'Joy'}, {id: 3, name: 'Love'}, {id: 4, name: 'Anger'}, {id: 5, name: 'Fear'}, {id: 6, name: 'Surprise'}].map((emotion) => (
            <button
              key={emotion.id}
              onClick={() => handleEmotionClick(emotion.id)}
              className={`py-2 px-4 rounded ${selectedEmotions.includes(emotion.id) ? 'bg-green-800 text-white' : 'bg-green-200 text-green-800'}`}
            >
              {emotion.name}
            </button>
          ))}
        </div>
      </div>
  );
}
