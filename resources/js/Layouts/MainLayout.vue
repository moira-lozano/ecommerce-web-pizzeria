<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <!-- Navigation -->
        <nav
            v-motion-slide-top
            class="bg-white shadow-md border-b sticky top-0 z-50 backdrop-blur-sm bg-white/95"
        >
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex">
                        <div class="flex-shrink-0 flex items-center">
                            <Link
                                :href="route('admin.dashboard')"
                                class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
                            >
                                🏢 Sistema Tecnoweb
                            </Link>
                        </div>
                        <div class="hidden sm:ml-6 sm:flex sm:space-x-1">
                            <Link
                                v-for="(link, index) in navLinks"
                                :key="link.href"
                                :href="link.href"
                                v-motion
                                :initial="{ opacity: 0, y: -20 }"
                                :enter="{ opacity: 1, y: 0, transition: { delay: index * 50 } }"
                                :class="[
                                    'inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-all duration-200',
                                    $page.url.startsWith(link.href)
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                ]"
                            >
                                {{ link.label }}
                            </Link>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <Link
                            :href="route('shop.index')"
                            class="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Ver Tienda
                        </Link>
                        <div class="relative" @click.stop="showUserMenu = !showUserMenu">
                            <button class="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-100">
                                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm mr-2">
                                    {{ userInitials }}
                                </div>
                                <span class="mr-2 font-medium">{{ $page.props.auth?.user?.nombre }}</span>
                                <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': showUserMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <Transition
                                enter-active-class="transition ease-out duration-100"
                                enter-from-class="transform opacity-0 scale-95"
                                enter-to-class="transform opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="transform opacity-100 scale-100"
                                leave-to-class="transform opacity-0 scale-95"
                            >
                                <div v-show="showUserMenu" @click.stop class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100">
                                    <!-- <Link
                                        href="/profile"
                                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                                    >
                                        Mi Perfil
                                    </Link> -->
                                    <Link
                                        :href="route('logout')"
                                        method="post"
                                        as="button"
                                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                                    >
                                        Cerrar Sesión
                                    </Link>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Page Content -->
        <main v-motion-fade>
            <slot />
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { route } from 'ziggy-js';

const showUserMenu = ref(false);
const page = usePage();

// Accedemos al dato que compartimos en el backend
const pagosPendientes = computed(() => page.props.auth.user?.notificaciones?.pagos_pendientes ?? 0);

const navLinks = computed(() => {
    const links = [
        { href: route('admin.dashboard'), label: 'Dashboard' },
        { href: route('admin.productos.index'), label: 'Productos' },
        { href: route('admin.categorias.index'), label: 'Categorías' },
        { href: route('admin.clientes.index'), label: 'Clientes' },
        { href: route('admin.ventas.index'), label: 'Ventas' },
        { href: route('admin.compras.index'), label: 'Compras' },
        { href: route('admin.proveedores.index'), label: 'Proveedores' },
        { href: route('admin.inventario.index'), label: 'Inventario' },
        { href: route('admin.creditos.index'), label: 'Créditos' }
    ];

    if (page.props.auth?.user?.rol?.nombre === 'propietario') {
        links.push(
            { href: route('admin.usuarios.index'), label: 'Usuarios' },
            { href: route('admin.roles.index'), label: 'Roles' }
        );
    }

    return links;
});

const userInitials = computed(() => {
    const nombre = page.props.auth?.user?.nombre || '';
    const parts = nombre.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
});

const closeMenu = (event) => {
    if (!event.target.closest('.relative')) {
        showUserMenu.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', closeMenu);
});

onUnmounted(() => {
    document.removeEventListener('click', closeMenu);
});
</script>
