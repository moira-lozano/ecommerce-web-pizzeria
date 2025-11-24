import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
    // Configuración diferente para desarrollo vs producción
    const isProduction = mode === 'production';

    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.js'],
                refresh: true,
                detectTls: false,
            }),
            vue({
                template: {
                    transformAssetUrls: {
                        base: null,
                        includeAbsolute: false,
                    },
                },
            }),
            tailwindcss(),
        ],
        resolve: {
            alias: {
                '@': '/resources/js',
            },
        },
        // Base path para producción (subdirectorio)
        base: isProduction ? '/inf513/grupo12sa/' : '/',

        // Server solo para desarrollo
        server: isProduction ? undefined : {
            host: '0.0.0.0',
            port: 5173,
            strictPort: false,
            cors: {
                origin: true,
                credentials: true,
            },
            hmr: {
                host: 'localhost',
                port: 5173,
            },
        },

        // Build para producción
        build: {
            manifest: true,
            outDir: 'public/build',
            rollupOptions: {
                input: {
                    app: 'resources/js/app.js',
                    css: 'resources/css/app.css',
                },
            },
        },
    };
});
