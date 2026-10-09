import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MdOutlineKeyboardDoubleArrowUp } from 'react-icons/md';
import BlueNavbar_Ver2 from '../components/navbar/BlueNavbar_Ver2';
import Footer from '../components/footer/Footer.jsx';
import SearchBar from '../components/dictionary/SearchBar';
import { findEntries } from '../lib/dictionary';

const CARD_CLASS = "mb-8 p-6 bg-white rounded-lg shadow-md mx-auto w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%]";

const ImageWithDimensions = ({ src, alt }) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            setDimensions({
                width: img.width,
                height: img.height
            });
        };
    }, [src]);

    const getImageClass = () => {
        if (dimensions.width === 0 || dimensions.height === 0) return "max-h-64";
        const aspectRatio = dimensions.width / dimensions.height;
        if (aspectRatio > 1.5) {
            return "max-w-96 max-h-64";
        } else if (aspectRatio < 0.67) {
            return "max-h-96";
        } else {
            return "max-h-64 max-w-64";
        }
    };

    return (
        <img
            src={src}
            alt={alt}
            className={`${getImageClass()} rounded-xl mt-2`}
            loading="lazy"
        />
    );
};

const parseExamples = (sentence) =>
    sentence
        .split(";")
        .map((pair) => pair.trim())
        .filter((pair) => pair.includes('='))
        .map((pair) => {
            const [bororo, portuguese] = pair.split('=').map((part) => part.trim());
            return { bororo, portuguese };
        });

// Links the scientific name inside the definition to its wiki article.
const Definition = ({ definition, scientificName, wikiLink }) => {
    if (!definition) return null;
    if (!scientificName || !wikiLink || !definition.includes(scientificName)) {
        return definition;
    }

    const [before, after] = definition.split(scientificName);
    return (
        <>
            {before}
            <a
                href={wikiLink}
                target="_blank"
                rel="noopener noreferrer"
                className="italic text-blue-600 hover:text-blue-800 underline"
            >
                {scientificName}
            </a>
            {after}
        </>
    );
};

const EntryHeading = ({ result }) => (
    <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-gray-800">{result.entry}</h2>
        <div className="flex items-center gap-3">
            <span className="text-gray-500 font-mono">{result.ipa}</span>
            {result.audio_url && <audio src={result.audio_url} controls />}
            <span className="text-sm text-gray-600 italic">{result.pos}</span>
        </div>
    </div>
);

const EntryBody = ({ result }) => (
    <>
        <p className="mt-4 text-gray-700">
            <Definition
                definition={result.definition}
                scientificName={result.scientific_name}
                wikiLink={result.wiki_link}
            />
        </p>

        {result.example_sent && (
            <div className="mt-2 text-gray-700">
                <span className="font-bold">Exemplo(s):</span>
                <ul className="list-disc pl-6 text-gray-500">
                    {parseExamples(result.example_sent).map((pair, index) => (
                        <li key={index}>
                            <span>{pair.bororo}</span> = <span>{pair.portuguese}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {result.pic_link && <ImageWithDimensions src={result.pic_link} alt={result.entry} />}

        {result.comment && (
            <p className="mt-2 text-gray-700">
                <span className="font-bold">Observação: </span>
                {result.comment}
            </p>
        )}
    </>
);

const DictionaryResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const term = searchParams.get('term');

    // Senses of the same word collapse under one heading when they share a part of speech.
    const sharesOneHeading = results.length > 1
        && results.every((result) => result.pos === results[0].pos);

    useEffect(() => {
        if (!term) {
            setError('Nenhum termo de pesquisa');
            setResults([]);
            setLoading(false);
            return;
        }

        setSearchTerm(term);
        setLoading(true);
        setError(null);

        let active = true;
        findEntries(term)
            .then((entries) => active && setResults(entries))
            .catch((err) => active && setError(err.message))
            .finally(() => active && setLoading(false));

        return () => {
            active = false;
        };
    }, [term]);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = () => {
        const nextTerm = searchTerm.trim();
        if (!nextTerm) {
            alert('Por favor, insira um termo de pesquisa');
            return;
        }
        setSearchParams({ term: nextTerm });
    };

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <div className="min-h-screen flex flex-col bg-white text-black">
            <main className="flex-1">
                <BlueNavbar_Ver2 />

                <div
                    className="relative w-full h-48 flex flex-col items-center justify-center px-4 bg-cover bg-center"
                    style={{ backgroundImage: "url('/corpus/bar.webp')" }}
                >
                    <h1 className="text-5xl sm:text-6xl text-center font-bold text-white" style={{ fontFamily: 'Cairo Play' }}>
                        Resultados da Pesquisa
                    </h1>

                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onSubmit={handleSearch}
                    />
                </div>

                <div className="w-full h-full flex flex-row justify-center bg-white">
                    <div className="w-full mt-24 py-6 px-2">
                        {loading ? (
                            <div className="text-center">Carregando...</div>
                        ) : error ? (
                            <div className="text-red-500 text-center">{error}</div>
                        ) : results.length === 0 ? (
                            <div className="text-center text-gray-500">Nenhum resultado encontrado</div>
                        ) : sharesOneHeading ? (
                            <div className={CARD_CLASS}>
                                <EntryHeading result={results[0]} />
                                <hr className="border-t-4 border-orange-600 mt-4" />
                                <ul className="list-disc pl-6 mt-4">
                                    {results.map((result, index) => (
                                        <li key={index} className="text-gray-700">
                                            {index > 0 && <hr className="my-6 border-gray-200" />}
                                            <EntryBody result={result} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            results.map((result, index) => (
                                <div key={index} className={CARD_CLASS}>
                                    <EntryHeading result={result} />
                                    <hr className="border-t-4 border-orange-600 mt-4" />
                                    <EntryBody result={result} />
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        onClick={scrollToTop}
                        className={`fixed bottom-5 right-5 p-2 rounded-full bg-blue-500 text-white shadow-lg transition-opacity duration-300 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        <MdOutlineKeyboardDoubleArrowUp className="w-6 h-6" />
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DictionaryResults;
