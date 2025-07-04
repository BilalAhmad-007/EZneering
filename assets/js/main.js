// Main JavaScript for EZneering
class EZneeringApp {
    constructor() {
        this.tools = [
            {
                category: 'Developer Tools',
                icon: '💻',
                title: 'Developer Tools',
                description: 'Programming language converters, expression trees, normalization checkers, K-map solver, and more.',
                count: '7 tools',
                url: 'tools/developer.html',
                tools: [
                    'Programming Language Converter',
                    'Infix/Postfix/Prefix Converter',
                    'Expression Tree Generator',
                    'Integers to BST',
                    'Normalization Checker',
                    'NFA to DFA Converter',
                    'K-map Solver'
                ]
            },
            {
                category: 'Image Tools',
                icon: '🖼️',
                title: 'Image Tools',
                description: 'Image converter, resize, compress, crop, and QR code generator. Convert JPG to PNG, PNG to JPG, resize, compress, crop images, and generate QR codes.',
                count: '6 tools',
                url: 'tools/image.html',
                tools: [
                    'JPG to PNG Converter',
                    'PNG to JPG Converter',
                    'Image Resizer',
                    'Image Compressor',
                    'Image Cropper',
                    'QR Code Generator'
                ]
            },
            {
                category: 'Resume Builder',
                icon: '📄',
                title: 'Resume Builder',
                description: 'Resume builder and CV generator. Create a professional resume instantly, all data stays in your browser, and download as PDF.',
                count: '1 tool',
                url: 'tools/resume.html',
                tools: [
                    'Resume Builder'
                ]
            },
            {
                category: 'Text Tools',
                icon: '📝',
                title: 'Text Tools',
                description: 'Case converter, text analyzer, word counter, text formatter, text diff, and grammar checker.',
                count: '6 tools',
                url: 'tools/text.html',
                tools: [
                    'Case Converter',
                    'Text Analyzer',
                    'Word Counter',
                    'Text Formatter',
                    'Text Diff',
                    'Grammar Checker'
                ]
            },
            {
                category: 'Math & Calculators',
                icon: '🧮',
                title: 'Math & Calculators',
                description: 'Scientific calculator, equation solver, matrix calculator, statistics, area/volume calculator, and binary calculator.',
                count: '6 tools',
                url: 'tools/math.html',
                tools: [
                    'Scientific Calculator',
                    'Equation Solver',
                    'Matrix Calculator',
                    'Statistics',
                    'Area/Volume Calculator',
                    'Binary Calculator'
                ]
            },
            {
                category: 'Unit Converters',
                icon: '📏',
                title: 'Unit Converters',
                description: 'Length, weight, temperature, area, volume, speed, power, energy, angle, pressure, force, density, and base converter.',
                count: '13 tools',
                url: 'tools/converters.html',
                tools: [
                    'Length Converter',
                    'Weight Converter',
                    'Temperature Converter',
                    'Area Converter',
                    'Volume Converter',
                    'Speed Converter',
                    'Power Converter',
                    'Energy Converter',
                    'Angle Converter',
                    'Pressure Converter',
                    'Force Converter',
                    'Density Converter',
                    'Base Converter'
                ]
            }
        ];
        
        this.init();
    }

    async init() {
        // Set up theme immediately to prevent flashing
        this.setupTheme();
        
        // Check if splash screen has already been shown in this session
        const splashShown = sessionStorage.getItem('splashShown');
        
        if (!splashShown) {
            await this.showSplashScreen();
            sessionStorage.setItem('splashShown', 'true');
        } else {
            // If splash already shown, immediately show main content
            const splashScreen = document.getElementById('splash-screen');
            const mainContent = document.getElementById('main-content');
            
            if (splashScreen) splashScreen.style.display = 'none';
            if (mainContent) {
                mainContent.classList.remove('hidden');
                mainContent.classList.add('fade-in');
            }
        }
        
        this.loadComponents();
        this.setupEventListeners();
        
        // Add a delay to ensure main content is fully visible before rendering tools
        setTimeout(() => {
            const toolsSection = document.getElementById('tools-section');
            if (toolsSection) toolsSection.classList.remove('hidden');
            this.renderTools();
            this.setupSearch();
        }, 1000);
    }

    async showSplashScreen() {
        return new Promise(resolve => {
            setTimeout(() => {
                const splashScreen = document.getElementById('splash-screen');
                const mainContent = document.getElementById('main-content');
                
                splashScreen.style.opacity = '0';
                mainContent.classList.remove('hidden');
                
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                    mainContent.classList.add('fade-in');
                    resolve();
                }, 500);
            }, 2500);
        });
    }

    async loadComponents() {
        try {
            // Load header
            const headerResponse = await fetch('header.html');
            const headerHtml = await headerResponse.text();
            document.getElementById('header-container').innerHTML = headerHtml;

            // Update theme icon after header is loaded (don't change the theme, just update the icon)
            const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'dark';
            this.updateThemeIcon(currentTheme);
        } catch (error) {
            console.error('Error loading components:', error);
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
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            
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

        // Handle footer links
        document.addEventListener('click', (e) => {
            if (e.target.closest('.legal-link')) {
                const link = e.target.closest('.legal-link');
                const href = link.getAttribute('href');
                
                // Handle privacy policy and terms links
                if (href === 'privacy-policy.html' || href === 'terms-conditions.html') {
                    // These links will work correctly since they're relative to the current page
                    return;
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
    }

    setupTheme() {
        // Check for saved theme preference or default to 'dark'
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

    renderTools() {
        const toolsGrid = document.getElementById('tools-grid');
        if (!toolsGrid) return;

        toolsGrid.innerHTML = this.tools.map(tool => `
            <a href="${tool.url}" class="tool-card slide-in-up">
                <div class="tool-icon">${tool.icon}</div>
                <h3 class="tool-title">${tool.title}</h3>
                <p class="tool-description">${tool.description}</p>
                <div class="tool-count">${tool.count}</div>
            </a>
        `).join('');
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(e.target.value);
            }
        });
    }

    performSearch(query) {
        if (!query.trim()) {
            this.renderTools();
            return;
        }

        const filteredTools = this.tools.filter(tool => {
            const searchTerm = query.toLowerCase();
            return (
                tool.title.toLowerCase().includes(searchTerm) ||
                tool.description.toLowerCase().includes(searchTerm) ||
                tool.tools.some(t => t.toLowerCase().includes(searchTerm))
            );
        });

        this.renderFilteredTools(filteredTools);
    }

    renderFilteredTools(filteredTools) {
        const toolsGrid = document.getElementById('tools-grid');
        if (!toolsGrid) return;

        if (filteredTools.length === 0) {
            toolsGrid.innerHTML = `
                <div class="no-results">
                    <h3>No tools found</h3>
                    <p>Try searching with different keywords or browse all categories.</p>
                </div>
            `;
            return;
        }

        toolsGrid.innerHTML = filteredTools.map(tool => `
            <a href="${tool.url}" class="tool-card slide-in-up">
                <div class="tool-icon">${tool.icon}</div>
                <h3 class="tool-title">${tool.title}</h3>
                <p class="tool-description">${tool.description}</p>
                <div class="tool-count">${tool.count}</div>
            </a>
        `).join('');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EZneeringApp();
});

// Add CSS for mobile menu and no results
const additionalStyles = `
     .nav-menu.active {
         display: flex !important;
         flex-direction: column;
         position: absolute;
         top: 100%;
         left: 0;
         right: 0;
         background: rgba(15, 15, 35, 0.95);
         backdrop-filter: blur(20px);
         -webkit-backdrop-filter: blur(20px);
         border: 1px solid var(--glass-border);
         border-top: none;
         border-radius: 0 0 var(--border-radius) var(--border-radius);
         padding: 1rem;
         gap: 0.5rem;
         box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
         z-index: 1000;
         max-height: 80vh;
         overflow-y: auto;
     }
     
     /* Dark theme specific mobile menu */
     [data-theme="dark"] .nav-menu.active {
         background: rgba(15, 15, 35, 0.95);
         border-color: rgba(255, 255, 255, 0.1);
     }
     
     /* Light theme specific mobile menu */
     [data-theme="light"] .nav-menu.active {
         background: rgba(255, 255, 255, 0.95);
         border-color: rgba(0, 0, 0, 0.1);
         box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
     }

     .no-results {
         grid-column: 1 / -1;
         text-align: center;
         padding: 3rem;
         background: var(--glass-bg);
         border: 1px solid var(--glass-border);
         border-radius: var(--border-radius-lg);
     }

     .no-results h3 {
         color: var(--text-primary);
         margin-bottom: 1rem;
     }

     .no-results p {
         color: var(--text-secondary);
     }

     .header-actions {
         display: flex;
         align-items: center;
         gap: 1rem;
     }

     .footer-section ul {
         list-style: none;
     }

     .footer-section ul li {
         margin-bottom: 0.5rem;
     }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);