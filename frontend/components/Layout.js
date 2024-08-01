import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import Header from './Header';
import HomeHeader from './HomeHeader';
import UserProfileHeader from './UserProfileHeader';
import Footer from './Footer';

export default function Layout({ children }) {
  const [session, setSession] = useState(null);
  const router = useRouter();
  const isHome = router.pathname === '/';

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
      {session ? (
        <UserProfileHeader user={session.user} />
      ) : (
        isHome ? <HomeHeader /> : <Header />
      )}
      <main className="flex-grow bg-[#F8FFED] container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}