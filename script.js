// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
        
// Check for saved theme
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
});

// Copy Extension Links
document.querySelectorAll('code').forEach(code => {
    code.addEventListener('click', async () => {
        await navigator.clipboard.writeText(code.textContent);
        
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg';
        toast.textContent = 'Link copied to clipboard!';
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    });
});