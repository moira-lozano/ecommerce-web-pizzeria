<template>
    <ShopLayout>
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-6">Mis Compras</h1>

            <div v-if="ventas.data && ventas.data.length > 0" class="space-y-4">
                <div v-for="venta in ventas.data" :key="venta.id" class="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <div class="flex items-center gap-4 mb-2">
                                <h3 class="text-lg font-semibold text-gray-800">Venta #{{ venta.nro_venta }}</h3>
                                <span
                                    class="px-3 py-1 rounded-full text-xs font-medium"
                                    :class="{
                                        'bg-green-100 text-green-800': venta.estado === 'completado',
                                        'bg-yellow-100 text-yellow-800': venta.estado === 'pendiente',
                                        'bg-red-100 text-red-800': venta.estado === 'cancelado'
                                    }"
                                >
                                    {{ venta.estado }}
                                </span>
                            </div>
                            <p class="text-sm text-gray-500 mb-2">
                                Fecha: {{ formatDate(venta.fecha) }}
                            </p>
                            <p class="text-sm text-gray-600 mb-2">
                                Tipo: <span class="font-medium">{{ venta.tipo === 'contado' ? 'Contado' : 'Crédito' }}</span>
                            </p>
                            <div class="mt-3">
                                <p class="text-lg font-bold text-green-600">
                                    Total: Bs. {{ Number(venta.monto_total).toFixed(2) }}
                                </p>
                                <p v-if="venta.tipo === 'credito'" class="text-sm text-gray-600">
                                    Saldo pendiente: Bs. {{ Number(venta.saldo || 0).toFixed(2) }}
                                </p>
                            </div>
                        </div>
                        <Link
                            :href="`/my-order/${venta.id}`"
                            class="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Ver Detalle
                        </Link>
                    </div>
                </div>

                <!-- Paginación -->
                <div v-if="ventas.links && ventas.links.length > 3" class="mt-6 flex justify-center">
                    <nav class="flex gap-2">
                        <Link
                            v-for="(link, index) in ventas.links"
                            :key="index"
                            :href="link.url || '#'"
                            v-html="link.label"
                            :class="[
                                'px-3 py-2 border rounded-lg',
                                link.active ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            ]"
                        />
                    </nav>
                </div>
            </div>

            <div v-else class="text-center py-16">
                <div class="text-6xl mb-4">📦</div>
                <h2 class="text-2xl font-semibold text-gray-800 mb-2">No tienes compras registradas</h2>
                <p class="text-gray-600 mb-6">Realiza tu primera compra en nuestra tienda</p>
                <Link
                    href="/shop"
                    class="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                    Ir al Catálogo
                </Link>
            </div>
        </div>
    </ShopLayout>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';
import ShopLayout from '@/Layouts/ShopLayout.vue';

defineProps({
    ventas: Object
});

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        // Parsear la fecha manualmente para evitar problemas de zona horaria
        // Formato esperado: "2025-11-23" o "2025-11-23 12:00:00"
        const datePart = dateString.split(' ')[0]; // Obtener solo la parte de la fecha
        const [year, month, day] = datePart.split('-').map(Number);
        
        // Crear Date usando componentes locales (no UTC) para evitar el desfase de un día
        const dateObj = new Date(year, month - 1, day);
        
        // Verificar que la fecha sea válida
        if (isNaN(dateObj.getTime())) {
            return dateString;
        }
        
        return dateObj.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
};
</script>
