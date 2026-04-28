<template>
    <div class="min-h-screen bg-orange-50/30"> <nav
            v-motion-slide-top
            class="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-orange-100"
        >
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-20"> <div class="flex items-center">
                        <Link
                            :href="route('shop.index')"
                            class="text-2xl font-black tracking-tighter text-red-600 hover:scale-105 transition-transform duration-200"
                        >
                            🍕 PIZZA CUCHI LOCO
                        </Link>
                    </div>

                    <div class="flex items-center space-x-4">
                        <Link
                            :href="route('shop.index')"
                            class="text-gray-700 hover:text-red-600 px-3 py-2 rounded-full text-sm font-bold transition-all duration-200 hover:bg-red-50"
                        >
                            Menú
                        </Link>

                        <template v-if="$page.props.auth?.user">
                            <Link
                                :href="route('customer.orders')"
                                class="text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                            >
                                Mis Compras
                            </Link>
                        </template>

                        <Link
                            :href="route('cart.index')"
                            class="relative bg-orange-100 text-orange-700 hover:bg-orange-200 p-3 rounded-full transition-all duration-300 shadow-sm"
                        >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span
                                v-if="cartCount > 0"
                                class="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold ring-2 ring-white"
                            >
                                {{ cartCount }}
                            </span>
                        </Link>

                        <template v-if="!$page.props.auth?.user">
                            <Link :href="route('login')" class="text-gray-700 font-bold text-sm">Entrar</Link>
                            <Link
                                :href="route('register')"
                                class="bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-red-700 transition-all shadow-md"
                            >
                                Registro
                            </Link>
                        </template>
                        
                        <template v-else>
                            <div class="relative" @click.stop="showUserMenu = !showUserMenu">
                                <button class="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors">
                                    <div class="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                                        {{ userInitials }}
                                    </div>
                                </button>
                                <Transition v-show="showUserMenu">
                                    <div class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100">
                                        <Link :href="route('customer.profile')" class="block px-4 py-2 text-sm hover:bg-red-50 text-gray-700">Mi Perfil</Link>
                                        <Link :href="route('logout')" method="post" as="button" class="block w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 font-bold">Cerrar Sesión</Link>
                                    </div>
                                </Transition>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </nav>

        <Transition>
            <div v-if="showNotification" class="fixed top-24 right-4 z-50 p-4 rounded-2xl shadow-2xl bg-zinc-900 text-white border-l-4 border-green-500">
                <div class="flex items-center gap-3">
                    <span>{{ notificationType === 'success' ? '🍕' : '❌' }}</span>
                    <span class="font-bold">{{ notificationMessage }}</span>
                </div>
            </div>
        </Transition>

        <main class="max-w-7xl mx-auto px-4 py-10" v-motion-fade>
            <div class="mb-10 text-center md:text-left">
                <h1 class="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">
                    Catálogo de <span class="text-red-600 italic">Sabores</span>
                </h1>
                <p class="text-zinc-500 mt-2">Pizzas artesanales hechas con locura.</p>
            </div>
            
            <slot />
        </main>

        <footer class="bg-zinc-900 text-white mt-20 border-t-8 border-red-600">
            <div class="max-w-7xl mx-auto px-4 py-16">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                    <div>
                        <h3 class="text-2xl font-black mb-4">🍕 PIZZA CUCHI LOCO</h3>
                        <p class="text-gray-400">El sabor que te vuelve loco, ahora en la puerta de tu casa.</p>
                    </div>
                    <div>
                        <h3 class="text-red-500 font-bold uppercase tracking-widest text-sm mb-6">Enlaces</h3>
                        <ul class="space-y-3 text-gray-300">
                            <li><Link :href="route('shop.index')" class="hover:text-white transition-colors">Nuestro Menú</Link></li>
                            <li><a href="#" class="hover:text-white transition-colors">Sobre Nosotros</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">Contacto</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-red-500 font-bold uppercase tracking-widest text-sm mb-6">Contacto</h3>
                        <p class="text-gray-300">📍 Santa Cruz, Bolivia</p>
                        <p class="text-gray-300">📞 +591 12345678</p>
                        <p class="text-gray-300">✉️ hola@cuchiloco.com</p>
                    </div>
                </div>
                <div class="border-t border-zinc-800 mt-16 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; 2026 Pizza Cuchi Loco. Hecho con ❤️ y mucha harina.</p>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { Link, usePage, router } from '@inertiajs/vue3';
import { route } from 'ziggy-js';

const showUserMenu = ref(false);
const cartCount = ref(0);
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref('success');
const page = usePage();

const userInitials = computed(() => {
    const nombre = page.props.auth?.user?.nombre || '';
    const parts = nombre.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return nombre.substring(0, 2).toUpperCase();
});

const loadCartCount = async () => {
    try {
        const response = await fetch(route('cart.count'));
        const data = await response.json();
        cartCount.value = data.count || 0;
    } catch (error) { console.error(error); }
};

const showNotif = (message, type = 'success') => {
    notificationMessage.value = message;
    notificationType.value = type;
    showNotification.value = true;
    setTimeout(() => { showNotification.value = false; }, 3000);
};

watch(() => page.props.flash, (flash) => {
    if (flash?.success) { showNotif(flash.success, 'success'); loadCartCount(); }
    if (flash?.error) showNotif(flash.error, 'error');
}, { deep: true, immediate: true });

onMounted(() => {
    loadCartCount();
    router.on('finish', () => loadCartCount());
    document.addEventListener('click', () => { showUserMenu.value = false; });
});
</script>