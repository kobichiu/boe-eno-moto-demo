import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbArrowsLeftRight } from "react-icons/tb";
import BlueNavbar_Ver2 from "../components/navbar/BlueNavbar_Ver2";
import Footer from "../components/footer/Footer.jsx";
import SearchBar from "../components/dictionary/SearchBar";

const LanguageDirection = () => (
    <div className="w-full flex flex-row justify-center mt-24 gap-5">
        <div className="border rounded-full px-5 py-1 text-lg w-40 text-center" id="from">
            Bororo
        </div>
        <TbArrowsLeftRight className="w-5 h-5 self-center mx-2 opacity-50" />
        <div className="border rounded-full px-5 py-1 text-lg w-40 text-center" id="to">
            Português
        </div>
    </div>
);

const Dictionary = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        const term = searchTerm.trim();
        if (!term) {
            alert('Por favor, insira um termo de pesquisa');
            return;
        }

        const params = new URLSearchParams({ term });
        navigate(`/dictionary/results?${params.toString()}`);
    };

    return (
        <div className='min-h-screen flex flex-col'>
            <main className='flex-1'>
                <BlueNavbar_Ver2 />
                <title>Dicionário Bororo | (Demo) Boe Eno Moto</title>
                <div className="relative w-full min-h-[35vh] lg:min-h-[40vh] xl:min-h-[45vh] 2xl:min-h-[50vh] 
                    flex flex-col items-center justify-center px-4 
                    space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8 
                    bg-cover bg-left-top"
                     style={{backgroundImage: "url('/corpus/bar.webp')"}}
                >
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-center font-bold text-white"
                        style={{fontFamily: 'Cairo Play'}}>
                        Dicionário Bororo-Português-Bororo
                    </h1>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold text-white"
                        style={{fontFamily: 'Cairo Play'}}>
                        (versão 0.3)
                    </h3>

                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onSubmit={handleSearch}
                    />
                </div>

                <LanguageDirection />
            </main>
            <Footer/>
        </div>
    );
};

export default Dictionary;
