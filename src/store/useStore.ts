import { create } from 'zustand';
import { UnifiedMedia } from '../types/tmdb';

interface AppState {
  myList: UnifiedMedia[];
  selectedMedia: UnifiedMedia | null;
  isModalOpen: boolean;
  addToMyList: (media: UnifiedMedia) => void;
  removeFromMyList: (id: string) => void;
  setSelectedMedia: (media: UnifiedMedia | null) => void;
  closeModal: () => void;
}

export const useStore = create<AppState>((set) => ({
  myList: [],
  selectedMedia: null,
  isModalOpen: false,
  addToMyList: (media) => 
    set((state) => ({ 
      myList: state.myList.some(m => m.id === media.id) 
        ? state.myList 
        : [...state.myList, media] 
    })),
  removeFromMyList: (id) => 
    set((state) => ({ 
      myList: state.myList.filter((m) => m.id !== id) 
    })),
  setSelectedMedia: (media) => set({ selectedMedia: media, isModalOpen: !!media }),
  closeModal: () => set({ isModalOpen: false, selectedMedia: null }),
}));
