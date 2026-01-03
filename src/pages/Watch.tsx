import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings, SkipBack, SkipForward, List } from 'lucide-react';
import { tmdbService } from '../services/tmdb';

export const Watch: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<any>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedServer, setSelectedServer] = useState<'default' | 'torrent' | 'agg'>('default');
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      if (!id || !type) return;
      try {
        const data = await tmdbService.fetchMediaDetails(type as 'movie' | 'tv', id);
        setDetails(data);
      } catch (error) {
        console.error('Error loading details:', error);
      }
    };
    loadDetails();
  }, [id, type]);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Show controls if mouse is in top 100px or if episodes sidebar is open
      if (e.clientY < 100 || showEpisodes) {
        resetTimeout();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    resetTimeout();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [showEpisodes]);

  const getStreamUrl = () => {
    const serverPaths = {
      default: '/embed',
      torrent: '/embed/torrent',
      agg: '/embed/agg'
    };
    
    const baseUrl = `https://rivestream.org${serverPaths[selectedServer]}`;
    const extraParams = selectedServer === 'default' ? '&server=27' : '';
    
    if (type === 'movie') {
      return `${baseUrl}?type=movie&id=${id}${extraParams}`;
    } else {
      return `${baseUrl}?type=tv&id=${id}&season=${selectedSeason}&episode=${selectedEpisode}${extraParams}`;
    }
  };

  const goToPreviousEpisode = () => {
    if (selectedEpisode > 1) {
      setSelectedEpisode(selectedEpisode - 1);
    } else if (selectedSeason > 1) {
      setSelectedSeason(selectedSeason - 1);
      setSelectedEpisode(24);
    }
  };

  const goToNextEpisode = () => {
    if (selectedEpisode < 24) {
      setSelectedEpisode(selectedEpisode + 1);
    } else if (details?.number_of_seasons && selectedSeason < details.number_of_seasons) {
      setSelectedSeason(selectedSeason + 1);
      setSelectedEpisode(1);
    }
  };

  if (!details) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col relative">
      {/* Top Bar - Auto-hide */}
      <div 
        className={`absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4 transition-transform duration-300 ${
          showControls ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/title/${type}/${id}`)}
            className="flex items-center gap-2 text-white hover:text-primary transition-colors"
          >
            <ChevronLeft size={24} />
            <span className="font-bold">Back</span>
          </button>

          <div className="flex items-center gap-4">
            {/* TV Show Episode Navigation */}
            {type === 'tv' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousEpisode}
                  disabled={selectedSeason === 1 && selectedEpisode === 1}
                  className="p-2 bg-black/60 rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md border border-white/10"
                  title="Previous Episode"
                >
                  <SkipBack size={18} />
                </button>
                
                <div className="flex items-center gap-2 px-3 py-2 bg-black/60 rounded-lg backdrop-blur-md border border-white/10">
                  <span className="text-sm font-bold text-primary">S{selectedSeason}</span>
                  <span className="text-xs text-textSecondary">·</span>
                  <span className="text-sm font-bold">E{selectedEpisode}</span>
                </div>

                <button
                  onClick={goToNextEpisode}
                  className="p-2 bg-black/60 rounded-lg hover:bg-black/80 transition-colors backdrop-blur-md border border-white/10"
                  title="Next Episode"
                >
                  <SkipForward size={18} />
                </button>
              </div>
            )}

            {/* Server Selection */}
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-white" />
              <select
                value={selectedServer}
                onChange={(e) => setSelectedServer(e.target.value as any)}
                className="px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary transition-colors backdrop-blur-md"
              >
                <option value="agg">Aggregator</option>
                <option value="default">Default</option>
                <option value="torrent">Torrent</option>
              </select>
            </div>

            {/* Episode List Toggle for TV Shows */}
            {type === 'tv' && (
              <button
                onClick={() => setShowEpisodes(!showEpisodes)}
                className="flex items-center gap-2 px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white hover:bg-black/80 transition-colors backdrop-blur-md"
              >
                <List size={18} />
                <span className="text-sm font-bold">Episodes</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="flex-1 relative">
        <iframe
          src={getStreamUrl()}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={`${details.title || details.name} Player`}
        />
      </div>

      {/* Episode List Sidebar */}
      {type === 'tv' && showEpisodes && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-surface/95 backdrop-blur-md border-l border-border overflow-y-auto z-40">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Episodes</h3>
              <button
                onClick={() => setShowEpisodes(false)}
                className="text-textSecondary hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Season Selector */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-primary mb-2">Season</label>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              >
                {[...Array(details.number_of_seasons || 10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Season {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              {[...Array(24)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => {
                    setSelectedEpisode(i + 1);
                    setShowEpisodes(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedEpisode === i + 1
                      ? 'bg-primary text-white'
                      : 'bg-background hover:bg-surface'
                  }`}
                >
                  <div className="font-bold">Episode {i + 1}</div>
                  <div className="text-xs text-textSecondary">Season {selectedSeason}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
