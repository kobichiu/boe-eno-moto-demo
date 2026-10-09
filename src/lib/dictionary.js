const DICT_URL = `${import.meta.env.BASE_URL}data/dict.tsv`;

let dictPromise;

// Exported so the row-shaping rules can be tested without touching the network.
export const parseTsv = (text) => {
    const [headerLine, ...lines] = text.trim().split(/\r?\n/);
    const headers = headerLine.split('\t');

    return lines.map((line) => {
        const cells = line.split('\t');
        return headers.reduce((row, header, index) => {
            row[header] = cells[index]?.trim() || null;
            return row;
        }, {});
    });
};

// Downloads and parses dict.tsv once; later callers share the same promise.
export const loadDictionary = () => {
    if (!dictPromise) {
        dictPromise = fetch(DICT_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load dictionary: ${response.status}`);
                }
                return response.text();
            })
            .then(parseTsv)
            .catch((err) => {
                dictPromise = undefined;
                throw err;
            });
    }
    return dictPromise;
};

// Entries starting with the term, alphabetical. Replaces GET /api/autocomplete.
export const suggestEntries = async (term, limit = 10) => {
    const prefix = term.trim().toLowerCase();
    if (!prefix) return [];

    const entries = await loadDictionary();
    const matches = entries
        .filter((row) => row.entry?.toLowerCase().startsWith(prefix))
        .map((row) => row.entry);

    return [...new Set(matches)].sort().slice(0, limit);
};

// Every sense of an exact entry, in file order. Replaces GET /api/dict.
export const findEntries = async (term) => {
    const needle = term.trim().toLowerCase();
    if (!needle) return [];

    const [entries] = await Promise.all([loadDictionary()]);

    return entries
        .filter((row) => row.entry?.toLowerCase() === needle)
        .map((row) => ({
            ...row
        }));
};
