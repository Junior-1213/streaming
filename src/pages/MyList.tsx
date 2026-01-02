import React from 'react';
import { MediaGrid } from '../components/MediaGrid';
import { useStore } from '../store/useStore';
import { Bookmark } from 'lucide-react';

export const MyList: React.FC = () => {
  const { myList } = useStore();

  return (
    <div className="pt-24 pb-20 px-4 md:px-12 min-h-screen">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">My List</h1>
      </header>
      
      {myList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center text-textSecondary mb-6">
            <Bookmark size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your list is empty</h2>
          <p className="text-textSecondary max-w-md">
            Add movies and TV shows to your list so you can easily find them later.
          </p>
        </div>
      ) : (
        <MediaGrid items={myList} />
      )}
    </div>
  );
};
