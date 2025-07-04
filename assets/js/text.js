// Text Tools JavaScript - Basic functionality

// Case Converter Functions
function convertCase(caseType) {
    const input = document.getElementById('case-input').value;
    if (!input.trim()) {
        alert('Please enter some text to convert.');
        return;
    }

    let result = '';
    switch (caseType) {
        case 'uppercase':
            result = input.toUpperCase();
            break;
        case 'lowercase':
            result = input.toLowerCase();
            break;
        case 'titlecase':
            result = input.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
            break;
        case 'sentencecase':
            result = input.toLowerCase().replace(/(^\w|\.\s+\w)/g, letter => letter.toUpperCase());
            break;
        case 'camelcase':
            result = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
            break;
        case 'pascalcase':
            result = input.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
                         .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
            break;
        case 'snakecase':
            result = input.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_');
            break;
        case 'kebabcase':
            result = input.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
            break;
    }

    displayResult('case-result', `
        <div class="success-message">
            <h4>Text Converted to ${caseType.replace(/([A-Z])/g, ' $1').trim()}</h4>
            <div class="converted-text">
                <textarea readonly rows="8">${result}</textarea>
            </div>
            <button class="btn btn-primary" onclick="copyToClipboard('${result.replace(/'/g, "\\'")}')">Copy to Clipboard</button>
        </div>
    `);
}

function clearText() {
    document.getElementById('case-input').value = '';
    document.getElementById('case-result').innerHTML = '';
}

// Text Analyzer Functions
function analyzeText() {
    const input = document.getElementById('analyzer-input').value;
    if (!input.trim()) {
        alert('Please enter some text to analyze.');
        return;
    }

    const analysis = {
        characters: analyzeCharacters(input),
        words: analyzeWords(input),
        sentences: analyzeSentences(input),
        readability: analyzeReadability(input),
        frequency: analyzeWordFrequency(input)
    };

    let resultHTML = '<div class="analysis-results">';
    
    if (document.getElementById('analyze-characters').checked) {
        resultHTML += `
            <div class="analysis-section">
                <h4>Character Analysis</h4>
                <p>Total Characters: ${analysis.characters.total}</p>
                <p>Characters (no spaces): ${analysis.characters.noSpaces}</p>
                <p>Letters: ${analysis.characters.letters}</p>
                <p>Numbers: ${analysis.characters.numbers}</p>
                <p>Punctuation: ${analysis.characters.punctuation}</p>
            </div>
        `;
    }

    if (document.getElementById('analyze-words').checked) {
        resultHTML += `
            <div class="analysis-section">
                <h4>Word Analysis</h4>
                <p>Total Words: ${analysis.words.total}</p>
                <p>Unique Words: ${analysis.words.unique}</p>
                <p>Average Word Length: ${analysis.words.averageLength.toFixed(2)}</p>
                <p>Longest Word: "${analysis.words.longest}" (${analysis.words.longest.length} chars)</p>
            </div>
        `;
    }

    if (document.getElementById('analyze-sentences').checked) {
        resultHTML += `
            <div class="analysis-section">
                <h4>Sentence Analysis</h4>
                <p>Total Sentences: ${analysis.sentences.total}</p>
                <p>Average Sentence Length: ${analysis.sentences.averageLength.toFixed(2)} words</p>
                <p>Paragraphs: ${analysis.sentences.paragraphs}</p>
            </div>
        `;
    }

    if (document.getElementById('analyze-readability').checked) {
        resultHTML += `
            <div class="analysis-section">
                <h4>Readability Scores</h4>
                <p>Flesch Reading Ease: ${analysis.readability.flesch.toFixed(1)}</p>
                <p>Flesch-Kincaid Grade Level: ${analysis.readability.fleschKincaid.toFixed(1)}</p>
                <p>Gunning Fog Index: ${analysis.readability.gunningFog.toFixed(1)}</p>
            </div>
        `;
    }

    if (document.getElementById('analyze-frequency').checked) {
        resultHTML += `
            <div class="analysis-section">
                <h4>Most Common Words</h4>
                <div class="word-frequency">
                    ${analysis.frequency.slice(0, 10).map(word => 
                        `<span class="word-item">${word.word}: ${word.count}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }

    resultHTML += '</div>';
    displayResult('analyzer-result', resultHTML);
}

// Word Counter Functions
function countWords() {
    const input = document.getElementById('counter-input').value;
    if (!input.trim()) {
        alert('Please enter some text to count.');
        return;
    }

    const includeSpaces = document.getElementById('count-spaces').checked;
    const includePunctuation = document.getElementById('count-punctuation').checked;
    const countNumbers = document.getElementById('count-numbers').checked;
    const countUniqueWords = document.getElementById('count-unique-words').checked;

    const stats = {
        characters: input.length,
        charactersNoSpaces: input.replace(/\s/g, '').length,
        charactersNoPunctuation: input.replace(/[^\w\s]/g, '').length,
        words: input.trim().split(/\s+/).filter(word => word.length > 0).length,
        uniqueWords: new Set(input.toLowerCase().match(/\b\w+\b/g) || []).size,
        sentences: input.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length,
        paragraphs: input.split(/\n\s*\n/).filter(para => para.trim().length > 0).length,
        numbers: (input.match(/\d+/g) || []).length
    };

    let resultHTML = `
        <div class="count-results">
            <h4>Word Count Results</h4>
            <div class="count-grid">
                <div class="count-item">
                    <span class="count-number">${stats.words}</span>
                    <span class="count-label">Words</span>
                </div>
                <div class="count-item">
                    <span class="count-number">${includeSpaces ? stats.characters : stats.charactersNoSpaces}</span>
                    <span class="count-label">Characters ${includeSpaces ? '(with spaces)' : '(no spaces)'}</span>
                </div>
                <div class="count-item">
                    <span class="count-number">${stats.sentences}</span>
                    <span class="count-label">Sentences</span>
                </div>
                <div class="count-item">
                    <span class="count-number">${stats.paragraphs}</span>
                    <span class="count-label">Paragraphs</span>
                </div>
    `;

    if (countUniqueWords) {
        resultHTML += `
                <div class="count-item">
                    <span class="count-number">${stats.uniqueWords}</span>
                    <span class="count-label">Unique Words</span>
                </div>
        `;
    }

    if (countNumbers) {
        resultHTML += `
                <div class="count-item">
                    <span class="count-number">${stats.numbers}</span>
                    <span class="count-label">Numbers</span>
                </div>
        `;
    }

    resultHTML += `
            </div>
            <p class="reading-time">Estimated reading time: ${Math.ceil(stats.words / 200)} minutes</p>
        </div>
    `;

    displayResult('counter-result', resultHTML);
}

// Text Formatter Functions
function formatText(formatType) {
    const input = document.getElementById('formatter-input').value;
    if (!input.trim()) {
        alert('Please enter some text to format.');
        return;
    }

    let result = '';
    switch (formatType) {
        case 'remove-extra-spaces':
            result = input.replace(/\s+/g, ' ').trim();
            break;
        case 'proper-indentation':
            result = input.split('\n').map(line => '    ' + line.trim()).join('\n');
            break;
        case 'line-breaks':
            result = input.replace(/\. /g, '.\n').replace(/! /g, '!\n').replace(/\? /g, '?\n');
            break;
        case 'remove-line-breaks':
            result = input.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
            break;
        case 'capitalize-sentences':
            result = input.toLowerCase().replace(/(^\w|\.\s+\w)/g, letter => letter.toUpperCase());
            break;
        case 'remove-duplicates':
            result = [...new Set(input.split('\n'))].join('\n');
            break;
        case 'sort-lines':
            result = input.split('\n').sort().join('\n');
            break;
        case 'reverse-text':
            result = input.split('').reverse().join('');
            break;
    }

    displayResult('formatter-result', `
        <div class="success-message">
            <h4>Text Formatted</h4>
            <div class="formatted-text">
                <textarea readonly rows="8">${result}</textarea>
            </div>
            <button class="btn btn-primary" onclick="copyToClipboard('${result.replace(/'/g, "\\'")}')">Copy to Clipboard</button>
        </div>
    `);
}

function applyCustomFormat() {
    const input = document.getElementById('formatter-input').value;
    const customFormat = document.getElementById('custom-format-input').value;
    
    if (!input.trim() || !customFormat.trim()) {
        alert('Please enter both text and custom format pattern.');
        return;
    }

    // Simple custom format implementation
    let result = input;
    try {
        // Replace common patterns
        result = result.replace(new RegExp(customFormat, 'g'), '');
    } catch (e) {
        alert('Invalid format pattern. Please use valid regular expressions.');
        return;
    }

    displayResult('formatter-result', `
        <div class="success-message">
            <h4>Custom Format Applied</h4>
            <div class="formatted-text">
                <textarea readonly rows="8">${result}</textarea>
            </div>
            <button class="btn btn-primary" onclick="copyToClipboard('${result.replace(/'/g, "\\'")}')">Copy to Clipboard</button>
        </div>
    `);
}

// Text Diff Functions
function compareTexts() {
    const text1 = document.getElementById('diff-text1').value;
    const text2 = document.getElementById('diff-text2').value;
    
    if (!text1.trim() || !text2.trim()) {
        alert('Please enter both texts to compare.');
        return;
    }

    const ignoreCase = document.getElementById('ignore-case').checked;
    const ignoreWhitespace = document.getElementById('ignore-whitespace').checked;
    const showLineNumbers = document.getElementById('show-line-numbers').checked;

    let processedText1 = text1;
    let processedText2 = text2;

    if (ignoreCase) {
        processedText1 = processedText1.toLowerCase();
        processedText2 = processedText2.toLowerCase();
    }

    if (ignoreWhitespace) {
        processedText1 = processedText1.replace(/\s+/g, ' ').trim();
        processedText2 = processedText2.replace(/\s+/g, ' ').trim();
    }

    const lines1 = processedText1.split('\n');
    const lines2 = processedText2.split('\n');
    
    let diffHTML = '<div class="diff-results">';
    diffHTML += '<h4>Text Comparison Results</h4>';
    
    const maxLines = Math.max(lines1.length, lines2.length);
    let differences = 0;

    for (let i = 0; i < maxLines; i++) {
        const line1 = lines1[i] || '';
        const line2 = lines2[i] || '';
        const lineNumber = showLineNumbers ? `<span class="line-number">${i + 1}:</span>` : '';
        if (line1 === line2) {
            diffHTML += `<div class="diff-line same">${lineNumber}<span class="line-content">${line1 || ' '}</span></div>`;
        } else {
            differences++;
            diffHTML += `<div class="diff-line different">${lineNumber}<span class="line-content old">${line1 || ' '}</span></div>`;
            diffHTML += `<div class="diff-line different">${lineNumber}<span class="line-content new">${line2 || ' '}</span></div>`;
        }
    }

    diffHTML += `<p class="diff-summary">Found ${differences} differences between the texts.</p>`;
    diffHTML += '</div>';

    displayResult('diff-result', diffHTML);
}

// Grammar Checker Function (functional)
function checkGrammar() {
    const input = document.getElementById('grammar-input').value;
    if (!input.trim()) {
        alert('Please enter some text to check.');
        return;
    }
    // Show loading
    displayResult('grammar-result', `<div class='loading-message'>Checking grammar...</div>`);
    fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `text=${encodeURIComponent(input)}&language=auto`
    })
    .then(response => response.json())
    .then(data => {
        if (!data.matches || data.matches.length === 0) {
            displayResult('grammar-result', `<div class='success-message'><h4>No issues found!</h4><p>Your text looks good.</p></div>`);
            return;
        }
        let resultHTML = `<div class='grammar-results'><h4>Grammar & Spelling Suggestions</h4>`;
        data.matches.forEach((match, idx) => {
            const context = match.context;
            const offset = context.offset;
            const length = context.length;
            const before = context.text.slice(0, offset);
            const error = context.text.substr(offset, length);
            const after = context.text.slice(offset + length);
            resultHTML += `
                <div class='grammar-issue'>
                    <div class='grammar-context'><strong>Issue ${idx + 1}:</strong> <span>${before}<mark class='grammar-error'>${error}</mark>${after}</span></div>
                    <div class='grammar-message'>${match.message}</div>
                    ${match.replacements && match.replacements.length > 0 ? `<div class='grammar-suggestions'><strong>Suggestions:</strong> ${match.replacements.slice(0,3).map(r => `<span class='suggestion'>${r.value}</span>`).join(', ')}</div>` : ''}
                    <div class='grammar-explanation'>${match.shortMessage || ''}</div>
                </div>
            `;
        });
        resultHTML += `</div><div class='grammar-powered'>Powered by <a href='https://languagetool.org/' target='_blank'>LanguageTool</a></div>`;
        displayResult('grammar-result', resultHTML);
    })
    .catch(err => {
        displayResult('grammar-result', `<div class='error-message'>Error checking grammar. Please try again later.</div>`);
    });
}

// Utility Functions
function displayResult(elementId, content) {
    document.getElementById(elementId).innerHTML = content;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Text copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Text copied to clipboard!');
    });
}

// Analysis Helper Functions
function analyzeCharacters(text) {
    return {
        total: text.length,
        noSpaces: text.replace(/\s/g, '').length,
        letters: (text.match(/[a-zA-Z]/g) || []).length,
        numbers: (text.match(/[0-9]/g) || []).length,
        punctuation: (text.match(/[^\w\s]/g) || []).length
    };
}

function analyzeWords(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const uniqueWords = [...new Set(words)];
    const wordLengths = words.map(word => word.length);
    
    return {
        total: words.length,
        unique: uniqueWords.length,
        averageLength: wordLengths.length > 0 ? wordLengths.reduce((a, b) => a + b, 0) / wordLengths.length : 0,
        longest: words.reduce((longest, current) => current.length > longest.length ? current : longest, '')
    };
}

function analyzeSentences(text) {
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);
    const sentenceLengths = sentences.map(sentence => sentence.trim().split(/\s+/).length);
    
    return {
        total: sentences.length,
        averageLength: sentenceLengths.length > 0 ? sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length : 0,
        paragraphs: paragraphs.length
    };
}

function analyzeReadability(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const syllables = countSyllables(text);
    
    const wordsPerSentence = words.length / sentences.length;
    const syllablesPerWord = syllables / words.length;
    
    // Flesch Reading Ease
    const flesch = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);
    
    // Flesch-Kincaid Grade Level
    const fleschKincaid = (0.39 * wordsPerSentence) + (11.8 * syllablesPerWord) - 15.59;
    
    // Gunning Fog Index
    const complexWords = words.filter(word => countSyllables(word) > 2).length;
    const fogIndex = 0.4 * ((words.length / sentences.length) + (100 * complexWords / words.length));
    
    return {
        flesch: Math.max(0, Math.min(100, flesch)),
        fleschKincaid: Math.max(0, fleschKincaid),
        gunningFog: Math.max(0, fogIndex)
    };
}

function analyzeWordFrequency(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const frequency = {};
    
    words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count);
}

function countSyllables(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    return words.reduce((total, word) => {
        return total + countWordSyllables(word);
    }, 0);
}

function countWordSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Real-time character count for case converter
    const caseInput = document.getElementById('case-input');
    if (caseInput) {
        caseInput.addEventListener('input', function() {
            const charCount = this.value.length;
            if (charCount > 0) {
                console.log(`Character count: ${charCount}`);
            }
        });
    }

    // Force Case Converter tab as default after all scripts have run
    setTimeout(function() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        const caseBtn = document.querySelector('.tab-btn[data-tab="case-converter"]');
        const caseContent = document.getElementById('case-converter');
        if (caseBtn && caseContent) {
            caseBtn.classList.add('active');
            caseContent.classList.add('active');
        }
    }, 0);
});
