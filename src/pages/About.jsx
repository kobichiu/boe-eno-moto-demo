import {useEffect} from 'react';
import BlueNavbar_Ver2 from "../components/navbar/BlueNavbar_Ver2";
import Footer from '../components/footer/Footer.jsx';

const About = () => {

    // Website tab header and scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <BlueNavbar_Ver2/>

            {/* Header */}
            <main className="flex flex-col flex-1">
                <title>Sobre | (Demo) Boe Eno Moto</title>
                <div
                    className="relative w-full h-48 flex flex-col items-center justify-center px-4 bg-cover bg-center"
                    style={{backgroundImage: "url('/corpus/bar.webp')"}}
                >
                    <h1 className="text-7xl sm:text-8xl text-center font-bold text-white"
                        style={{fontFamily: 'Cairo Play'}}>
                        Sobre
                    </h1>
                </div>
                <div
                    className="w-full h-auto flex items-center justify-center bg-white text-lg font-semibold text-gray-600 flex-1">
                    Student snapshot of an earlier prototype.
                    The current Boe Eno Moto site is https://boeenomoto.terradoc.org/
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default About;