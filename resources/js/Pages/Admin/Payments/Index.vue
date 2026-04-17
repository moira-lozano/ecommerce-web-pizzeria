<template>
    <AdminLayout>
        <div class="p-6 bg-gray-50 min-h-screen">
            <h1 class="text-3xl font-extrabold mb-8 text-gray-800">Pagos Pendientes de Verificación</h1>
            
            <div v-if="pagos.length > 0" class="grid gap-6">
                <div v-for="pago in pagos" :key="pago.id" class="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">{{ pago.tipo_pago }}</span>
                            <p class="font-bold text-lg text-gray-900">{{ pago.venta?.cliente?.nombre || 'Cliente no identificado' }}</p>
                        </div>
                        <p class="text-gray-600">Monto: <span class="font-bold text-green-600">Bs. {{ pago.monto }}</span></p>
                        <p class="text-xs text-gray-400">Ref: {{ pago.nro_pago }} | Venta: {{ pago.venta?.nro_venta }}</p>
                        
                        <div class="pt-2">
                            <a :href="`/storage/${pago.comprobante_path}`" target="_blank" 
                               class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                Ver Comprobante adjunto
                            </a>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 w-full md:w-auto">
                        <button @click="confirmarAprobacion(pago.id)" 
                                class="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-sm">
                            Aprobar
                        </button>
                        <button @click="prepararRechazo(pago.id)" 
                                class="flex-1 md:flex-none bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2 rounded-lg font-bold transition-all">
                            Rechazar
                        </button>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-20 bg-white rounded-2xl shadow-inner border-2 border-dashed">
                <p class="text-gray-400 text-xl italic">No hay pagos pendientes con comprobante por revisar.</p>
            </div>

            <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                    <h2 class="text-xl font-bold mb-4 text-gray-800">Rechazar Pago</h2>
                    <p class="text-sm text-gray-600 mb-4">Indica al cliente por qué el comprobante no es válido:</p>
                    
                    <textarea v-model="form.observaciones" 
                              class="w-full border-gray-300 rounded-xl mb-4 focus:ring-red-500 focus:border-red-500" 
                              rows="3" 
                              placeholder="Ej: La imagen no es legible o el monto no coincide..."></textarea>
                    
                    <div class="flex justify-end gap-3">
                        <button @click="showModal = false" class="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium">Cancelar</button>
                        <button @click="ejecutarRechazo" 
                                :disabled="!form.observaciones"
                                class="bg-red-600 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50">
                            Confirmar Rechazo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useForm, router } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps(['pagos']);
const showModal = ref(false);
const selectedPagoId = ref(null);

const form = useForm({
    status: '',
    observaciones: ''
});

const confirmarAprobacion = (id) => {
    if (confirm('¿Estás seguro de que deseas aprobar este pago? Esto marcará la venta como pagada.')) {
        router.patch(route('admin.payments.update', id), {
            status: 'completado',
            observaciones: 'Pago verificado por administración.'
        });
    }
};

const prepararRechazo = (id) => {
    selectedPagoId.value = id;
    form.observaciones = '';
    showModal.value = true;
};

const ejecutarRechazo = () => {
    router.patch(route('admin.payments.update', selectedPagoId.value), {
        status: 'rechazado',
        observaciones: form.observaciones
    }, {
        onSuccess: () => {
            showModal.value = false;
        }
    });
};
</script>