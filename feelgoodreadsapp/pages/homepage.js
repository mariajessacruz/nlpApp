// pages/homepage.js
import Layout from '../components/Layout';

export default function Homepage() {
  return (
      <div className="flex-grow w-full max-w-6xl px-8 py-4">
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Trending Books (View All)</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Replace with dynamic content */}
            <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
            <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
            <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Match Your Mood</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-200 p-4 rounded-lg">Sadness</div>
            <div className="bg-green-200 p-4 rounded-lg">Joy</div>
            <div className="bg-green-200 p-4 rounded-lg">Love</div>
            <div className="bg-green-200 p-4 rounded-lg">Fear</div>
            <div className="bg-green-200 p-4 rounded-lg">Surprise</div>
            <div className="bg-green-200 p-4 rounded-lg">Anger</div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Browse By Genre (View All)</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-200 p-4 rounded-lg">Comics & Graphic Novels</div>
            <div className="bg-green-200 p-4 rounded-lg">Fiction</div>
            <div className="bg-green-200 p-4 rounded-lg">Poetry</div>
            <div className="bg-green-200 p-4 rounded-lg">Biography & Autobiography</div>
            <div className="bg-green-200 p-4 rounded-lg">Religion</div>
            <div className="bg-green-200 p-4 rounded-lg">History</div>
          </div>
        </section>
      </div>
  );
}
