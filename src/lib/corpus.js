const TEXTS_URL = `${import.meta.env.BASE_URL}data/texts`;

export const TEXTS = [
    { id: 1, title: 'Artigo oieigo', file: 'Artigo OIEIGO.txt' },
    { id: 2, title: 'Ipie baga', file: 'Ipie_baga_bororo.txt' },
    { id: 3, title: 'Oiego kiwu bakaru', file: 'Oiego Jiwy Bakary.txt' },
    { id: 4, title: 'Pobo Tawujedu', file: 'Pobo Tawujedu.txt' },
    { id: 5, title: 'Tucum kejewuge eno bapera reo', file: 'TUCUM KEJEWYGE ENO BAPERA REO.txt' },
];

const textPromises = new Map();

// Downloads one text once; later callers share the same promise. Replaces GET /api/texts.
export const loadText = (id) => {
    const entry = TEXTS.find((text) => text.id === id);
    if (!entry) return Promise.reject(new Error(`Unknown text: ${id}`));

    if (!textPromises.has(id)) {
        const promise = fetch(`${TEXTS_URL}/${encodeURIComponent(entry.file)}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load "${entry.title}": ${response.status}`);
                }
                return response.text();
            })
            // One of the files starts with a byte order mark, which would stick to its first word.
            .then((content) => ({ ...entry, text_content: content.replace(/^\uFEFF/, '') }))
            .catch((err) => {
                textPromises.delete(id);
                throw err;
            });
        textPromises.set(id, promise);
    }
    return textPromises.get(id);
};

/* ------------------------------------------------------------------ */
/* KWIC (key word in context). Replaces GET /api/kwic.                 */
/* ------------------------------------------------------------------ */

// "word(gloss) Speaker:text" -> ["word", "(", "gloss", ")", "Speaker", ":", "text"]
// Brackets and colons become tokens of their own, so a morpheme gloss or a speaker
// label never glues itself onto the word next to it.
export const tokenize = (sentence) =>
    sentence
        .replace(/\(/g, ' ( ')
        .replace(/\)/g, ' ) ')
        .replace(/:/g, ' : ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter((token) => token.length > 0);

// Every occurrence of the term in the given texts, with `context` tokens either side.
//
// Matching happens on whole tokens, line by line. That keeps the three rules the
// server enforced (a word never matches part of another word, a multi-word term
// must be consecutive, nothing crosses a line) without needing a regex, and it
// treats accented letters as letters, which the server's \b did not.
export const findKwic = (texts, { term, context, caseSensitive = true }) => {
    const fold = (token) => {
        const composed = token.normalize('NFC');
        return caseSensitive ? composed : composed.toLowerCase();
    };

    const needle = tokenize(term).map(fold);
    if (needle.length === 0) return [];

    const results = [];

    texts.forEach((text) => {
        text.text_content.split(/\r?\n/).forEach((line) => {
            // Lines starting with # are titles and notes, not Bororo text.
            if (line.startsWith('#')) return;

            const tokens = tokenize(line);
            const folded = tokens.map(fold);

            const starts = [];
            for (let i = 0; i + needle.length <= folded.length; i++) {
                if (needle.every((word, offset) => folded[i + offset] === word)) {
                    starts.push(i);
                }
            }

            starts.forEach((start, index) => {
                const end = start + needle.length;
                results.push({
                    textId: text.id,
                    textTitle: text.title,
                    leftContext: tokens.slice(Math.max(0, start - context), start),
                    keyword: tokens.slice(start, end).join(' '),
                    rightContext: tokens.slice(end, end + context),
                    position: start,
                    occurrenceInLine: index + 1,
                    totalOccurrencesInLine: starts.length,
                });
            });
        });
    });

    return results;
};

export const searchKwic = async ({ term, textIds, context, caseSensitive }) => {
    const orderedIds = [...textIds].sort((a, b) => a - b);
    const texts = await Promise.all(orderedIds.map(loadText));
    return findKwic(texts, { term, context, caseSensitive });
};

/* ------------------------------------------------------------------ */
/* Highlighting for the text viewer                                    */
/* ------------------------------------------------------------------ */

export const escapeHtml = (text) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const LETTER_OR_DIGIT = '[\\p{L}\\p{N}_]';

// Wraps every match in <mark>. The result is HTML and is escaped, so the text can be
// handed to dangerouslySetInnerHTML. Returns null when nothing matches.
//   exact   - the term must be a whole word
//   contain - the term may appear anywhere
export const highlightText = (text, term, { mode, caseSensitive = true }) => {
    if (!term) return null;

    const source = text.normalize('NFC');
    const body = escapeRegExp(term.normalize('NFC'));
    const pattern =
        mode === 'exact'
            ? `(?<!${LETTER_OR_DIGIT})${body}(?!${LETTER_OR_DIGIT})`
            : body;
    const regex = new RegExp(pattern, caseSensitive ? 'gu' : 'giu');

    let html = '';
    let count = 0;
    let last = 0;

    for (const match of source.matchAll(regex)) {
        html += escapeHtml(source.slice(last, match.index));
        html += `<mark>${escapeHtml(match[0])}</mark>`;
        last = match.index + match[0].length;
        count += 1;
    }

    if (count === 0) return null;

    html += escapeHtml(source.slice(last));
    return { html, count };
};
