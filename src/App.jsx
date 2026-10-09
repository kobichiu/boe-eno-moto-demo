import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Main from './pages/Main';
import About from './pages/About';
import Corpus from './pages/Corpus';
import Dictionary from './pages/Dictionary';
import DictionaryResults from './pages/DictionaryResults';
import Fauna from './pages/Fauna';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/corpus" element={<Corpus/>}/>
                <Route path="/dictionary" element={<Dictionary/>}/>
                <Route path="/dictionary/results" element={<DictionaryResults/>}/>
                <Route path="/fauna" element={<Fauna/>}/>
            </Routes>
        </Router>
    );
};

export default App;