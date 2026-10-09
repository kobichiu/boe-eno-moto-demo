import React, { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineKeyboardDoubleArrowUp } from 'react-icons/md';

const ParallelTab = () => {
    const [csvData, setCsvData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [visible, setVisible] = useState(false);
    const [columns, setColumns] = useState([]);

    // Add scroll detection for back to top button
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

    // Function to parse CSV content
    const parseCSV = (csvContent) => {
        const lines = csvContent.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return { headers: [], data: [] };

        // Parse headers
        const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
        
        // Parse data rows
        const data = lines.slice(1).map(line => {
            const values = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current.trim());
            
            // Create object with headers as keys
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            return row;
        });

        return { headers, data };
    };

    // Function to load CSV data
    const loadCSVData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Try to load from public/data directory first
            const response = await fetch('/data/parallel_corpus.csv');
            
            if (!response.ok) {
                // If file doesn't exist, create sample data
                const sampleData = {
                    headers: ['Bororo', 'Português'],
                    data: [
                        { 'bororo': 'boe', 'portugues': 'pessoa' },
                        { 'bororo': 'eno', 'portugues': 'nariz' },
                        { 'bororo': 'adugo', 'portugues': 'onça pintada' }
                    ]
                };
                setColumns(sampleData.headers);
                setCsvData(sampleData.data);
                setFilteredData(sampleData.data);
                return;
            }

            const csvContent = await response.text();
            const { headers, data } = parseCSV(csvContent);
            
            // Filter out the sourcefile column and map column names to Portuguese display names
            const filteredHeaders = headers.filter(header => header !== 'sourcefile');
            const displayHeaders = filteredHeaders.map(header => {
                switch(header) {
                    case 'bororo': return 'Bororo';
                    case 'portugues': return 'Português';
                    default: return header;
                }
            });
            
            // Filter data to exclude sourcefile column
            const filteredData = data.map(row => {
                const filteredRow = {};
                filteredHeaders.forEach(header => {
                    filteredRow[header] = row[header];
                });
                return filteredRow;
            });
            
            setColumns(displayHeaders);
            setCsvData(filteredData);
            setFilteredData(filteredData);
            
        } catch (err) {
            setError('Erro ao carregar os dados do corpus paralelo');
            
            // Fallback to sample data
            const sampleData = {
                headers: ['Bororo', 'Português'],
                data: [
                    { 'bororo': 'boe', 'portugues': 'pessoa' },
                    { 'bororo': 'eno', 'portugues': 'nariz' },
                    { 'bororo': 'adugo', 'portugues': 'onça pintada' }
                ]
            };
            setColumns(sampleData.headers);
            setCsvData(sampleData.data);
            setFilteredData(sampleData.data);
        } finally {
            setLoading(false);
        }
    };

    // Filter data based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredData(csvData);
        } else {
            const filtered = csvData.filter(row => 
                Object.values(row).some(value => 
                    value.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredData(filtered);
        }
    }, [searchTerm, csvData]);

    // Load data on component mount
    useEffect(() => {
        loadCSVData();
        document.title = "Boe eno moto | Corpus da Língua Bororo | Corpus Paralelo";
        window.scrollTo(0, 0);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (loading) {
        return (
            <div className="w-full h-auto flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Carregando corpus paralelo...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-auto flex items-center justify-center py-20">
                <div className="text-center">
                    <p className="text-lg text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={loadCSVData}
                        className="px-4 py-2 bg-lime-500 text-white rounded hover:bg-lime-600 transition-colors"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-auto">
            <title>Corpus da Língua Bororo | (Demo) Boe Eno Moto</title>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center text-lime-700 mb-8">
                    Corpus Paralelo Bororo-Português
                </h1>
                
                <p className="text-lg text-gray-600 text-center mb-8">
                    Total de entradas no corpus: {csvData.length}
                </p>

                {/* Search bar */}
                <div className="mb-6">
                    <div className="relative max-w-md mx-auto">
                        <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                        <input
                            type="text"
                            placeholder="Buscar no corpus paralelo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Results count */}
                {searchTerm && (
                    <p className="text-center text-gray-600 mb-4">
                        {filteredData.length} resultado(s) encontrado(s) para "{searchTerm}"
                    </p>
                )}

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', tableLayout: 'fixed' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f5f5f5' }}>
                                {columns.map((column, index) => (
                                    <th 
                                        key={index}
                                        style={{ 
                                            padding: '12px', 
                                            textAlign: 'left', 
                                            border: '1px solid #ddd', 
                                            fontWeight: 'bold',
                                            backgroundColor: index === 0 ? '#e6f7e6' : '#e6f0ff',
                                            width: '50%'
                                        }}
                                    >
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row, index) => (
                                <tr 
                                    key={index} 
                                    style={{ 
                                        backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                                        cursor: 'pointer'
                                    }}
                                    className="hover:bg-lime-50 transition-colors"
                                >
                                    {columns.map((column, colIndex) => {
                                        // Map display headers back to original column names
                                        let originalKey = '';
                                        switch(column) {
                                            case 'Bororo': originalKey = 'bororo'; break;
                                            case 'Português': originalKey = 'portugues'; break;
                                            default: originalKey = column.toLowerCase();
                                        }
                                        
                                        return (
                                            <td 
                                                key={colIndex}
                                                style={{ 
                                                    padding: '12px', 
                                                    border: '1px solid #ddd',
                                                    backgroundColor: colIndex === 0 ? '#f0fff0' : '#f0f8ff',
                                                    width: '50%',
                                                    wordWrap: 'break-word',
                                                    verticalAlign: 'top'
                                                }}
                                            >
                                                {row[originalKey]}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Back to top button */}
                <button 
                    onClick={scrollToTop}
                    className={`fixed bottom-5 right-5 p-2 rounded-full bg-lime-500 text-white shadow-lg transition-opacity duration-300 ${
                        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <MdOutlineKeyboardDoubleArrowUp className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default ParallelTab;
