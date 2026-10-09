import {useState} from "react";
import {Link} from "react-router-dom";

export default function OrangeNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.add('pt-4');
        }
    };

    return (
        <nav className="bg-white text-black">
            <div
                className={`mx-auto flex ${isMenuOpen ? 'flex-col' : 'justify-between'} gap-x-4 p-4 lg:p-5 transition-all duration-300 ease-in-out`}
                id="outmost">
                <div className="flex items-center">
                    <Link className="group" to="/">
                        <svg
                            className="bi bi-feather size-10 md:size-8 lg:size-8 text-orange-400 hover:text-lime-400 transition duration-500"
                            fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M15.807.531c-.174-.177-.41-.289-.64-.363a3.8 3.8 0 0 0-.833-.15c-.62-.049-1.394 0-2.252.175C10.365.545 8.264 1.415 6.315 3.1S3.147 6.824 2.557 8.523c-.294.847-.44 1.634-.429 2.268.005.316.05.62.154.88q.025.061.056.122A68 68 0 0 0 .08 15.198a.53.53 0 0 0 .157.72.504.504 0 0 0 .705-.16 68 68 0 0 1 2.158-3.26c.285.141.616.195.958.182.513-.02 1.098-.188 1.723-.49 1.25-.605 2.744-1.787 4.303-3.642l1.518-1.55a.53.53 0 0 0 0-.739l-.729-.744 1.311.209a.5.5 0 0 0 .443-.15l.663-.684c.663-.68 1.292-1.325 1.763-1.892.314-.378.585-.752.754-1.107.163-.345.278-.773.112-1.188a.5.5 0 0 0-.112-.172"/>
                        </svg>
                    </Link>
                </div>

                <div className={
                    `             ${isMenuOpen ? 'flex' : 'hidden'} flex-col lg:flex lg:flex-row flex-grow justify-end ${isMenuOpen ? 'items-left' : 'items-center'} ${isMenuOpen ? 'py-8' : ''} gap-x-4`}
                     id="navbar">
                    <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8 text-lg md:text-xl">
                        <li>
                            <Link
                                to="/about"
                                className="block py-2 px-3 md:p-0 text-orange-400 hover:text-lime-500 transition duration-500 font-medium">
                                Sobre
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/corpus"
                                className="block py-2 px-3 md:p-0 text-orange-400 hover:text-lime-500 transition duration-500 font-medium">
                                Corpus
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/dictionary"
                                className="block py-2 px-3 md:p-0 text-orange-400 hover:text-lime-500 transition duration-500 font-medium">
                                Dicionário
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/fauna"
                                className="block py-2 px-3 md:p-0 text-orange-400 hover:text-lime-500 transition duration-500 font-medium">
                                Fauna
                            </Link>
                        </li>
                    </ul>
                </div>

                <button
                    className={`inset-y-4 right-4 absolute group size-10 md:size-8 lg:size-8 rounded-lg border-2 border-orange-400 lg:hidden transition duration-500 ${isMenuOpen ? 'toggled' : ''}`}
                    onClick={toggleMenu}
                >
                    <div className="grid justify-items-center gap-0.5">
                        <span
                            className={`h-0.5 w-4 rounded-full bg-orange-400 transition ${isMenuOpen ? 'rotate-45 translate-y-1' : ''} duration-500`}
                            id="bar1"></span>
                        <span
                            className={`h-0.5 w-4 rounded-full bg-orange-400 transition ${isMenuOpen ? 'scale-x-0' : ''}`}
                            id="bar2"></span>
                        <span
                            className={`h-0.5 w-4 rounded-full bg-orange-400 transition ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''} duration-500`}
                            id="bar3"></span>
                    </div>
                </button>
            </div>
        </nav>
    )
}