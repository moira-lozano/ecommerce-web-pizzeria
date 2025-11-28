<template>
    <AdminLayout>
        <div class="container mx-auto px-4 py-8">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold">Movimientos de Inventario</h1>
                <Link :href="route('admin.inventario.index')" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium">Volver</Link>
            </div>
            <div class="bg-white shadow rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50"><tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Actual</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Glosa</th>
                    </tr></thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="mov in movimientos.data" :key="mov.id">
                            <td class="px-6 py-4 whitespace-nowrap text-sm">{{ formatearFecha(mov.fecha) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">{{ mov.producto?.nombre || '-' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <span
                                    class="px-2 py-1 rounded-full text-xs font-medium"
                                    :class="mov.tipo_movimiento === 'INGRESO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                                >
                                    {{ mov.tipo_movimiento }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">{{ mov.cantidad }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">{{ mov.stock_actual }}</td>
                            <td class="px-6 py-4 text-sm">{{ mov.glosa }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="movimientos.links" class="mt-4 flex justify-center">
                <nav class="flex gap-2">
                    <Link
                        v-for="(link, index) in movimientos.links"
                        :key="index"
                        :href="link.url || '#'"
                        v-html="link.label"
                        :class="[
                            'px-3 py-2 border rounded',
                            link.active ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        ]"
                    />
                </nav>
            </div>
        </div>
    </AdminLayout>
</template>
<script setup>
import { Link } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import AdminLayout from '@/Layouts/AdminLayout.vue';

defineProps({ movimientos: Object });

// Función helper para formatear fecha sin problemas de zona horaria
// Cuando Laravel devuelve 'YYYY-MM-DD', JavaScript lo interpreta como UTC
// Esta función parsea la fecha manualmente para evitar conversiones de zona horaria
const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    
    // Si ya es un string en formato YYYY-MM-DD, parsearlo manualmente
    if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}/.test(fecha)) {
        const [año, mes, dia] = fecha.split('T')[0].split('-');
        // Crear fecha en zona horaria local para evitar problemas de UTC
        const fechaLocal = new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
        return fechaLocal.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }
    
    // Si es un objeto Date u otro formato, usar el método estándar
    const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};
</script>

