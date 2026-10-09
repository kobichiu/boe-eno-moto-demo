import { useState, useRef, useEffect, useCallback } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { TEXTS, loadText, highlightText, escapeHtml } from "../../lib/corpus";

const TextTab = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [searchMode, setSearchMode] = useState(null);
    const [isCaseSensitive, setIsCaseSensitive] = useState(true);
    const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
    const modeDropdownRef = useRef(null);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [matchesAmount, setMatchesAmount] = useState(0);

    // Results state
    const [result, setResult] = useState(null);
    // The first text is requested as soon as the tab mounts, so the page starts out in its loading state.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentText, setCurrentText] = useState(TEXTS[0].id);

    // Clicking quickly through the list must not let a slow, older download overwrite the newest.
    const latestRequest = useRef(null);

    // Only downloads and stores the text. State is set from the promise callbacks, never synchronously,
    // which is what lets the mount effect call it without cascading renders.
    const fetchText = useCallback((textId) => {
        latestRequest.current = textId;

        loadText(textId)
            .then(data => {
                if (latestRequest.current !== textId) return;
                setResult(data);
                setError(null);
            })
            .catch(() => {
                if (latestRequest.current !== textId) return;
                setError('Erro ao carregar o texto');
                setResult(null);
            })
            .finally(() => {
                if (latestRequest.current === textId) setLoading(false);
            });
    }, []);

    const handleTextClick = (textId) => {
        setCurrentText(textId);
        setLoading(true);
        setHasSearched(false);
        setCurrentMatchIndex(0);
        setMatchesAmount(0);

        fetchText(textId);
    };

    const handleTextSearch = () => {
        try {
            const highlighted = highlightText(result.text_content, searchTerm, {
                mode: searchMode,
                caseSensitive: isCaseSensitive,
            });

            setHasSearched(true);
            setMatchesAmount(highlighted ? highlighted.count : 0);
            // A new search starts at the first match again, which is where the page scrolls to.
            setCurrentMatchIndex(0);
            setResult(prevResult => ({
                ...prevResult,
                highlighted_text: highlighted ? highlighted.html : null
            }));

            if (highlighted) {
                // Wait for the DOM to update before scrolling
                setTimeout(() => {
                    document.querySelector('mark')?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 100);
            }
        } catch {
            setError('Erro ao destacar o texto');
        }
    };

    const browseMatches = (direction) => {
        const matches = document.querySelectorAll("mark");

        if (direction === 'next' && currentMatchIndex < matches.length - 1) {
            const nextIndex = currentMatchIndex + 1;
            const targetMark = matches[nextIndex];

            targetMark?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            setCurrentMatchIndex(nextIndex);
        } else if (direction === 'prev' && currentMatchIndex > 0) {
            const lastIndex = currentMatchIndex - 1;
            const targetMark = matches[lastIndex];

            targetMark?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            setCurrentMatchIndex(lastIndex);
        }
    };

    const toggleModeDropdown = () => {
        setIsModeDropdownOpen(!isModeDropdownOpen);
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        // Load the first text by default
        fetchText(TEXTS[0].id);
    }, [fetchText]);

    // const scrollToTop = () => {
    //     window.scrollTo({
    //         top: 0,
    //         behavior: "smooth"
    //     });
    // };

    return (
        <div className="w-full h-screen flex flex-col">
            <title>Corpus da Língua Bororo | (Demo) Boe Eno Moto</title>
            <div className="w-full p-2 bg-sky-100">
                <div className="flex items-center justify-center gap-4">
                    {/* Search Term insert */}
                    <input
                        type="search"
                        placeholder="Buscar uma palavra"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="outline-none bg-white text-gray-600 text-md px-4 py-2 min-w-[300px] max-w-[400px] rounded-lg"
                    />

                    {/* Search mode */}
                    <div className="relative" ref={modeDropdownRef}>
                        <button
                            type="button"
                            onClick={toggleModeDropdown}
                            className="relative px-4 py-2 min-w-[350px] max-w-[400px] flex justify-between items-center text-start text-sm bg-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                             <span className="block truncate">
                                Modo de busca
                                {searchMode === 'exact' 
                                    ? ' - Busca exata por palavra' 
                                    : searchMode === 'contain' 
                                        ? ' - Contém palavra' 
                                        : ''
                                }
                            </span>
                            <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                {isModeDropdownOpen ? (
                                    <IoIosArrowUp className="w-4 h-4" />
                                ) : (
                                    <IoIosArrowDown className="w-4 h-4" />
                                )}
                            </div>
                        </button>

                        {isModeDropdownOpen && (
                            <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                                <ul className="py-1">
                                <li key="exact">
                                        <button
                                            type="button"
                                            className="flex justify-between items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setSearchMode('exact');
                                                setIsModeDropdownOpen(false);
                                            }}
                                        >
                                            <span>Busca exata por palavra</span>
                                            {searchMode === 'exact' && (
                                                <svg className="w-3.5 h-3.5 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                        </button>
                                    </li>
                                    <li key="contain">
                                        <button
                                            type="button"
                                            className="flex justify-between items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setSearchMode('contain');
                                                setIsModeDropdownOpen(false);
                                            }}
                                        >
                                            <span>Contém palavra</span>
                                            {searchMode === 'contain' && (
                                                <svg className="w-3.5 h-3.5 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                            
                                        </button>
                                    </li>
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
                        onClick={handleTextSearch}
                        disabled={!searchTerm || !searchMode}
                        className={`${
                            !searchTerm || !searchMode 
                                ? 'bg-gray-400' 
                                : 'bg-blue-500 hover:bg-cyan-700'
                        } text-white text-md rounded-full p-2 transition-all duration-500`}
                    >
                        <IoSearchOutline className="w-5 h-5" />
                    </button>
                </div>
            </div>
                <div className="w-full flex flex-row">
                    <div className="w-[20%] pt-4">
                        <h2 className="p-4 font-light text-gray-500/75 text-left uppercase">Textos</h2>
                        <hr className="border-gray-300 mx-4 pb-2" />
                        <div className="flex flex-col">
                            {TEXTS.map((option) => (
                                <button 
                                    key={option.id}
                                    className={`p-2 pl-4 cursor-pointer text-md text-gray-800 text-left
                                        ${currentText === option.id
                                            ? 'text-sky-900 font-bold duration-300 transition-discrete' : ''
                                        }`}
                                    onClick={() => handleTextClick(option.id)}
                                >
                                    {option.title}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Fixed height, so the reading panel is the same size before and after a search. */}
                    <div className="w-[80%] p-4 flex flex-col gap-4 overflow-hidden h-[calc(100vh-168px)] md:h-[calc(100vh-148px)] lg:h-[calc(100vh-128px)] xl:h-[calc(100vh-108px)] 2xl:h-[calc(100vh-88px)]">
                        {/* Status bar: always present once a text is shown, so the panel below never changes size. */}
                        {!loading && !error && result && (
                            <div className="shrink-0 h-14 px-6 text-md font-normal font-mono text-gray-600 flex border rounded-lg justify-between items-center">
                                <div className="truncate">
                                    {!hasSearched && (
                                        <span>{TEXTS.find(opt => opt.id === currentText)?.title}</span>
                                    )}
                                    {hasSearched && matchesAmount === 0 && (
                                        <span>Nenhuma ocorrência de "{searchTerm}" encontrada </span>
                                    )}
                                    {hasSearched && matchesAmount > 0 && (
                                        <span>{matchesAmount} ocorrência{matchesAmount !== 1 ? 's' : ''} de "{searchTerm}" encontrada{matchesAmount !== 1 ? 's' : ''} no texto "{TEXTS.find(opt => opt.id === currentText)?.title}"</span>
                                    )}
                                </div>
                                {hasSearched && (
                                <div className="flex flex-row gap-2 ">
                                    <button
                                        type="button"
                                        aria-label="Ocorrência anterior"
                                        onClick={() => browseMatches('prev')}
                                        disabled={matchesAmount < 1 || currentMatchIndex === 0}
                                        className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 hover:text-sky-700 cursor-pointer
                                            disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                                    >
                                        <IoIosArrowUp className="h-6 w-6"/>
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Próxima ocorrência"
                                        onClick={() => browseMatches('next')}
                                        disabled={matchesAmount < 1 || currentMatchIndex + 1 >= matchesAmount}
                                        className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 hover:text-sky-700 cursor-pointer
                                            disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                                    >
                                        <IoIosArrowDown className="h-6 w-6"/>
                                    </button>
                                </div>
                                )}
                            </div>
                        )}
                        {error && (
                            <div className="p-4 text-red-400 text-xl text-center">{error}</div>
                        )}
                        {loading && (
                            <div className="flex justify-center items-center p-8">
                                <div className="animate-spin rounded-full size-32 border-b-2 border-blue-600"></div>
                            </div>
                        )}
                        {/* One panel for both states: same box, same padding, same scrollbar. */}
                        {!loading && !error && result && (
                            <div className="flex-1 min-h-0 bg-white rounded-lg shadow-sm">
                                <div
                                    className="h-full overflow-y-auto p-6 text-gray-700 leading-relaxed whitespace-pre-wrap font-mono text-md scrollbar-thin scrollbar-track-sky-50 scrollbar-thumb-sky-700"
                                    dangerouslySetInnerHTML={{
                                        __html: hasSearched && result.highlighted_text
                                            ? result.highlighted_text
                                            : escapeHtml(result.text_content ?? '')
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
        </div>
    );
};

export default TextTab;