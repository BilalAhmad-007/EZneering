// Tools JavaScript - Common functionality for all tool pages
class ToolsManager {
    constructor() {
        this.currentTab = null;
        this.init();
    }

    async init() {
        // Set up theme immediately to prevent flashing
        this.setupTheme();
        
        // Load components
        await this.loadComponents();
        
        // Update navigation and footer links
        this.updateNavigationLinks();
        this.updateFooterLinks();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set up tab navigation
        this.setupTabNavigation();
        
        // Initialize the default active tab (language-converter)
        this.initializeTab('language-converter');
    }

    async loadComponents() {
        try {
            // Load header
            const headerResponse = await fetch('../header.html');
            const headerHtml = await headerResponse.text();
            document.getElementById('header-container').innerHTML = headerHtml;

            // Update navigation links for tool pages
            this.updateNavigationLinks();

            // Update theme icon after header is loaded (don't change the theme, just update the icon)
            const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'dark';
            this.updateThemeIcon(currentTheme);

            // Load footer
            const footerResponse = await fetch('../footer.html?t=' + Date.now());
            const footerHtml = await footerResponse.text();
            document.getElementById('footer-container').innerHTML = footerHtml;
            
            // Update footer links for tool pages
            this.updateFooterLinks();
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    updateNavigationLinks() {
        // Update logo link to go to index.html
        const logoLink = document.querySelector('.logo');
        if (logoLink) {
            logoLink.href = '../index.html';
        }

        // Update Home link to go to index.html
        const homeLink = document.querySelector('.nav-link[href="index.html"]');
        if (homeLink) {
            homeLink.href = '../index.html';
        }

        // Update Tools link to go to index.html#tools-section
        const toolsLink = document.querySelector('.nav-link[href="#tools-section"]');
        if (toolsLink) {
            toolsLink.href = '../index.html#tools-section';
        }

        // Update About link to scroll to footer on current page
        const aboutLink = document.querySelector('.nav-link[href="#footer-container"]');
        if (aboutLink) {
            aboutLink.href = '#footer-container';
        }
    }

    updateFooterLinks() {
        // Update footer links for privacy policy and terms
        const privacyLink = document.querySelector('.legal-link[href="privacy-policy.html"]');
        if (privacyLink) {
            privacyLink.href = '../privacy-policy.html';
        }

        const termsLink = document.querySelector('.legal-link[href="terms-conditions.html"]');
        if (termsLink) {
            termsLink.href = '../terms-conditions.html';
        }
    }

    setupEventListeners() {
        // Theme toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('#theme-toggle')) {
                this.toggleTheme();
            }
        });

        // Mobile menu
        document.addEventListener('click', (e) => {
            if (e.target.closest('#mobile-menu-btn')) {
                this.toggleMobileMenu();
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && navMenu.classList.contains('active') && 
                !e.target.closest('.nav-menu') && 
                !e.target.closest('#mobile-menu-btn')) {
                this.closeMobileMenu();
            }
        });

        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-link[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.closest('.nav-link').getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = 80; // Height of fixed header
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });

        // Ensure theme persists when page becomes visible again (back button, etc.)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                const savedTheme = localStorage.getItem('theme') || 'dark';
                const currentTheme = document.documentElement.getAttribute('data-theme');
                
                if (currentTheme !== savedTheme) {
                    document.documentElement.setAttribute('data-theme', savedTheme);
                    this.updateThemeIcon(savedTheme);
                }
            }
        });

        const convertBtn = document.getElementById('convert-btn');
        const clearSourceBtn = document.getElementById('clear-source');
        const copySourceBtn = document.getElementById('copy-source');
        const copyOutputBtn = document.getElementById('copy-output');
        const downloadOutputBtn = document.getElementById('download-output');
        const templateBtns = document.querySelectorAll('.template-btn');

        if (convertBtn) {
            // Remove existing listeners to prevent duplicates
            convertBtn.removeEventListener('click', this.convertCode);
            convertBtn.addEventListener('click', () => {
                this.convertCode();
            });
        }
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });

        // Detect which tool page is open and set the default tab accordingly
        let defaultTab = 'language-converter';
        if (window.location.pathname.includes('text.html')) {
            defaultTab = 'case-converter';
        } else if (window.location.pathname.includes('converters.html')) {
            defaultTab = 'length';
        } else if (window.location.pathname.includes('image.html')) {
            defaultTab = 'converter';
        } else if (window.location.pathname.includes('pdf.html')) {
            defaultTab = 'compressor';
        } else if (window.location.pathname.includes('math.html')) {
            defaultTab = 'scientific';
        }
        this.switchTab(defaultTab);
    }

    switchTab(tabId) {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and content
        const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);

        if (selectedTab && selectedContent) {
            selectedTab.classList.add('active');
            selectedContent.classList.add('active');
            this.currentTab = tabId;

            // Trigger tab-specific initialization
            this.initializeTab(tabId);
        }
    }

    initializeTab(tabId) {
        // Initialize specific tab functionality
        switch (tabId) {
            case 'language-converter':
                this.initLanguageConverter();
                break;
            case 'expression-converter':
                this.initExpressionConverter();
                break;
            case 'expression-tree':
                this.initExpressionTree();
                break;
            case 'bst-converter':
                this.initBSTConverter();
                break;
            case 'normalization':
                this.initNormalization();
                break;
            case 'nfa-dfa':
                this.initNFADFA();
                break;
        }
    }

    // Tab-specific initializations
    initLanguageConverter() {
        const convertBtn = document.getElementById('convert-btn');
        const clearSourceBtn = document.getElementById('clear-source');
        const copySourceBtn = document.getElementById('copy-source');
        const copyOutputBtn = document.getElementById('copy-output');
        const downloadOutputBtn = document.getElementById('download-output');
        const templateBtns = document.querySelectorAll('.template-btn');

        if (convertBtn) {
            // Remove existing listeners to prevent duplicates
            convertBtn.removeEventListener('click', this.convertCode);
            convertBtn.addEventListener('click', () => {
                this.convertCode();
            });
        }

        if (clearSourceBtn) {
            clearSourceBtn.removeEventListener('click', this.clearSourceCode);
            clearSourceBtn.addEventListener('click', () => {
                document.getElementById('source-code').value = '';
                this.showSuccess('Source code cleared');
            });
        }

        if (copySourceBtn) {
            copySourceBtn.removeEventListener('click', this.copySourceCode);
            copySourceBtn.addEventListener('click', () => {
                const sourceCode = document.getElementById('source-code').value;
                if (sourceCode.trim()) {
                    this.copyToClipboard(sourceCode);
                } else {
                    this.showError('No code to copy');
                }
            });
        }

        if (copyOutputBtn) {
            copyOutputBtn.removeEventListener('click', this.copyOutputCode);
            copyOutputBtn.addEventListener('click', () => {
                const convertedCode = document.getElementById('converted-code').value;
                if (convertedCode.trim()) {
                    this.copyToClipboard(convertedCode);
                } else {
                    this.showError('No converted code to copy');
                }
            });
        }

        if (downloadOutputBtn) {
            downloadOutputBtn.removeEventListener('click', this.downloadOutputCode);
            downloadOutputBtn.addEventListener('click', () => {
                const convertedCode = document.getElementById('converted-code').value;
                const targetLanguage = document.getElementById('target-language').value;
                if (convertedCode.trim()) {
                    this.downloadCode(convertedCode, targetLanguage);
                } else {
                    this.showError('No converted code to download');
                }
            });
        }

        // Template buttons
        templateBtns.forEach((btn, index) => {
            btn.removeEventListener('click', this.handleTemplateClick);
            btn.addEventListener('click', () => {
                const templateName = btn.getAttribute('data-template');
                this.loadTemplate(templateName);
            });
        });

        // Auto-convert on language change
        const sourceLanguageSelect = document.getElementById('source-language');
        const targetLanguageSelect = document.getElementById('target-language');
        
        if (sourceLanguageSelect && targetLanguageSelect) {
            [sourceLanguageSelect, targetLanguageSelect].forEach(select => {
                select.removeEventListener('change', this.handleLanguageChange);
                select.addEventListener('change', () => {
                    const sourceCode = document.getElementById('source-code').value;
                    if (sourceCode.trim()) {
                        // Auto-convert after a short delay
                        setTimeout(() => this.convertCode(), 300);
                    }
                });
            });
        }
    }

    initExpressionConverter() {
        // Initialize enhanced expression converter
        if (typeof initExpressionConverter === 'function') {
            initExpressionConverter();
        }
    }

    initExpressionTree() {
        // Initialize enhanced expression tree generator
        if (typeof initExpressionTree === 'function') {
            initExpressionTree();
        }
    }

    initBSTConverter() {
        // Initialize BST converter functionality
        if (typeof initBSTConverter === 'function') {
            initBSTConverter();
        }
        
        // Add event listener for create BST button
        const createBSTBtn = document.getElementById('create-bst-btn');
        if (createBSTBtn) {
            createBSTBtn.addEventListener('click', function() {
                if (typeof createBST === 'function') {
                    createBST();
                }
            });
        }
        
        // Add event listeners for example items
        const exampleItems = document.querySelectorAll('.example-item');
        exampleItems.forEach(item => {
            item.addEventListener('click', function() {
                const numbers = item.getAttribute('data-numbers');
                if (numbers) {
                    document.getElementById('bst-input').value = numbers;
                    if (typeof createBST === 'function') {
                        createBST();
                    }
                }
            });
        });
    }

    initNormalization() {
        // Initialize normalization functionality
        if (typeof initNormalizationChecker === 'function') {
            initNormalizationChecker();
        }
        
        // Add event listeners for normalization functionality
        const addFDBtn = document.querySelector('.add-fd-btn');
        if (addFDBtn) {
            addFDBtn.addEventListener('click', function() {
                if (typeof addFD === 'function') {
                    addFD();
                }
            });
        }
        
        // Add event listeners for remove buttons
        document.addEventListener('click', function(e) {
            if (e.target.closest('.remove-fd-btn')) {
                if (typeof removeFD === 'function') {
                    removeFD(e.target.closest('.remove-fd-btn'));
                }
            }
        });
        
        // Add event listener for check normalization button
        const checkBtn = document.querySelector('.check-btn');
        if (checkBtn) {
            checkBtn.addEventListener('click', function() {
                if (typeof checkNormalization === 'function') {
                    checkNormalization();
                }
            });
        }
    }

    initNFADFA() {
        // Initialize NFA to DFA functionality
        if (typeof initNFAtoDFA === 'function') {
            initNFAtoDFA();
        }
        
        // Add event listeners for NFA to DFA functionality
        const addTransitionBtn = document.querySelector('.automata-container .btn');
        if (addTransitionBtn) {
            addTransitionBtn.addEventListener('click', function() {
                if (typeof addTransition === 'function') {
                    addTransition();
                }
            });
        }
        
        // Add event listeners for remove transition buttons
        document.addEventListener('click', function(e) {
            if (e.target.closest('.remove-transition-btn')) {
                if (typeof removeTransition === 'function') {
                    removeTransition(e.target.closest('.remove-transition-btn'));
                }
            }
        });
        
        // Add event listener for convert NFA to DFA button
        const convertBtn = document.querySelector('.convert-automata .btn');
        if (convertBtn) {
            convertBtn.addEventListener('click', function() {
                if (typeof convertNFAtoDFA === 'function') {
                    convertNFAtoDFA();
                }
            });
        }
    }

    // Language Converter Functions
    convertCode() {
        const sourceLanguage = document.getElementById('source-language');
        const targetLanguage = document.getElementById('target-language');
        const sourceCode = document.getElementById('source-code');
        const convertedCode = document.getElementById('converted-code');
        const statusElement = document.getElementById('conversion-status');

        if (!sourceLanguage || !targetLanguage || !sourceCode || !convertedCode || !statusElement) {
            this.showError('Required elements not found. Please refresh the page.');
            return;
        }

        const fromLang = sourceLanguage.value;
        const toLang = targetLanguage.value;
        const code = sourceCode.value;

        if (!code.trim()) {
            this.showError('Please enter source code to convert.');
            return;
        }

        if (fromLang === toLang) {
            this.showError('Source and target languages cannot be the same.');
            return;
        }

        // Show loading state
        statusElement.textContent = 'Converting...';
        statusElement.className = 'conversion-status loading';

        // Simulate processing time for better UX
        setTimeout(() => {
            try {
                const converted = this.convertCodeLogic(code, fromLang, toLang);
                
                convertedCode.value = converted;
                
                statusElement.textContent = 'Conversion completed successfully!';
                statusElement.className = 'conversion-status success';
                
                this.showSuccess('Code converted successfully!');
            } catch (error) {
                console.error('Conversion error:', error);
                statusElement.textContent = 'Conversion failed: ' + error.message;
                statusElement.className = 'conversion-status error';
                this.showError('Conversion failed: ' + error.message);
            }
        }, 500);
    }

    convertCodeLogic(code, fromLang, toLang) {
        // Enhanced code conversion logic
        const conversions = {
            'python-javascript': this.pythonToJavaScript,
            'javascript-python': this.javascriptToPython,
            'python-java': this.pythonToJava,
            'java-python': this.javaToPython,
            'python-cpp': this.pythonToCpp,
            'cpp-python': this.cppToPython,
            'javascript-java': this.javascriptToJava,
            'java-javascript': this.javaToJavaScript,
            'python-csharp': this.pythonToCSharp,
            'csharp-python': this.csharpToPython,
            'javascript-csharp': this.javascriptToCSharp,
            'csharp-javascript': this.csharpToJavaScript,
            'python-php': this.pythonToPhp,
            'php-python': this.phpToPython,
            'javascript-php': this.javascriptToPhp,
            'php-javascript': this.phpToJavaScript,
            'python-ruby': this.pythonToRuby,
            'ruby-python': this.rubyToPython,
            'python-go': this.pythonToGo,
            'go-python': this.goToPython,
            'python-rust': this.pythonToRust,
            'rust-python': this.rustToPython,
            'python-swift': this.pythonToSwift,
            'swift-python': this.swiftToPython
        };

        const key = `${fromLang}-${toLang}`;
        if (conversions[key]) {
            return conversions[key](code);
        }

        // Fallback conversion
        return this.genericConversion(code, fromLang, toLang);
    }

    // Python to JavaScript conversion
    pythonToJavaScript(code) {
        let converted = code
            // Function definitions
            .replace(/def\s+(\w+)\s*\(([^)]*)\)\s*:/g, 'function $1($2) {')
            .replace(/def\s+(\w+)\s*\(\)\s*:/g, 'function $1() {')
            
            // Print statements
            .replace(/print\s*\(([^)]+)\)/g, 'console.log($1)')
            .replace(/print\s*\(\)/g, 'console.log()')
            
            // Variable declarations
            .replace(/^(\s*)(\w+)\s*=\s*\[/gm, '$1const $2 = [')
            .replace(/^(\s*)(\w+)\s*=\s*\{/gm, '$1const $2 = {')
            .replace(/^(\s*)(\w+)\s*=\s*(\d+)/gm, '$1const $2 = $3')
            .replace(/^(\s*)(\w+)\s*=\s*['"`]/gm, '$1const $2 = $3')
            
            // List comprehensions
            .replace(/\[([^]]+)\s+for\s+(\w+)\s+in\s+(\w+)\]/g, '$3.map($2 => $1)')
            
            // For loops
            .replace(/for\s+(\w+)\s+in\s+range\s*\((\d+)\)\s*:/g, 'for (let $1 = 0; $1 < $2; $1++) {')
            .replace(/for\s+(\w+)\s+in\s+(\w+)\s*:/g, 'for (let $1 of $2) {')
            
            // If statements
            .replace(/if\s+([^:]+):/g, 'if ($1) {')
            .replace(/elif\s+([^:]+):/g, '} else if ($1) {')
            .replace(/else\s*:/g, '} else {')
            
            // Return statements
            .replace(/return\s+True/g, 'return true')
            .replace(/return\s+False/g, 'return false')
            .replace(/return\s+None/g, 'return null')
            
            // String methods
            .replace(/\.strip\(\)/g, '.trim()')
            .replace(/\.lower\(\)/g, '.toLowerCase()')
            .replace(/\.upper\(\)/g, '.toUpperCase()')
            
            // List methods
            .replace(/\.append\(/g, '.push(')
            .replace(/\.pop\(\)/g, '.pop()')
            .replace(/len\(/g, '$1.length')
            
            // Comments
            .replace(/^(\s*)#/gm, '$1//')
            
            // Indentation
            .replace(/\n(\s{4})/g, '\n$1')
            .replace(/\n(\s{8})/g, '\n$1$1');

        // Add closing braces for functions
        const lines = converted.split('\n');
        const result = [];
        let indentLevel = 0;

        for (let line of lines) {
            if (line.trim().endsWith('{')) {
                result.push(line);
                indentLevel++;
            } else if (line.trim() === '}') {
                indentLevel--;
                result.push(line);
            } else {
                result.push(line);
            }
        }

        // Add missing closing braces
        while (indentLevel > 0) {
            result.push('}');
            indentLevel--;
        }

        return result.join('\n');
    }

    // JavaScript to Python conversion
    javascriptToPython(code) {
        let converted = code
            // Function declarations
            .replace(/function\s+(\w+)\s*\(([^)]*)\)\s*\{/g, 'def $1($2):')
            .replace(/function\s+(\w+)\s*\(\)\s*\{/g, 'def $1():')
            
            // Console.log
            .replace(/console\.log\s*\(([^)]+)\)/g, 'print($1)')
            .replace(/console\.log\s*\(\)/g, 'print()')
            
            // Variable declarations
            .replace(/^(\s*)const\s+(\w+)\s*=/gm, '$1$2 =')
            .replace(/^(\s*)let\s+(\w+)\s*=/gm, '$1$2 =')
            .replace(/^(\s*)var\s+(\w+)\s*=/gm, '$1$2 =')
            
            // For loops
            .replace(/for\s*\(\s*let\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)\s*;\s*\1\+\+\)\s*\{/g, 'for $1 in range($2, $3):')
            .replace(/for\s*\(\s*let\s+(\w+)\s+of\s+(\w+)\s*\)\s*\{/g, 'for $1 in $2:')
            
            // If statements
            .replace(/if\s*\(([^)]+)\)\s*\{/g, 'if $1:')
            .replace(/\}\s*else\s+if\s*\(([^)]+)\)\s*\{/g, 'elif $1:')
            .replace(/\}\s*else\s*\{/g, 'else:')
            
            // Return statements
            .replace(/return\s+true/g, 'return True')
            .replace(/return\s+false/g, 'return False')
            .replace(/return\s+null/g, 'return None')
            
            // String methods
            .replace(/\.trim\(\)/g, '.strip()')
            .replace(/\.toLowerCase\(\)/g, '.lower()')
            .replace(/\.toUpperCase\(\)/g, '.upper()')
            
            // Array methods
            .replace(/\.push\(/g, '.append(')
            .replace(/\.pop\(\)/g, '.pop()')
            .replace(/\.length/g, 'len()')
            
            // Comments
            .replace(/^(\s*)\/\//gm, '$1#')
            
            // Remove semicolons
            .replace(/;/g, '')
            
            // Remove braces and fix indentation
            .replace(/\s*\{\s*/g, '')
            .replace(/\s*\}\s*/g, '');

        // Fix indentation
        const lines = converted.split('\n');
        const result = [];
        let indentLevel = 0;

        for (let line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                result.push('    '.repeat(indentLevel) + trimmed);
                if (trimmed.endsWith(':')) {
                    indentLevel++;
                }
            } else if (trimmed) {
                result.push('    '.repeat(indentLevel) + trimmed);
            } else {
                result.push('');
            }
        }

        return result.join('\n');
    }

    // Python to Java conversion
    pythonToJava(code) {
        let converted = code
            // Function definitions
            .replace(/def\s+(\w+)\s*\(([^)]*)\)\s*:/g, 'public static void $1($2) {')
            .replace(/def\s+(\w+)\s*\(\)\s*:/g, 'public static void $1() {')
            
            // Print statements
            .replace(/print\s*\(([^)]+)\)/g, 'System.out.println($1)')
            .replace(/print\s*\(\)/g, 'System.out.println()')
            
            // Variable declarations
            .replace(/^(\s*)(\w+)\s*=\s*\[/gm, '$1int[] $2 = {')
            .replace(/^(\s*)(\w+)\s*=\s*(\d+)/gm, '$1int $2 = $3')
            .replace(/^(\s*)(\w+)\s*=\s*['"`]/gm, '$1String $2 = $3')
            
            // For loops
            .replace(/for\s+(\w+)\s+in\s+range\s*\((\d+)\)\s*:/g, 'for (int $1 = 0; $1 < $2; $1++) {')
            
            // If statements
            .replace(/if\s+([^:]+):/g, 'if ($1) {')
            .replace(/elif\s+([^:]+):/g, '} else if ($1) {')
            .replace(/else\s*:/g, '} else {')
            
            // Return statements
            .replace(/return\s+True/g, 'return true')
            .replace(/return\s+False/g, 'return false')
            .replace(/return\s+None/g, 'return null')
            
            // Comments
            .replace(/^(\s*)#/gm, '$1//')
            
            // Add class wrapper
            .replace(/^/gm, '    ');

        return `public class ConvertedCode {
    public static void main(String[] args) {
${converted}
    }
}`;
    }

    // Java to Python conversion
    javaToPython(code) {
        let converted = code
            // Remove class and main method
            .replace(/public\s+class\s+\w+\s*\{/g, '')
            .replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{/g, '')
            .replace(/\s*\}\s*$/g, '')
            
            // Function declarations
            .replace(/public\s+static\s+void\s+(\w+)\s*\(([^)]*)\)\s*\{/g, 'def $1($2):')
            .replace(/public\s+static\s+void\s+(\w+)\s*\(\)\s*\{/g, 'def $1():')
            
            // Print statements
            .replace(/System\.out\.println\s*\(([^)]+)\)/g, 'print($1)')
            .replace(/System\.out\.println\s*\(\)/g, 'print()')
            
            // Variable declarations
            .replace(/^(\s*)int\s+(\w+)\s*=/gm, '$1$2 =')
            .replace(/^(\s*)String\s+(\w+)\s*=/gm, '$1$2 =')
            .replace(/^(\s*)int\[\]\s+(\w+)\s*=/gm, '$1$2 = [')
            
            // For loops
            .replace(/for\s*\(\s*int\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)\s*;\s*\1\+\+\)\s*\{/g, 'for $1 in range($2, $3):')
            
            // If statements
            .replace(/if\s*\(([^)]+)\)\s*\{/g, 'if $1:')
            .replace(/\}\s*else\s+if\s*\(([^)]+)\)\s*\{/g, 'elif $1:')
            .replace(/\}\s*else\s*\{/g, 'else:')
            
            // Return statements
            .replace(/return\s+true/g, 'return True')
            .replace(/return\s+false/g, 'return False')
            .replace(/return\s+null/g, 'return None')
            
            // Comments
            .replace(/^(\s*)\/\//gm, '$1//')
            
            // Remove semicolons and braces
            .replace(/;/g, '')
            .replace(/\s*\{\s*/g, '')
            .replace(/\s*\}\s*/g, '');

        // Fix indentation
        const lines = converted.split('\n');
        const result = [];
        let indentLevel = 0;

        for (let line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                result.push('    '.repeat(indentLevel) + trimmed);
                if (trimmed.endsWith(':')) {
                    indentLevel++;
                }
            } else if (trimmed) {
                result.push('    '.repeat(indentLevel) + trimmed);
            } else {
                result.push('');
            }
        }

        return result.join('\n');
    }

    // Python to C++ conversion
    pythonToCpp(code) {
        let converted = code
            // Function definitions
            .replace(/def\s+(\w+)\s*\(([^)]*)\)\s*:/g, 'void $1($2) {')
            .replace(/def\s+(\w+)\s*\(\)\s*:/g, 'void $1() {')
            
            // Print statements
            .replace(/print\s*\(([^)]+)\)/g, 'std::cout << $1 << std::endl')
            .replace(/print\s*\(\)/g, 'std::cout << std::endl')
            
            // Variable declarations
            .replace(/^(\s*)(\w+)\s*=\s*\[/gm, '$1std::vector<int> $2 = {')
            .replace(/^(\s*)(\w+)\s*=\s*(\d+)/gm, '$1int $2 = $3')
            .replace(/^(\s*)(\w+)\s*=\s*['"`]/gm, '$1std::string $2 = $3')
            
            // For loops
            .replace(/for\s+(\w+)\s+in\s+range\s*\((\d+)\)\s*:/g, 'for (int $1 = 0; $1 < $2; $1++) {')
            
            // If statements
            .replace(/if\s+([^:]+):/g, 'if ($1) {')
            .replace(/elif\s+([^:]+):/g, '} else if ($1) {')
            .replace(/else\s*:/g, '} else {')
            
            // Return statements
            .replace(/return\s+True/g, 'return true')
            .replace(/return\s+False/g, 'return false')
            .replace(/return\s+None/g, 'return 0')
            
            // Comments
            .replace(/^(\s*)#/gm, '$1//')
            
            // Add includes and main function
            .replace(/^/gm, '    ');

        return `#include <iostream>
#include <vector>
#include <string>

${converted}

int main() {
    // Your code here
    return 0;
}`;
    }

    // C++ to Python conversion
    cppToPython(code) {
        let converted = code
            // Remove includes and main function
            .replace(/#include\s+<[^>]+>/g, '')
            .replace(/int\s+main\s*\([^)]*\)\s*\{/g, '')
            .replace(/\s*return\s+0;\s*\}/g, '')
            
            // Function declarations
            .replace(/void\s+(\w+)\s*\(([^)]*)\)\s*\{/g, 'def $1($2):')
            .replace(/void\s+(\w+)\s*\(\)\s*\{/g, 'def $1():')
            
            // Print statements
            .replace(/std::cout\s*<<\s*([^;]+)\s*<<\s*std::endl/g, 'print($1)')
            .replace(/std::cout\s*<<\s*std::endl/g, 'print()')
            
            // Variable declarations
            .replace(/^(\s*)int\s+(\w+)\s*=/gm, '$1$2 =')
            .replace(/^(\s*)std::string\s+(\w+)\s*=/gm, '$1$2 =')
            .replace(/^(\s*)std::vector<int>\s+(\w+)\s*=/gm, '$1$2 = [')
            
            // For loops
            .replace(/for\s*\(\s*int\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)\s*;\s*\1\+\+\)\s*\{/g, 'for $1 in range($2, $3):')
            
            // If statements
            .replace(/if\s*\(([^)]+)\)\s*\{/g, 'if $1:')
            .replace(/\}\s*else\s+if\s*\(([^)]+)\)\s*\{/g, 'elif $1:')
            .replace(/\}\s*else\s*\{/g, 'else:')
            
            // Return statements
            .replace(/return\s+true/g, 'return True')
            .replace(/return\s+false/g, 'return False')
            .replace(/return\s+\d+/g, 'return 0')
            
            // Comments
            .replace(/^(\s*)\/\//gm, '$1#')
            
            // Remove semicolons and braces
            .replace(/;/g, '')
            .replace(/\s*\{\s*/g, '')
            .replace(/\s*\}\s*/g, '');

        // Fix indentation
        const lines = converted.split('\n');
        const result = [];
        let indentLevel = 0;

        for (let line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                result.push('    '.repeat(indentLevel) + trimmed);
                if (trimmed.endsWith(':')) {
                    indentLevel++;
                }
            } else if (trimmed) {
                result.push('    '.repeat(indentLevel) + trimmed);
            } else {
                result.push('');
            }
        }

        return result.join('\n');
    }

    // Python to C# conversion
    pythonToCSharp(code) {
        let converted = code
            // Function definitions
            .replace(/def\s+(\w+)\s*\(([^)]*)\)\s*:/g, 'static void $1($2) {')
            .replace(/def\s+(\w+)\s*\(\)\s*:/g, 'static void $1() {')
            
            // Print statements
            .replace(/print\s*\(([^)]+)\)/g, 'Console.WriteLine($1)')
            .replace(/print\s*\(\)/g, 'Console.WriteLine()')
            
            // Variable declarations
            .replace(/^(\s*)(\w+)\s*=\s*\[/gm, '$1int[] $2 = {')
            .replace(/^(\s*)(\w+)\s*=\s*(\d+)/gm, '$1int $2 = $3')
            .replace(/^(\s*)(\w+)\s*=\s*['"`]/gm, '$1string $2 = $3')
            
            // For loops
            .replace(/for\s+(\w+)\s+in\s+range\s*\((\d+)\)\s*:/g, 'for (int $1 = 0; $1 < $2; $1++) {')
            
            // If statements
            .replace(/if\s+([^:]+):/g, 'if ($1) {')
            .replace(/elif\s+([^:]+):/g, '} else if ($1) {')
            .replace(/else\s*:/g, '} else {')
            
            // Return statements
            .replace(/return\s+True/g, 'return true')
            .replace(/return\s+False/g, 'return false')
            .replace(/return\s+None/g, 'return null')
            
            // Comments
            .replace(/^(\s*)#/gm, '$1//')
            
            // Add class wrapper
            .replace(/^/gm, '        ');

        return `using System;

class Program {
    static void Main(string[] args) {
${converted}
    }
}`;
    }

    // C# to Python conversion
    csharpToPython(code) {
        let converted = code
            // Remove using and class declarations
            .replace(/using\s+System;/g, '')
            .replace(/class\s+\w+\s*\{/g, '')
            .replace(/static\s+void\s+Main\s*\([^)]*\)\s*\{/g, '')
            .replace(/\s*\}\s*$/g, '')
            
            // Function declarations
            .replace(/static\s+void\s+(\w+)\s*\(([^)]*)\)\s*\{/g, 'def $1($2):')
            .replace(/static\s+void\s+(\w+)\s*\(\)\s*\{/g, 'def $1():')
            
            // Print statements
            .replace(/Console\.WriteLine\s*\(([^)]+)\)/g, 'print($1)')
            .replace(/Console\.WriteLine\s*\(\)/g, 'print()')
            
            // Variable declarations
            .replace(/^(\s*)int\s+(\w+)\s*=/gm, '$1$2 =')
            .replace(/^(\s*)string\s+(\w+)\s*=/gm, '$1$2 =')
            .replace(/^(\s*)int\[\]\s+(\w+)\s*=/gm, '$1$2 = [')
            
            // For loops
            .replace(/for\s*\(\s*int\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)\s*;\s*\1\+\+\)\s*\{/g, 'for $1 in range($2, $3):')
            
            // If statements
            .replace(/if\s*\(([^)]+)\)\s*\{/g, 'if $1:')
            .replace(/\}\s*else\s+if\s*\(([^)]+)\)\s*\{/g, 'elif $1:')
            .replace(/\}\s*else\s*\{/g, 'else:')
            
            // Return statements
            .replace(/return\s+true/g, 'return True')
            .replace(/return\s+false/g, 'return False')
            .replace(/return\s+null/g, 'return None')
            
            // Comments
            .replace(/^(\s*)\/\//gm, '$1#')
            
            // Remove semicolons and braces
            .replace(/;/g, '')
            .replace(/\s*\{\s*/g, '')
            .replace(/\s*\}\s*/g, '');

        // Fix indentation
        const lines = converted.split('\n');
        const result = [];
        let indentLevel = 0;

        for (let line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                result.push('    '.repeat(indentLevel) + trimmed);
                if (trimmed.endsWith(':')) {
                    indentLevel++;
                }
            } else if (trimmed) {
                result.push('    '.repeat(indentLevel) + trimmed);
            } else {
                result.push('');
            }
        }

        return result.join('\n');
    }

    // Python to PHP conversion
    pythonToPhp(code) {
        let converted = code
            // Function definitions
            .replace(/def\s+(\w+)\s*\(([^)]*)\)\s*:/g, 'function $1($2) {')
            .replace(/def\s+(\w+)\s*\(\)\s*:/g, 'function $1() {')
            
            // Print statements
            .replace(/print\s*\(([^)]+)\)/g, 'echo $1;')
            .replace(/print\s*\(\)/g, 'echo "";')
            
            // Variable declarations
            .replace(/^(\s*)(\w+)\s*=\s*\[/gm, '$1$2 = [')
            .replace(/^(\s*)(\w+)\s*=\s*(\d+)/gm, '$1$2 = $3;')
            .replace(/^(\s*)(\w+)\s*=\s*['"`]/gm, '$1$2 = $3;')
            
            // For loops
            .replace(/for\s+(\w+)\s+in\s+range\s*\((\d+)\)\s*:/g, 'for ($1 = 0; $1 < $2; $1++) {')
            
            // If statements
            .replace(/if\s+([^:]+):/g, 'if ($1) {')
            .replace(/elif\s+([^:]+):/g, '} else if ($1) {')
            .replace(/else\s*:/g, '} else {')
            
            // Return statements
            .replace(/return\s+True/g, 'return true;')
            .replace(/return\s+False/g, 'return false;')
            .replace(/return\s+None/g, 'return null;')
            
            // Comments
            .replace(/^(\s*)#/gm, '$1//')
            
            // Add PHP tags
            .replace(/^/gm, '    ');

        return `<?php
${converted}
?>`;
    }

    // PHP to Python conversion
    phpToPython(code) {
        let converted = code
            // Remove PHP tags
            .replace(/<\?php/g, '')
            .replace(/\?>/g, '')
            
            // Function declarations
            .replace(/function\s+(\w+)\s*\(([^)]*)\)\s*\{/g, 'def $1($2):')
            .replace(/function\s+(\w+)\s*\(\)\s*\{/g, 'def $1():')
            
            // Print statements
            .replace(/echo\s+([^;]+);/g, 'print($1)')
            .replace(/echo\s+"";/g, 'print()')
            
            // Variable declarations
            .replace(/^(\s*)(\w+)\s*=/gm, '$1$2 =')
            
            // For loops
            .replace(/for\s*\(\s*(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)\s*;\s*\1\+\+\)\s*\{/g, 'for ($1 = $2; $1 < $3; $1++) {')
            .replace(/foreach\s*\(\s*(\w+)\s+as\s+(\w+)\s*\)\s*\{/g, 'for (let $2 of $1) {')
            
            // If statements
            .replace(/if\s*\(([^)]+)\)\s*\{/g, 'if ($1) {')
            .replace(/\}\s*else\s+if\s*\(([^)]+)\)\s*\{/g, '} else if ($1) {')
            .replace(/\}\s*else\s*\{/g, '} else {')
            
            // Return statements
            .replace(/return\s+true/g, 'return True')
            .replace(/return\s+false/g, 'return False')
            .replace(/return\s+null/g, 'return None')
            
            // Comments
            .replace(/^(\s*)\/\//gm, '$1//')
            
            // Remove semicolons and braces
            .replace(/;/g, '')
            .replace(/\s*\{\s*/g, '')
            .replace(/\s*\}\s*/g, '');

        return converted;
    }

    // JavaScript to Java conversion
    javascriptToJava(code) {
        let converted = code
            // Function declarations
            .replace(/function\s+(\w+)\s*\(([^)]*)\)\s*\{/g, 'public static void $1($2) {')
            .replace(/function\s+(\w+)\s*\(\)\s*\{/g, 'public static void $1() {')
            
            // Console.log
            .replace(/console\.log\s*\(([^)]+)\)/g, 'System.out.println($1)')
            .replace(/console\.log\s*\(\)/g, 'System.out.println()')
            
            // Variable declarations
            .replace(/^(\s*)const\s+(\w+)\s*=/gm, '$1int $2 =')
            .replace(/^(\s*)let\s+(\w+)\s*=/gm, '$1int $2 =')
            .replace(/^(\s*)var\s+(\w+)\s*=/gm, '$1int $2 =')
            
            // For loops
            .replace(/for\s*\(\s*let\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)\s*;\s*\1\+\+\)\s*\{/g, 'for (int $1 = $2; $1 < $3; $1++) {')
            .replace(/for\s*\(\s*let\s+(\w+)\s+of\s+(\w+)\s*\)\s*\{/g, 'for (int $1 : $2) {')
            
            // If statements
            .replace(/if\s*\(([^)]+)\)\s*\{/g, 'if ($1) {')
            .replace(/\}\s*else\s+if\s*\(([^)]+)\)\s*\{/g, '} else if ($1) {')
            .replace(/\}\s*else\s*\{/g, '} else {')
            
            // Return statements
            .replace(/return\s+true/g, 'return true')
            .replace(/return\s+false/g, 'return false')
            .replace(/return\s+null/g, 'return null')
            
            // Comments
            .replace(/^(\s*)\/\//gm, '$1//')
            
            // Add class wrapper
            .replace(/^/gm, '    ');

        return `public class ConvertedCode {
    public static void main(String[] args) {
${converted}
    }
}`;
    }

    // Java to JavaScript conversion
    javaToJavaScript(code) {
        let converted = code
            // Remove class and main method
            .replace(/public\s+class\s+\w+\s*\{/g, '')
            .replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{/g, '')
            .replace(/\s*\}\s*$/g, '')
            
            // Function declarations
            .replace(/public\s+static\s+void\s+(\w+)\s*\(([^)]*)\)\s*\{/g, 'function $1($2) {')
            .replace(/public\s+static\s+void\s+(\w+)\s*\(\)\s*\{/g, 'function $1() {')
            
            // Print statements
            .replace(/System\.out\.println\s*\(([^)]+)\)/g, 'console.log($1)')
            .replace(/System\.out\.println\s*\(\)/g, 'console.log()')
            
            // Variable declarations
            .replace(/^(\s*)int\s+(\w+)\s*=/gm, '$1let $2 =')
            .replace(/^(\s*)String\s+(\w+)\s*=/gm, '$1let $2 =')
            
            // For loops
            .replace(/for\s*\(\s*int\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)\s*;\s*\1\+\+\)\s*\{/g, 'for (let $1 = $2; $1 < $3; $1++) {')
            .replace(/for\s*\(\s*int\s+(\w+)\s*:\s*(\w+)\s*\)\s*\{/g, 'for (let $1 of $2) {')
            
            // If statements
            .replace(/if\s*\(([^)]+)\)\s*\{/g, 'if ($1) {')
            .replace(/\}\s*else\s+if\s*\(([^)]+)\)\s*\{/g, '} else if ($1) {')
            .replace(/\}\s*else\s*\{/g, '} else {')
            
            // Return statements
            .replace(/return\s+true/g, 'return true')
            .replace(/return\s+false/g, 'return false')
            .replace(/return\s+null/g, 'return null')
            
            // Comments
            .replace(/^(\s*)\/\//gm, '$1//')
            
            // Remove semicolons and braces
            .replace(/;/g, '')
            .replace(/\s*\{\s*/g, '')
            .replace(/\s*\}\s*/g, '');

        return converted;
    }

    // JavaScript to C# conversion
    javascriptToCSharp(code) {
        let converted = code
            // Function declarations
            .replace(/function\s+(\w+)\s*\(([^)]*)\)\s*\{/g, 'static void $1($2) {')
            .replace(/function\s+(\w+)\s*\(\)\s*\{/g, 'static void $1() {')
            
            // Console.log
            .replace(/console\.log\s*\(([^)]+)\)/g, 'Console.WriteLine($1)')
            .replace(/console\.log\s*\(\)/g, 'Console.WriteLine()')
            
            // Variable declarations
            .replace(/^(\s*)const\s+(\w+)\s*=/gm, '$1int $2 =')
            .replace(/^(\s*)let\s+(\w+)\s*=/gm, '$1int $2 =')
            .replace(/^(\s*)var\s+(\w+)\s*=/gm, '$1int $2 =')
            
            // For loops
            .replace(/for\s*\(\s*let\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)\s*;\s*\1\+\+\)\s*\{/g, 'for (int $1 = $2; $1 < $3; $1++) {')
            .replace(/for\s*\(\s*let\s+(\w+)\s+of\s+(\w+)\s*\)\s*\{/g, 'foreach (int $1 in $2) {')
            
            // If statements
            .replace(/if\s*\(([^)]+)\)\s*\{/g, 'if ($1) {')
            .replace(/\}\s*else\s+if\s*\(([^)]+)\)\s*\{/g, '} else if ($1) {')
            .replace(/\}\s*else\s*\{/g, '} else {')
            
            // Return statements
            .replace(/return\s+true/g, 'return true')
            .replace(/return\s+false/g, 'return false')
            .replace(/return\s+null/g, 'return null')
            
            // Comments
            .replace(/^(\s*)\/\//gm, '$1//')
            
            // Add class wrapper
            .replace(/^/gm, '        ');

        return `using System;

class Program {
    static void Main(string[] args) {
${converted}
    }
}`;
    }

    // C# to JavaScript conversion
    csharpToJavaScript(code) {
        let converted = code
            // Remove using and class declarations
            .replace(/using\s+System;/g, '')
            .replace(/class\s+\w+\s*\{/g, '')
            .replace(/static\s+void\s+Main\s*\([^)]*\)\s*\{/g, '')
            .replace(/\s*\}\s*$/g, '')
            
            // Function declarations
            .replace(/static\s+void\s+(\w+)\s*\(([^)]*)\)\s*\{/g, 'function $1($2) {')
            .replace(/static\s+void\s+(\w+)\s*\(\)\s*\{/g, 'function $1() {')
            
            // Print statements
            .replace(/Console\.WriteLine\s*\(([^)]+)\)/g, 'console.log($1)')
            .replace(/Console\.WriteLine\s*\(\)/g, 'console.log()')
            
            // Variable declarations
            .replace(/^(\s*)int\s+(\w+)\s*=/gm, '$1let $2 =')
            .replace(/^(\s*)string\s+(\w+)\s*=/gm, '$1let $2 =')
            
            // For loops
            .replace(/for\s*\(\s*int\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)\s*;\s*\1\+\+\)\s*\{/g, 'for (let $1 = $2; $1 < $3; $1++) {')
            .replace(/foreach\s*\(\s*int\s+(\w+)\s+in\s+(\w+)\s*\)\s*\{/g, 'for (let $1 of $2) {')
            
            // If statements
            .replace(/if\s*\(([^)]+)\)\s*\{/g, 'if ($1) {')
            .replace(/\}\s*else\s+if\s*\(([^)]+)\)\s*\{/g, '} else if ($1) {')
            .replace(/\}\s*else\s*\{/g, '} else {')
            
            // Return statements
            .replace(/return\s+true/g, 'return true')
            .replace(/return\s+false/g, 'return false')
            .replace(/return\s+null/g, 'return null')
            
            // Comments
            .replace(/^(\s*)\/\//gm, '$1//')
            
            // Remove semicolons and braces
            .replace(/;/g, '')
            .replace(/\s*\{\s*/g, '')
            .replace(/\s*\}\s*/g, '');

        return converted;
    }

    // JavaScript to PHP conversion
    javascriptToPhp(code) {
        let converted = code
            // Function declarations
            .replace(/function\s+(\w+)\s*\(([^)]*)\)\s*\{/g, 'function $1($2) {')
            .replace(/function\s+(\w+)\s*\(\)\s*\{/g, 'function $1() {')
            
            // Console.log
            .replace(/console\.log\s*\(([^)]+)\)/g, 'echo $1;')
            .replace(/console\.log\s*\(\)/g, 'echo "";')
            
            // Variable declarations
            .replace(/^(\s*)const\s+(\w+)\s*=/gm, '$1$2 =')
            .replace(/^(\s*)let\s+(\w+)\s*=/gm, '$1$2 =')
            .replace(/^(\s*)var\s+(\w+)\s*=/gm, '$1$2 =')
            
            // For loops
            .replace(/for\s*\(\s*let\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)\s*;\s*\1\+\+\)\s*\{/g, 'for ($1 = $2; $1 < $3; $1++) {')
            .replace(/for\s*\(\s*let\s+(\w+)\s+of\s+(\w+)\s*\)\s*\{/g, 'foreach ($2 as $1) {')
            
            // If statements
            .replace(/if\s*\(([^)]+)\)\s*\{/g, 'if ($1) {')
            .replace(/\}\s*else\s+if\s*\(([^)]+)\)\s*\{/g, '} else if ($1) {')
            .replace(/\}\s*else\s*\{/g, '} else {')
            
            // Return statements
            .replace(/return\s+true/g, 'return true;')
            .replace(/return\s+false/g, 'return false;')
            .replace(/return\s+null/g, 'return null;')
            
            // Comments
            .replace(/^(\s*)\/\//gm, '$1//')
            
            // Add PHP tags
            .replace(/^/gm, '    ');

        return `<?php
${converted}
?>`;
    }

    // Placeholder functions for other language conversions
    pythonToRuby(code) { return this.genericConversion(code, 'python', 'ruby'); }
    rubyToPython(code) { return this.genericConversion(code, 'ruby', 'python'); }
    pythonToGo(code) { return this.genericConversion(code, 'python', 'go'); }
    goToPython(code) { return this.genericConversion(code, 'go', 'python'); }
    pythonToRust(code) { return this.genericConversion(code, 'python', 'rust'); }
    rustToPython(code) { return this.genericConversion(code, 'rust', 'python'); }
    pythonToSwift(code) { return this.genericConversion(code, 'python', 'swift'); }
    swiftToPython(code) { return this.genericConversion(code, 'swift', 'python'); }

    // Generic conversion for unsupported language pairs
    genericConversion(code, fromLang, toLang) {
        return `// Converted from ${fromLang} to ${toLang}
// Original code:
${code.split('\n').map(line => `// ${line}`).join('\n')}

// TODO: Implement proper conversion logic for ${fromLang} to ${toLang}
// This is a placeholder conversion. Please implement the actual conversion logic.

// Note: This conversion may not be accurate and should be reviewed manually.`;
    }

    // Template system
    loadTemplate(templateName) {
        console.log('Loading template:', templateName);
        
        const templates = {
            'hello-world': {
                python: `def hello_world():
    print("Hello, World!")
    return True

if __name__ == "__main__":
    hello_world()`,
                javascript: `function helloWorld() {
    console.log("Hello, World!");
    return true;
}

helloWorld();`,
                java: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
                cpp: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
                csharp: `using System;

class Program {
    static void Main(string[] args) {
        Console.WriteLine("Hello, World!");
    }
}`,
                php: `<?php
function helloWorld() {
    echo "Hello, World!";
}

helloWorld();
?>`
            },
            'fibonacci': {
                python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test the function
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`,
                javascript: `function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n-1) + fibonacci(n-2);
}

// Test the function
for (let i = 0; i < 10; i++) {
    console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`,
                java: `public class Fibonacci {
    public static int fibonacci(int n) {
        if (n <= 1) {
            return n;
        }
        return fibonacci(n-1) + fibonacci(n-2);
    }
    
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            System.out.println("F(" + i + ") = " + fibonacci(i));
        }
    }
}`,
                cpp: `#include <iostream>

int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n-1) + fibonacci(n-2);
}

int main() {
    for (int i = 0; i < 10; i++) {
        std::cout << "F(" << i << ") = " << fibonacci(i) << std::endl;
    }
    return 0;
}`,
                csharp: `using System;

class Program {
    static int Fibonacci(int n) {
        if (n <= 1) {
            return n;
        }
        return Fibonacci(n-1) + Fibonacci(n-2);
    }
    
    static void Main(string[] args) {
        for (int i = 0; i < 10; i++) {
            Console.WriteLine($"F({i}) = {Fibonacci(i)}");
        }
    }
}`,
                php: `<?php
function fibonacci($n) {
    if ($n <= 1) {
        return $n;
    }
    return fibonacci($n-1) + fibonacci($n-2);
}

// Test the function
for ($i = 0; $i < 10; $i++) {
    echo "F($i) = " . fibonacci($i) . "\\n";
}
?>`
            },
            'sort-array': {
                python: `# Sort array in Python
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", numbers)

# Sort in ascending order
numbers.sort()
print("Sorted array:", numbers)

# Sort in descending order
numbers.sort(reverse=True)
print("Reverse sorted:", numbers)`,
                javascript: `// Sort array in JavaScript
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", numbers);

// Sort in ascending order
numbers.sort((a, b) => a - b);
console.log("Sorted array:", numbers);

// Sort in descending order
numbers.sort((a, b) => b - a);
console.log("Reverse sorted:", numbers);`,
                java: `import java.util.Arrays;

public class ArraySort {
    public static void main(String[] args) {
        int[] numbers = {64, 34, 25, 12, 22, 11, 90};
        System.out.println("Original array: " + Arrays.toString(numbers));
        
        // Sort in ascending order
        Arrays.sort(numbers);
        System.out.println("Sorted array: " + Arrays.toString(numbers));
        
        // Sort in descending order (using Integer array)
        Integer[] numbersDesc = {64, 34, 25, 12, 22, 11, 90};
        Arrays.sort(numbersDesc, (a, b) -> b.compareTo(a));
        System.out.println("Reverse sorted: " + Arrays.toString(numbersDesc));
    }
}`,
                cpp: `#include <iostream>
#include <algorithm>
#include <vector>

int main() {
    std::vector<int> numbers = {64, 34, 25, 12, 22, 11, 90};
    
    std::cout << "Original array: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // Sort in ascending order
    std::sort(numbers.begin(), numbers.end());
    std::cout << "Sorted array: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // Sort in descending order
    std::sort(numbers.begin(), numbers.end(), std::greater<int>());
    std::cout << "Reverse sorted: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`,
                csharp: `using System;
using System.Linq;

class Program {
    static void Main(string[] args) {
        int[] numbers = {64, 34, 25, 12, 22, 11, 90};
        Console.WriteLine("Original array: " + string.Join(", ", numbers));
        
        // Sort in ascending order
        Array.Sort(numbers);
        Console.WriteLine("Sorted array: " + string.Join(", ", numbers));
        
        // Sort in descending order
        Array.Sort(numbers, (a, b) => b.CompareTo(a));
        Console.WriteLine("Reverse sorted: " + string.Join(", ", numbers));
    }
}`,
                php: `<?php
// Sort array in PHP
$numbers = [64, 34, 25, 12, 22, 11, 90];
echo "Original array: " . implode(", ", $numbers) . "\\n";

// Sort in ascending order
sort($numbers);
echo "Sorted array: " . implode(", ", $numbers) . "\\n";

// Sort in descending order
rsort($numbers);
echo "Reverse sorted: " . implode(", ", $numbers) . "\\n";
?>`
            }
        };

        const currentLang = document.getElementById('source-language');
        const template = templates[templateName];
        
        console.log('Template found:', !!template);
        console.log('Current language element:', !!currentLang);
        
        if (template && currentLang) {
            const lang = currentLang.value;
            console.log('Current language:', lang);
            
            if (template[lang]) {
                console.log('Template for language found, setting source code...');
                document.getElementById('source-code').value = template[lang];
                this.showSuccess(`Loaded ${templateName} template in ${lang}`);
                
                // Auto-convert after loading template
                setTimeout(() => {
                    this.convertCode();
                }, 100);
            } else {
                console.log('Template not available for language:', lang);
                this.showError(`Template not available for ${lang}`);
            }
        } else {
            console.error('Template or language element not found');
            this.showError('Template loading failed');
        }
    }

    // Copy functionality
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showSuccess('Code copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showSuccess('Code copied to clipboard!');
        });
    }

    // Download functionality
    downloadCode(code, language) {
        const extensions = {
            'python': 'py',
            'javascript': 'js',
            'java': 'java',
            'cpp': 'cpp',
            'csharp': 'cs',
            'php': 'php',
            'ruby': 'rb',
            'go': 'go',
            'rust': 'rs',
            'swift': 'swift'
        };

        const ext = extensions[language] || 'txt';
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted_code.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccess(`Code downloaded as converted_code.${ext}`);
    }

    // Theme Management
    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-icon');
        if (!themeIcon) return;

        if (theme === 'dark') {
            // Show sun icon for dark mode
            themeIcon.innerHTML = `
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            `;
        } else {
            // Show moon icon for light mode
            themeIcon.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            `;
        }
    }

    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.toggle('active');
        }
    }

    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }

    // Notification Methods
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        console.log(`Notification [${type}]:`, message);
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize tools manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.toolsManager = new ToolsManager();
    
    // Fallback initialization for language converter
    setTimeout(() => {
        if (window.toolsManager) {
            window.toolsManager.initializeTab('language-converter');
        }
    }, 1000);
});

// Additional fallback for when the page is fully loaded
window.addEventListener('load', () => {
    if (window.toolsManager) {
        // Check if language converter is properly initialized
        const convertBtn = document.getElementById('convert-btn');
        if (convertBtn && !convertBtn.hasAttribute('data-initialized')) {
            window.toolsManager.initializeTab('language-converter');
            convertBtn.setAttribute('data-initialized', 'true');
        }
    }
});

// Add notification animations
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet); 