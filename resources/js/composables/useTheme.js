import { ref, computed } from 'vue';

const THEME_STORAGE_KEY = 'tecnoweb-theme';
const CONTRAST_STORAGE_KEY = 'tecnoweb-contrast';
const DARK_MODE_STORAGE_KEY = 'tecnoweb-dark-mode';
const FONT_SIZE_STORAGE_KEY = 'tecnoweb-font-size';
const currentTheme = ref('adultos');
const currentContrast = ref('normal');
const darkMode = ref(false);
const fontSize = ref('normal'); // 'normal' o 'large' para adultos

const themes = {
    ninios: {
        name: 'Niños',
        icon: '🧒',
        description: 'Colores vibrantes y alegres',
        body: 'bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 dark:from-yellow-900 dark:via-pink-900 dark:to-purple-900',
        sidebar: 'bg-gradient-to-b from-purple-600 via-pink-500 to-yellow-500 dark:from-purple-800 dark:via-pink-800 dark:to-yellow-800',
        header: 'bg-yellow-50/90 border-pink-300 dark:bg-yellow-900/90 dark:border-pink-700',
        card: 'bg-white border-pink-200 dark:bg-pink-900 dark:border-pink-700',
        text: 'text-purple-900 dark:text-purple-100',
        textSecondary: 'text-pink-700 dark:text-pink-300',
        input: 'bg-white border-pink-300 dark:bg-pink-800 dark:border-pink-600 dark:text-white',
        titleGradient: 'from-purple-700 to-pink-600 dark:from-purple-300 dark:to-pink-400',
        focusRing: 'focus:ring-pink-500 dark:focus:ring-pink-400',
        buttonPrimary: 'bg-pink-500 hover:bg-pink-600 text-white dark:bg-pink-600 dark:hover:bg-pink-700',
        buttonSecondary: 'bg-purple-500 hover:bg-purple-600 text-white dark:bg-purple-600 dark:hover:bg-purple-700',
        border: 'border-pink-200 dark:border-pink-700',
        footer: 'bg-yellow-50 dark:bg-yellow-900'
    },
    jovenes: {
        name: 'Jóvenes',
        icon: '👨‍🎓',
        description: 'Estilo moderno y dinámico',
        body: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900',
        sidebar: 'bg-gradient-to-b from-indigo-700 via-blue-600 to-purple-600 dark:from-indigo-900 dark:via-blue-900 dark:to-purple-900',
        header: 'bg-blue-50/90 border-indigo-300 dark:bg-blue-900/90 dark:border-indigo-700',
        card: 'bg-white border-indigo-200 dark:bg-indigo-900 dark:border-indigo-700',
        text: 'text-indigo-900 dark:text-indigo-100',
        textSecondary: 'text-blue-700 dark:text-blue-300',
        input: 'bg-white border-indigo-300 dark:bg-indigo-800 dark:border-indigo-600 dark:text-white',
        titleGradient: 'from-indigo-700 to-purple-600 dark:from-indigo-300 dark:to-purple-400',
        focusRing: 'focus:ring-indigo-500 dark:focus:ring-indigo-400',
        buttonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600',
        buttonSecondary: 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600',
        border: 'border-indigo-200 dark:border-indigo-700',
        footer: 'bg-blue-50 dark:bg-blue-900'
    },
    adultos: {
        name: 'Adultos',
        icon: '👔',
        description: 'Diseño profesional y elegante',
        body: 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800',
        sidebar: 'bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900',
        header: 'bg-white/90 border-gray-300 dark:bg-gray-800/90 dark:border-gray-700',
        card: 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700',
        text: 'text-gray-900 dark:text-gray-100',
        textSecondary: 'text-gray-700 dark:text-gray-300',
        input: 'bg-white border-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white',
        titleGradient: 'from-slate-800 to-gray-700 dark:from-blue-400 dark:to-indigo-400',
        focusRing: 'focus:ring-blue-500 dark:focus:ring-blue-400',
        buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600',
        buttonSecondary: 'bg-gray-600 hover:bg-gray-700 text-white dark:bg-gray-500 dark:hover:bg-gray-600',
        border: 'border-gray-200 dark:border-gray-700',
        footer: 'bg-gray-50 dark:bg-gray-900'
    }
};

const contrastLevels = {
    normal: {
        name: 'Normal',
        icon: '👁️',
        textContrast: '',
        borderContrast: '',
        bgContrast: ''
    },
    alto: {
        name: 'Alto Contraste',
        icon: '🔍',
        textContrast: 'font-bold',
        borderContrast: 'border-2',
        bgContrast: ''
    },
    muyAlto: {
        name: 'Muy Alto Contraste',
        icon: '🔎',
        textContrast: 'font-extrabold',
        borderContrast: 'border-4',
        bgContrast: 'bg-opacity-100'
    }
};

export function useTheme() {
    const loadTheme = () => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            const savedContrast = localStorage.getItem(CONTRAST_STORAGE_KEY);
            const savedDarkMode = localStorage.getItem(DARK_MODE_STORAGE_KEY);
            const savedFontSize = localStorage.getItem(FONT_SIZE_STORAGE_KEY);

            if (savedTheme && themes[savedTheme]) {
                currentTheme.value = savedTheme;
            } else {
                currentTheme.value = 'adultos';
            }

            if (savedContrast && contrastLevels[savedContrast]) {
                currentContrast.value = savedContrast;
            } else {
                currentContrast.value = 'normal';
            }

            if (savedDarkMode !== null) {
                darkMode.value = savedDarkMode === 'true';
            } else {
                darkMode.value = false;
            }

            if (savedFontSize && (savedFontSize === 'normal' || savedFontSize === 'large')) {
                fontSize.value = savedFontSize;
            } else {
                fontSize.value = currentTheme.value === 'adultos' ? 'large' : 'normal';
            }

            applyTheme(currentTheme.value);
            applyContrast(currentContrast.value);
            applyDarkMode(darkMode.value);
            applyFontSize(fontSize.value);
        }
    };

    const setTheme = (themeName) => {
        if (themes[themeName]) {
            currentTheme.value = themeName;
            if (typeof window !== 'undefined') {
                localStorage.setItem(THEME_STORAGE_KEY, themeName);
            }
            applyTheme(themeName);
        }
    };

    const setContrast = (contrastLevel) => {
        if (contrastLevels[contrastLevel]) {
            currentContrast.value = contrastLevel;
            if (typeof window !== 'undefined') {
                localStorage.setItem(CONTRAST_STORAGE_KEY, contrastLevel);
            }
            applyContrast(contrastLevel);
        }
    };

    const setDarkMode = (isDark) => {
        darkMode.value = isDark;
        if (typeof window !== 'undefined') {
            localStorage.setItem(DARK_MODE_STORAGE_KEY, isDark.toString());
        }
        applyDarkMode(isDark);
    };

    const setFontSize = (size) => {
        if (size === 'normal' || size === 'large') {
            fontSize.value = size;
            if (typeof window !== 'undefined') {
                localStorage.setItem(FONT_SIZE_STORAGE_KEY, size);
            }
            applyFontSize(size);
        }
    };

    const applyTheme = (themeName) => {
        if (typeof document === 'undefined') return;

        const theme = themes[themeName];
        if (!theme) return;

        const root = document.documentElement;
        root.setAttribute('data-theme', themeName);
        
        // Aplicar clase al body también para mejor compatibilidad
        if (document.body) {
            document.body.setAttribute('data-theme', themeName);
        }
    };

    const applyContrast = (contrastLevel) => {
        if (typeof document === 'undefined') return;

        const contrast = contrastLevels[contrastLevel];
        if (!contrast) return;

        const root = document.documentElement;
        root.setAttribute('data-contrast', contrastLevel);
    };

    const applyDarkMode = (isDark) => {
        if (typeof document === 'undefined') return;

        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            // También aplicar al body para asegurar compatibilidad
            if (document.body) {
                document.body.classList.add('dark');
            }
        } else {
            root.classList.remove('dark');
            if (document.body) {
                document.body.classList.remove('dark');
            }
        }
    };

    const applyFontSize = (size) => {
        if (typeof document === 'undefined') return;

        const root = document.documentElement;
        root.setAttribute('data-font-size', size);
    };

    // Cargar tema al inicializar
    if (typeof window !== 'undefined') {
        loadTheme();
    }

    return {
        currentTheme: computed(() => currentTheme.value),
        currentContrast: computed(() => currentContrast.value),
        darkMode: computed(() => darkMode.value),
        fontSize: computed(() => fontSize.value),
        themes,
        contrastLevels,
        setTheme,
        setContrast,
        setDarkMode,
        setFontSize,
        loadTheme,
        getThemeClasses: () => {
            const theme = themes[currentTheme.value] || themes.adultos;
            const contrast = contrastLevels[currentContrast.value] || contrastLevels.normal;

            return {
                ...theme,
                contrast: {
                    text: contrast.textContrast,
                    border: contrast.borderContrast,
                    bg: contrast.bgContrast
                }
            };
        }
    };
}
