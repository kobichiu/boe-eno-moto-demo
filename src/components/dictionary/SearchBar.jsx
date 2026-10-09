import React, { useEffect, useRef, useState } from 'react';
import { loadDictionary, suggestEntries } from '../../lib/dictionary';

const SearchBar = ({ value, onChange, onSubmit }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loadFailed, setLoadFailed] = useState(false);
    const containerRef = useRef(null);

    // Warm the cache so the first keystroke does not wait for the download.
    useEffect(() => {
        loadDictionary().catch(() => setLoadFailed(true));
    }, []);

    useEffect(() => {
        const dismiss = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };

        document.addEventListener('mousedown', dismiss);
        return () => document.removeEventListener('mousedown', dismiss);
    }, []);

    const handleChange = async (event) => {
        const term = event.target.value;
        onChange(term);

        try {
            setSuggestions(await suggestEntries(term));
            setLoadFailed(false);
        } catch {
            setSuggestions([]);
            setLoadFailed(true);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key !== 'Enter') return;
        setSuggestions([]);
        onSubmit();
    };

    const handleSubmit = () => {
        setSuggestions([]);
        onSubmit();
    };

    const showError = loadFailed && value.trim().length > 0;

    return (
        <div
            className="flex overflow-visible absolute w-[85%] sm:w-[75%] md:w-[65%] lg:w-[55%] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white border-4 border-transparent rounded-full shadow-2xl shadow-amber-600 z-10"
            ref={containerRef}
        >
            <input
                type="search"
                placeholder="Buscar uma palavra"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="w-full rounded-l-full outline-none bg-white text-gray-600 text-lg md:text-lg lg:text-xl px-4"
            />
            <button
                type="button"
                onClick={handleSubmit}
                disabled={!value}
                className="bg-cyan-700 hover:bg-lime-600 transition-all text-white text-md md:text-lg lg:text-xl rounded-full px-5 py-3 transition-all duration-500"
            >
                Buscar
            </button>

            {(showError || suggestions.length > 0) && (
                <ul className="absolute left-0 right-0 top-[calc(100%+0.5rem)] bg-white rounded-lg shadow-lg z-50">
                    {showError ? (
                        <li className="px-4 py-2 text-sm text-gray-500">
                            Não foi possível carregar o dicionário.
                        </li>
                    ) : (
                        suggestions.map((entry) => (
                            <li
                                key={entry}
                                onClick={() => {
                                    onChange(entry);
                                    setSuggestions([]);
                                }}
                                className="px-4 py-2 hover:bg-gray-100 hover:rounded-lg hover:underline hover:text-indigo-700 cursor-pointer"
                            >
                                {entry}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
