import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Loader2, Sparkles } from 'lucide-react';
import { wayfarerApi } from '../../services/api';
import { DestinationSearchResult } from '../../types';

interface DestinationAutocompleteProps {
  placeholder?: string;
  className?: string;
  onSelect?: (dest: DestinationSearchResult) => void;
}

export function DestinationAutocomplete({
  placeholder = "Where to? (e.g. Mumbai, Tokyo, Jaipur, Amalfi, Paris...)",
  className = '',
  onSelect
}: DestinationAutocompleteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DestinationSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search query
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await wayfarerApi.searchDestinations(query.trim());
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.warn('Autocomplete fetch failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (dest: DestinationSearchResult) => {
    setIsOpen(false);
    setQuery(`${dest.name}, ${dest.country}`);
    if (onSelect) {
      onSelect(dest);
    } else {
      navigate(`/destination/${dest.countryCode.toLowerCase()}/${dest.geoId}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      handleSelect(results[0]);
    } else if (query.trim()) {
      navigate(`/plan?destination=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-[#6D28D9] shrink-0 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder={placeholder}
            className="w-full pl-12 pr-10 py-3.5 text-sm bg-white text-[#1F1637] placeholder:text-[#6B6385] rounded-2xl border border-[#EDE9FE] focus:outline-none focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9] shadow-sm"
          />
          {isLoading && (
            <div className="absolute right-3.5">
              <Loader2 className="w-4 h-4 text-[#6D28D9] animate-spin" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="px-6 py-3.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold rounded-2xl transition-all shadow-wayfarer whitespace-nowrap"
        >
          Explore
        </button>
      </form>

      {/* Dropdown Results */}
      {isOpen && (results.length > 0 || (query.length >= 2 && !isLoading)) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-wayfarer-lg border border-[#EDE9FE] py-2 z-50 max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            results.map((dest) => (
              <button
                key={dest.geoId}
                type="button"
                onClick={() => handleSelect(dest)}
                className="w-full text-left px-4 py-3 hover:bg-[#F5F3FF] transition-colors flex items-center justify-between group border-b border-[#EDE9FE]/50 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl shrink-0" role="img" aria-label={dest.country}>
                    {dest.flag}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#1F1637] group-hover:text-[#6D28D9] transition-colors">
                      {dest.name}
                    </p>
                    <p className="text-[11px] text-[#6B6385]">
                      {dest.region ? `${dest.region}, ` : ''}{dest.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-semibold text-[#6D28D9] bg-[#F5F3FF] px-2 py-0.5 rounded-full border border-[#EDE9FE]">
                    {dest.type}
                  </span>
                  <MapPin className="w-3.5 h-3.5 text-[#6B6385] group-hover:text-[#6D28D9]" />
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-[#6B6385]">
              <p>No worldwide destinations found matching "{query}".</p>
              <button
                onClick={() => navigate(`/plan?destination=${encodeURIComponent(query)}`)}
                className="mt-2 text-[#6D28D9] font-semibold hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plan custom AI trip to "{query}"</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
