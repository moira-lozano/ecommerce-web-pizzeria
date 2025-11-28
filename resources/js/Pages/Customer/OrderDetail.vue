<template>
    <ShopLayout>
        <div class="container mx-auto px-4 py-8">
            <div class="mb-6">
                <Link :href="route('customer.orders')" class="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver a Mis Compras
                </Link>
            </div>

            <div class="bg-white shadow rounded-lg p-6 mb-6">
                <h1 class="text-3xl font-bold mb-6">Detalle de Venta #{{ venta.nro_venta }}</h1>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 class="text-sm font-medium text-gray-500 mb-2">Información de la Venta</h3>
                        <dl class="space-y-2">
                            <div>
                                <dt class="text-sm text-gray-600">Fecha:</dt>
                                <dd class="font-medium">{{ formatDate(venta.fecha) }}</dd>
                            </div>
                            <div>
                                <dt class="text-sm text-gray-600">Tipo:</dt>
                                <dd class="font-medium">{{ venta.tipo === 'contado' ? 'Contado' : 'Crédito' }}</dd>
                            </div>
                            <div>
                                <dt class="text-sm text-gray-600">Estado:</dt>
                                <dd>
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
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div>
                        <h3 class="text-sm font-medium text-gray-500 mb-2">Resumen Financiero</h3>
                        <dl class="space-y-2">
                            <div class="flex justify-between">
                                <dt class="text-sm text-gray-600">Monto Total:</dt>
                                <dd class="font-bold text-lg text-green-600">Bs. {{ Number(venta.monto_total).toFixed(2) }}</dd>
                            </div>
                            <div v-if="venta.tipo === 'credito'" class="flex justify-between">
                                <dt class="text-sm text-gray-600">Saldo Pendiente:</dt>
                                <dd class="font-medium text-red-600">Bs. {{ Number(venta.saldo || 0).toFixed(2) }}</dd>
                            </div>
                            <div v-if="venta.tipo === 'credito'" class="flex justify-between">
                                <dt class="text-sm text-gray-600">Número de Cuotas:</dt>
                                <dd class="font-medium">{{ venta.numero_cuotas }}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div v-if="venta.credito" class="mb-6 p-4 bg-blue-50 rounded-lg">
                    <Link
                        :href="route('customer.credit.detail', venta.credito.id)"
                        class="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Ver detalles del crédito →
                    </Link>
                </div>
            </div>

            <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Productos Comprados</h2>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="detalle in venta.detalles" :key="detalle.id">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div class="font-medium text-gray-900">{{ detalle.producto?.nombre }}</div>
                                        <div class="text-sm text-gray-500">{{ detalle.producto?.codigo }}</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ detalle.cantidad }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Bs. {{ Number(detalle.precio_unitario).toFixed(2) }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Bs. {{ Number(detalle.subtotal).toFixed(2) }}</td>
                            </tr>
                        </tbody>
                        <tfoot class="bg-gray-50">
                            <tr>
                                <td colspan="3" class="px-6 py-4 text-right font-bold">Total:</td>
                                <td class="px-6 py-4 font-bold text-lg text-green-600">Bs. {{ Number(venta.monto_total).toFixed(2) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </ShopLayout>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import ShopLayout from '@/Layouts/ShopLayout.vue';

defineProps({
    venta: Object
});

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        // Manejar formato ISO con timezone (ej: "2025-11-23T00:00:00.000000Z")
        // Extraer solo la parte de la fecha antes de 'T' o espacio
        let datePart = dateString;
        if (dateString.includes('T')) {
            datePart = dateString.split('T')[0];
        } else if (dateString.includes(' ')) {
            datePart = dateString.split(' ')[0];
        }
        
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
