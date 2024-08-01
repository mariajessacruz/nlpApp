// pages/index.js
import React from 'react';
import Layout from '../components/Layout';

export default function Home() {
  return (
      <div className="text-center bg-[#fefffb]">
        <h1 className="text-3xl md:text-5xl font-bold my-8">How are you feeling today?</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-8">
          <button className="bg-green-200 text-green-800 py-2 px-4 rounded">Sadness</button>
          <button className="bg-green-200 text-green-800 py-2 px-4 rounded">Joy</button>
          <button className="bg-green-200 text-green-800 py-2 px-4 rounded">Love</button>
          <button className="bg-green-200 text-green-800 py-2 px-4 rounded">Anger</button>
          <button className="bg-green-200 text-green-800 py-2 px-4 rounded">Fear</button>
          <button className="bg-green-200 text-green-800 py-2 px-4 rounded">Surprise</button>
        </div>
        <div className="my-8">
          <input
            type="text"
            placeholder="Search by title, author or keyword"
            className="w-full max-w-lg px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <section className="my-8">
          <h2 className="text-2xl font-bold mb-4">Discover Your Perfect Match Book</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            <img src="/path/to/book1.jpg" alt="Book 1" />
            <img src="/path/to/book2.jpg" alt="Book 2" />
            {/* Add more books as needed */}
          </div>
        </section>
        <div className="my-8">
          <button className="bg-green-700 text-white py-2 px-4 rounded">Free Trial For 30 Days</button>
        </div>
      </div>
  );
}
