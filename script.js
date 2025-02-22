// Mobile menu functionality
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
const themeToggle = document.getElementById('theme-toggle');

// Mobile menu toggle
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
        mobileMenu.classList.add('hidden');
    }
});

// Theme Toggle functionality for both mobile and desktop
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

// Check for saved theme
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}

// Add click handlers to both theme toggle buttons
[themeToggle, mobileThemeToggle].forEach(button => {
    button.addEventListener('click', toggleTheme);
});

// Copy Extension Links
document.querySelectorAll('code').forEach(code => {
    code.addEventListener('click', async () => {
        try {
            const text = code.textContent.trim();
            await navigator.clipboard.writeText(text);
            
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg z-50';
            toast.textContent = 'Link copied to clipboard!';
            
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
});

// Language Management
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('preferred-lang') || 'en';
        this.langButtons = document.querySelectorAll('.lang-btn');
        this.init();
    }

    init() {
        this.setActiveLanguage(this.currentLang);
        this.updateContent(this.currentLang);
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedLang = e.currentTarget.dataset.lang;
                this.setActiveLanguage(selectedLang);
                this.updateContent(selectedLang);
                localStorage.setItem('preferred-lang', selectedLang);
                this.currentLang = selectedLang;
            });
        });
    }

    setActiveLanguage(lang) {
        this.langButtons.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('bg-indigo-600', 'text-white');
                btn.classList.remove('bg-gray-100', 'dark:bg-gray-800');
            } else {
                btn.classList.remove('bg-indigo-600', 'text-white');
                btn.classList.add('bg-gray-100', 'dark:bg-gray-800');
            }
        });
    }

    translate(key, lang = this.currentLang) {
        try {
            const keys = key.split('.');
            return keys.reduce((obj, k) => obj?.[k], translations[lang]) || key;
        } catch (err) {
            console.warn(`Translation missing for key: ${key}`);
            return key;
        }
    }

    updateContent(lang) {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const keys = element.dataset.translate.split('.');
            let value = translations[lang];
            keys.forEach(key => {
                value = value[key];
            });
            element.textContent = value;
        });

        // Update specific sections
        this.updateHeader(lang);
        this.updateFeatures(lang);
        this.updateStreamingSection(lang);
        this.updateExtensions(lang);
        this.updateGettingStarted(lang);
    }

    updateHeader(lang) {
        const header = document.querySelector('header');
        header.querySelector('h1').textContent = this.translate('header.title', lang);
        header.querySelector('p').textContent = this.translate('header.subtitle', lang);
        header.querySelectorAll('a')[0].textContent = this.translate('header.downloadButton', lang);
        header.querySelectorAll('a')[1].textContent = this.translate('header.watchButton', lang);
    }

    updateFeatures(lang) {
        const features = document.querySelectorAll('section:first-of-type > div');
        features.forEach((feature, index) => {
            const title = feature.querySelector('h3');
            const desc = feature.querySelector('p');
            if (index === 0) {
                title.textContent = this.translate('features.tracking', lang);
                desc.textContent = this.translate('features.trackingDesc', lang);
            } else if (index === 1) {
                title.textContent = this.translate('features.streaming', lang);
                desc.textContent = this.translate('features.streamingDesc', lang);
            } else if (index === 2) {
                title.textContent = this.translate('features.manga', lang);
                desc.textContent = this.translate('features.mangaDesc', lang);
            }
        });
    }

    updateStreamingSection(lang) {
        const streamSection = document.querySelector('section.bg-gradient-to-r');
        streamSection.querySelector('h2').textContent = this.translate('streamSection.title', lang);
        streamSection.querySelector('p').textContent = this.translate('streamSection.description', lang);
        streamSection.querySelector('a').textContent = this.translate('streamSection.button', lang);
    }

    updateExtensions(lang) {
        const extensionsSection = document.querySelector('section:nth-of-type(3)');
        extensionsSection.querySelector('h2').textContent = this.translate('extensions.title', lang);
        
        const extensions = extensionsSection.querySelectorAll('.bg-gradient-to-r');
        extensions[0].querySelector('h3').firstChild.textContent = this.translate('extensions.anime.title', lang);
        extensions[0].querySelector('span').textContent = this.translate('extensions.anime.recommended', lang);
        
        extensions.forEach((ext, index) => {
            const desc = ext.querySelector('.text-sm');
            if (index === 0) {
                desc.textContent = this.translate('extensions.anime.description', lang);
            } else if (index === 1) {
                desc.textContent = this.translate('extensions.manga.description', lang);
            } else if (index === 2) {
                desc.textContent = this.translate('extensions.novel.description', lang);
            }
        });
    }

    updateGettingStarted(lang) {
        const startedSection = document.querySelector('section:last-of-type');
        startedSection.querySelector('h2').textContent = this.translate('gettingStarted.title', lang);
        
        const steps = startedSection.querySelectorAll('.flex.items-center.gap-6');
        steps.forEach((step, index) => {
            const title = step.querySelector('h3');
            const desc = step.querySelector('p');
            const stepNum = index + 1;
            title.textContent = this.translate(`gettingStarted.step${stepNum}.title`, lang);
            desc.textContent = this.translate(`gettingStarted.step${stepNum}.description`, lang);
        });
    }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.langManager = new LanguageManager();
});
