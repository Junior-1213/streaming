import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { MediaModal } from './components/MediaModal';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { TvShows } from './pages/Tv-Shows';
import { Anime } from './pages/Anime';
import { MyList } from './pages/MyList';
import { MediaDetail } from './pages/MediaDetail';
import { Search } from './pages/Search';  
import { Watch } from './pages/Watch';

function AppContent() {
  const location = useLocation();
  const isWatchPage = location.pathname.startsWith('/watch');

  return (
    <div className="min-h-screen bg-[#171717] text-white font-sans selection:bg-primary/30">
      {!isWatchPage && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv-shows" element={<TvShows />} />
          <Route path="/animes" element={<Anime />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/search" element={<Search />} />
          <Route path="/title/:type/:id" element={<MediaDetail />} />
          <Route path="/watch/:type/:id" element={<Watch />} />
        </Routes>
      </main>

      <MediaModal />

      {!isWatchPage && (
        <footer className="px-4 md:px-12 py-12 border-t border-border text-textSecondary text-sm mt-20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p>© 2025 BoltFlix. Powered by TMDB API.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
