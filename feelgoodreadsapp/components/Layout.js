// components/Layout.js
import { useRouter } from 'next/router';
import Header from './Header';
import HomeHeader from './HomeHeader';
import Footer from './Footer';

export default function Layout({ children }) {
  const router = useRouter();
  const isHome = router.pathname === '/';
  console.log('isHome value in Layout:', isHome);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="text-center py-4 bg-gray-100">
        <p>isHome value in Layout: {isHome ? 'true' : 'false'}</p>
      </div>
      {isHome ? <HomeHeader /> : <Header />}
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
