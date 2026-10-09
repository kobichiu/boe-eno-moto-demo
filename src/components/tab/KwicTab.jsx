import React, { useState, useRef, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { TEXTS, searchKwic } from "../../lib/corpus";

// Not a text: an extra entry in the list that selects every text at once.
const ALL_TEXTS = 'all';
const TEXT_OPTIONS = [...TEXTS, { id: ALL_TEXTS, title: 'Corpus inteiro' }];

const KwicTab = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [isCaseSensitive, setIsCaseSensitive] = useState(true);
    const [isContextDropdownOpen, setIsContextDropdownOpen] = useState(false);
    const [isTextDropdownOpen, setIsTextDropdownOpen] = useState(false);
    const [selectedTexts, setSelectedTexts] = useState([]);
    const textDropdownRef = useRef(null);
    const [context, setContext] = useState(0);
    const contextDropdownRef = useRef(null);

    // Results state
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const contextOption = [1, 2, 3, 4, 5, 6, 7, 8];

    const toggleTextDropdown = () => {
        setIsTextDropdownOpen(!isTextDropdownOpen);
    };

    const toggleContextDropdown = () => {
        setIsContextDropdownOpen(!isContextDropdownOpen);
    };

    const handleTextSelection = (id) => {
        // "Corpus inteiro" toggles between every text and none
        if (id === ALL_TEXTS) {
            setSelectedTexts(selectedTexts.length === TEXTS.length ? [] : TEXTS.map(text => text.id));
            return;
        }

        // Normal selection behavior for other options
        setSelectedTexts(prev => {
            if (prev.includes(id)) {
                return prev.filter(textId => textId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setHasSearched(true);
        try {
            setResults(await searchKwic({
                term: searchTerm,
                textIds: selectedTexts,
                context,
                caseSensitive: isCaseSensitive,
            }));
        } catch {
            setResults([]);
            setError('Erro ao carregar os textos');
        } finally {
            setLoading(false);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (textDropdownRef.current && !textDropdownRef.current.contains(event.target)) {
                setIsTextDropdownOpen(false);
            }
            if (contextDropdownRef.current && !contextDropdownRef.current.contains(event.target)) {
                setIsContextDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-full h-auto">
            <title>Corpus da Língua Bororo | (Demo) Boe Eno Moto</title>
            { /* Kwic search bar */}
            <div className="w-full p-2 bg-sky-100">
                <div className="flex items-center justify-center gap-6">
                    {/* Search Term insert */}
                    <input
                        type="search"
                        placeholder="Buscar uma palavra"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="outline-none bg-white text-gray-600 text-md px-4 py-2 min-w-[300px] max-w-[400px] rounded-lg"
                    />

                    {/* Text selection */}
                    <div className="relative" ref={textDropdownRef}>
                        <button
                            type="button"
                            onClick={toggleTextDropdown}
                            className="relative px-4 py-2 min-w-[280px] max-w-[400px] flex justify-between items-center text-start text-sm bg-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <span className="block truncate">
                                {selectedTexts.length === 0
                                    ? 'Selecione o texto'
                                    : `${selectedTexts.length} texto${selectedTexts.length > 1 ? 's' : ''} selecionado${selectedTexts.length > 1 ? 's' : ''}`}
                            </span>
                            <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                {isTextDropdownOpen ? (
                                    <IoIosArrowUp className="w-4 h-4" />
                                ) : (
                                    <IoIosArrowDown className="w-4 h-4" />
                                )}
                            </div>
                        </button>

                        {isTextDropdownOpen && (
                            <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                                <ul className="py-1">
                                    {TEXT_OPTIONS.map(option => (
                                        <li key={option.id}>
                                            <button
                                                type="button"
                                                className="flex justify-between items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleTextSelection(option.id)}
                                            >
                                                <span>{option.title}</span>
                                                {selectedTexts.includes(option.id) && (
                                                    <svg className="w-3.5 h-3.5 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Context */}
                    <div className="relative" ref={contextDropdownRef}>
                        <button
                            type="button"
                            onClick={toggleContextDropdown}
                            className="relative px-4 py-2 min-w-[200px] max-w-[300px] flex justify-between items-center text-start text-sm bg-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <span className="block truncate">
                                {context === 0 ? "Contexto" : `${context} contexto${context === 1 ? '' : 's'}`}
                            </span>
                            <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                {isContextDropdownOpen ? (
                                    <IoIosArrowDown className="w-4 h-4" />
                                ) : (
                                    <IoIosArrowUp className="w-4 h-4" />
                                )}
                            </div>
                        </button>

                        {isContextDropdownOpen && (
                            <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                                <ul className="py-1">
                                    {contextOption.map(option => (
                                        <li key={option}>
                                            <button
                                                type="button"
                                                className="flex justify-between items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setContext(option);
                                                    setIsContextDropdownOpen(false);
                                                }}
                                            >
                                                <span>{option}</span>
                                                {context === option && (
                                                    <svg className="w-3.5 h-3.5 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Case Sensitive Toggle */}
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isCaseSensitive}
                            onChange={() => setIsCaseSensitive(!isCaseSensitive)}
                        />
                        <div className={`relative w-11 h-6 overflow-hidden rounded-full
                            peer peer-focus:ring-4 peer-focus:ring-sky-200
                            ${isCaseSensitive ? 'bg-sky-600' : 'bg-gray-200'}
                            peer-checked:after:translate-x-5
                            rtl:peer-checked:after:-translate-x-5
                            peer-checked:after:border-white
                            after:content-[''] after:absolute after:top-0.5 after:left-0.5
                            after:bg-white after:border-gray-300 after:border
                            after:rounded-full after:h-5 after:w-5
                            after:transition-all`}>
                        </div>
                        <span className="ms-3 text-base font-medium text-gray-900">Sensível a maiúsculas</span>
                    </label>

                    {/* Search button */}
                    <button
                        type="button"
                        aria-label="Buscar"
                        onClick={handleSearch}
                        disabled={searchTerm === '' || context === 0 || selectedTexts.length === 0}
                        className={`transition-all text-white text-md rounded-full p-2 transition-all duration-500 ${
                            searchTerm === '' || context === 0 || selectedTexts.length === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-cyan-700'
                        }`}
                    >
                        <IoSearchOutline className="w-5 h-5" />
                    </button>
                </div>
            </div>
            { /* Result showing div */}
            <div className="w-full p-4 pb-0">
                { loading && (
                    <div className="flex p-8 items-center justify-center min-h-64">
                        <div className="animate-spin rounded-full size-32 border-b-2 border-blue-600"></div>
                    </div>
                )}
                { error && (
                    <div className="flex p-4 items-center justify-center">
                        <span className="text-red-400 text-xl text-center">{error}</span>
                    </div>
                )}
                { /* when a valid search returns no results */}
                { hasSearched && !loading && !error && results.length === 0 && (
                    <div className="flex p-4 items-center justify-center">
                        <span className="text-red-400 text-xl text-center">
                            Nenhum resultado correspondente, pesquise novamente.
                        </span>
                    </div>
                )}
                { /* when a valid search returns results */}
                { !loading && !error && results.length > 0 && (
                    <div className="w-full">
                        <div className="w-full grid grid-cols-5 gap-2 border-b pb-2 mb-2">
                            <div className="font-bold text-center">Índice</div>
                            <div className="font-bold text-center">Texto</div>
                            <div className="font-bold text-right">Contexto Esquerdo</div>
                            <div className="font-bold text-center">Nó</div>
                            <div className="font-bold text-left">Contexto Direito</div>
                        </div>
                        {results.map((result, index) => (
                            <div key={index} className={`w-full grid grid-cols-5 gap-2 py-2 ${index < results.length - 1 ? 'border-b' : ''}`}>
                                <div className="text-center">{index + 1}</div>
                                <div className="text-center">{result.textTitle}</div>
                                <div className="text-right">{result.leftContext.join(' ')}</div>
                                <div className="text-center font-bold">{result.keyword}</div>
                                <div className="text-left">{result.rightContext.join(' ')}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KwicTab;