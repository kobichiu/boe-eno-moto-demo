import {useState} from "react";
import KwicTab from '../components/tab/KwicTab';
import TextTab from '../components/tab/TextTab';
import ParallelTab from '../components/tab/ParallelTab';
import FrequencyTab from '../components/tab/FrequencyTab';
import CorpusNavbar from '../components/navbar/CorpusNavbar';
import Footer from '../components/footer/Footer.jsx';

const CorpusTools = () => {

    const [activeTab, setActiveTab] = useState('tab1');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <CorpusNavbar/>
                <div className="w-full mx-auto flex flex-col flex-1">
                    {/* Tab Bar */}
                    <div className="flex bg-gray-100 overflow-hidden">
                        <button
                            className={`px-4 py-2 font-medium transition-colors duration-200  rounded-t-xl focus:outline-none
                            ${activeTab === 'tab1'
                                ? 'bg-sky-100 text-sky-900 -mb-px z-10'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => handleTabClick('tab1')}
                        >
                            Corpus
                        </button>
                        <button
                            className={`px-4 py-2 font-medium transition-colors duration-200  rounded-t-xl focus:outline-none
                            ${activeTab === 'tab2'
                                ? 'bg-sky-100 text-sky-900 -mb-px z-10'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => handleTabClick('tab2')}
                        >
                            KWIC
                        </button>
                        <button
                            className={`px-4 py-2 font-medium transition-colors duration-200  rounded-t-xl focus:outline-none
                            ${activeTab === 'tab3'
                                ? 'bg-sky-100 text-sky-900 -mb-px z-10'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => handleTabClick('tab3')}
                        >
                            Textos Bilíngues
                        </button>
                        <button
                            className={`px-4 py-2 font-medium transition-colors duration-200  rounded-t-xl focus:outline-none
                            ${activeTab === 'tab4'
                                ? 'bg-sky-100 text-sky-900 -mb-px z-10'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => handleTabClick('tab4')}
                        >
                            500 palavras mais frequentes
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white">
                        {/* Tab content goes here */}
                        {activeTab === 'tab1' && <TextTab/>}
                        {activeTab === 'tab2' && <KwicTab/>}
                        {activeTab === 'tab3' && <ParallelTab/>}
                        {activeTab === 'tab4' && <FrequencyTab/>}
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default CorpusTools;