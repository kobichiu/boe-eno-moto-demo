import {Link} from 'react-router-dom';
import '../index.css';
import BlueNavbar_Ver1 from '../components/navbar/BlueNavbar_Ver1';
import Footer from '../components/footer/Footer.jsx';

const Main = () => {
    const resources = [
        {
            title: 'Corpus',
            image: '/mainPage/corpus.webp',
            link: '/corpus',
            hoverColor: 'hover:bg-teal-700'
        },
        {
            title: 'Dicionário',
            image: '/mainPage/dict.webp',
            link: '/dictionary',
            hoverColor: 'hover:bg-sky-800'
        },
        {
            title: 'Fauna',
            image: '/mainPage/fauna.webp',
            link: '/fauna',
            hoverColor: 'hover:bg-orange-700'
        }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <BlueNavbar_Ver1/>
            <title>Início | (Demo) Boe Eno Moto</title>

            {/* Header */}
            <header
                className="w-full min-h-[400px] md:min-h-[400px] lg:min-h-[320px] flex flex-col md:flex-row bg-white justify-center items-center">
                <div
                    className="relative w-full max-w-full md:w-1/2 flex justify-start md:justify-center lg:justify-center p-3 box-border">
                    <h1 className="text-left text-6xl md:text-7xl lg:text-8xl text-black"
                        style={{fontFamily: 'Cairo Play'}}>
                        Boe eno moto
                    </h1>
                </div>

                <div
                    className="relative w-full max-w-full md:w-1/2 lg:w-1/2 bg-white p-3 rounded-lg flex items-center justify-center box-border">
                    <p className="relative text-md md:text-lg lg:text-xl text-gray-800 text-left w-full max-w-full"
                       style={{fontFamily: 'Cairo Play, sans-serif'}}>
                        Boe eno moto (“mundo Bororo”) é uma plataforma dedicada à preservação, documentação e
                        valorização dos saberes linguísticos e culturais do povo Bororo.
                        <br/><br/>
                        Este repositório reúne uma variedade de recursos linguísticos e etnográficos, tanto históricos
                        quanto contemporâneos, com o objetivo de apoiar o ensino, a pesquisa e os esforços de
                        revitalização da língua Bororo. A plataforma oferece um conjunto de ferramentas voltadas para o
                        estudo linguístico e antropológico.
                    </p>
                </div>
            </header>

            <section
                className="relative bottom-0 w-full h-80 lg:h-96 bg-fixed bg-bottom bg-cover"
                style={{backgroundImage: "url('/mainPage/bar.webp')"}}
            />

            {/* Resources Section */}
            <div className="subheader">
                <h2 className="text-4xl text-center py-12 px-5"
                    style={{fontFamily: 'Cairo Play, sans-serif'}}>Recursos</h2>
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resources.map((resource, index) => (
                        <div key={index} className="w-full aspect-square rounded overflow-hidden shadow-lg bg-white">
                            <div className="h-[70%] relative">
                                <img className="w-full h-full object-cover" loading="lazy" src={resource.image}
                                     alt={resource.title}/>
                                {resource.disabled && (
                                    <div
                                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"></div>
                                )}
                            </div>
                            {resource.disabled ? (
                                <div
                                    className="text-center text-xl h-[30%] flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-500 cursor-not-allowed"
                                    style={{fontFamily: 'Lexend, serif'}}
                                >
                                    {resource.title}
                                </div>
                            ) : (
                                resource.link.startsWith('/') ? (
                                    <Link
                                        to={resource.link}
                                        className={`text-center text-xl h-[30%] flex items-center justify-center px-4 py-2 bg-white ${resource.hoverColor} hover:text-white duration-300`}
                                        style={{fontFamily: 'Lexend, serif'}}
                                    >
                                        {resource.title}
                                    </Link>
                                ) : (
                                    <a
                                        href={resource.link}
                                        className={`text-center text-xl h-[30%] flex items-center justify-center px-4 py-2 bg-white ${resource.hoverColor} hover:text-white duration-300`}
                                        style={{fontFamily: 'Lexend, serif'}}
                                    >
                                        {resource.title}
                                    </a>
                                )
                            )}
                        </div>
                    ))}
                </div>
                <br/>
            </div>
            <Footer/>
        </div>
    );
};

export default Main;