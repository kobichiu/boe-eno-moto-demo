import { useState, useEffect } from 'react';
import { MdOutlineKeyboardDoubleArrowUp } from 'react-icons/md';
import OrangeNavbar from "../components/navbar/OrangeNavbar";
import Footer from '../components/footer/Footer.jsx';

const Fauna = () => {

    const [searchInput, setSearchInput] = useState("");
    const [faunaData, setFaunaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visible, setVisible] = useState(false);

    const FAUNA_DOC = `${import.meta.env.BASE_URL}data/fauna.tsv`;

    const parseTsv = (text) => {
        const [headerLine, ...lines] = text.trim().split(/\r?\n/);
        const headers = headerLine.split('\t');

        return lines.map((line) => {
            const cells = line.split('\t');
            return headers.reduce((row, header, i) => {
                row[header] = cells[i]?.trim() || null;
                return row;
            }, {});
        });
    };

    useEffect(() => {
        fetch(FAUNA_DOC)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to load fauna: ${res.status}`);
                return res.text();
            })
            .then(text => setFaunaData(parseTsv(text)))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // Lower case and drop accents, so "onca" finds "Onça".
    const normalize = (text) =>
        text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

    // faunaData always holds the full list. The grid is derived from what is in the box.
    const term = normalize(searchInput.trim());
    const visibleAnimals = term
        ? faunaData.filter((animal) =>
            [animal.name_portuguese, animal.name_bororo, animal.scientific_name, animal.category, animal.classification_bororo]
                .some((field) => field && normalize(field).includes(term))
        )
        : faunaData;


    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <div className="min-h-screen flex flex-col w-full">
            <OrangeNavbar />
            <title>Fauna Bororo | (Demo) Boe Eno Moto</title>

            <main className="flex-1">
                {/* Hero Section with Search */}
                <div
                    className="relative w-auto min-h-[30vh] rounded-3xl m-8 mt-0
                    flex flex-col items-start justify-center
                    bg-cover bg-top"
                    style={{ backgroundImage: "url('/fauna/fauna_header.webp')" }}
                >
                    {/* Content */}
                    <div className="relative z-10 pl-8">
                        <h1 className="text-7xl md:text-8xl text-left font-bold mb-6" style={{ fontFamily: 'Cairo Play' }}>
                            <span style={{ color: '#fa9500' }}>Fauna</span>{' '}
                            <span style={{ color: '#606c38' }}>Bororo</span>
                        </h1>
                    </div>

                    {/* Search bar */}
                    <div className='flex max-w-[70%] bg-white border-4 border-transparent rounded-full shadow-sm z-10 ml-8'>
                        <input
                            type='search'
                            placeholder='Buscar um animal'
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full outline-none bg-white text-gray-600 text-lg md:text-lg lg:text-xl px-4 py-2 rounded-full"
                        />
                        <button
                            type='button'
                            className="text-white text-lg md:text-lg lg:text-xl rounded-full px-5 py-2 transition-all duration-500"
                            style={{ backgroundColor: '#50d499' }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#abde7a'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#50d499'}
                        >
                            Buscar
                        </button>
                    </div>
                </div>
            </main>

            {/* Cards Section */}
            <div className="px-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Explore a fauna em Bororo</h2>

                {/* Content Container with minimum height */}
                <div className="min-h-96">
                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                            <span className="ml-3 text-gray-600">Carregando...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {/* Fauna Cards Grid */}
                    {!loading && !error && (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {visibleAnimals.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-600 text-lg">
                                        {searchInput.trim()
                                            ? `Nenhum animal encontrado para "${searchInput.trim()}".`
                                            : 'No fauna data available.'}
                                    </p>
                                </div>
                            ) : (
                                visibleAnimals.map((animal) => (
                                    <div className='rounded-2xl shadow-lg pl-2 bg-cover bg-left h-full flex'
                                        style={{ backgroundImage: "url('/fauna/fauna_card.webp')" }}
                                         key={animal.id}
                                    >
                                        <div className="bg-white rounded-2xl overflow-hidden group hover:shadow-xl transition-shadow duration-300 ml-2 flex flex-col flex-1">
                                            {/* Image Section */}
                                            <div className="relative aspect-[4/3] lg:aspect-[3/2] bg-cover bg-center bg-gray-200">

                                                    <img
                                                        src={animal.pic_link ? animal.pic_link : "/fauna/placeholder-animal.svg"}
                                                        alt={animal.name_portuguese || ''}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                    />
                                                {/* Shadow overlay at bottom */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-6 flex-1 flex flex-col">
                                                {/* Portuguese name as header */}
                                                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                                                    {animal.name_portuguese || 'Nome não disponível'}
                                                </h3>

                                                {/* Boe enogiegidae: Bororo name */}
                                                {animal.name_bororo && (
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        <span className="font-medium">Boe enogiegidae:</span> {animal.name_bororo}
                                                    </p>
                                                )}

                                                {/* Ie jokodo: Scientific name */}
                                                {animal.scientific_name && (
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        <span className="font-medium">Ie jokodo:</span> <em>{animal.scientific_name}</em>
                                                    </p>
                                                )}

                                                {/* Jebatodae: Category */}
                                                {animal.category && (
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        <span className="font-medium">Jebatodae:</span> {animal.category}
                                                    </p>
                                                )}

                                                {/* Classificação bororo: Bororo classification */}
                                                {animal.classification_bororo && (
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        <span className="font-medium">Classificação bororo:</span> {animal.classification_bororo}
                                                    </p>
                                                )}

                                                {/* Informações: Info */}
                                                {animal.info && (
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        <span className="font-medium">Informações:</span> {animal.info}
                                                    </p>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
                <button
                    onClick={scrollToTop}
                    className={`fixed bottom-5 right-5 p-2 rounded-full bg-lime-600 text-white shadow-lg transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    <MdOutlineKeyboardDoubleArrowUp className="w-6 h-6" />
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default Fauna;