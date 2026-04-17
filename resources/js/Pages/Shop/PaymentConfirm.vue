<template>
    <ShopLayout>
        <div class="container mx-auto px-4 py-8 max-w-4xl">
            <div class="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
                <h1 class="text-3xl font-bold mb-6 text-gray-800">Confirmación de Pago</h1>

                <div class="mb-6 p-5 rounded-xl transition-all duration-300"
                     :class="{
                         'bg-yellow-50 border border-yellow-200': ['pendiente', 'procesando'].includes(pago.estado),
                         'bg-green-50 border border-green-200': pago.estado === 'completado',
                         'bg-red-50 border border-red-200': ['rechazado', 'cancelado'].includes(pago.estado)
                     }">
                    <div class="flex items-center gap-4">
                        <span class="text-4xl">
                            <span v-if="['pendiente', 'procesando'].includes(pago.estado)">⏳</span>
                            <span v-else-if="pago.estado === 'completado'">✅</span>
                            <span v-else>❌</span>
                        </span>
                        <div>
                            <h3 class="font-bold text-lg capitalize text-gray-800">
                                {{ pago.estado === 'pendiente' ? 'Esperando Pago o Verificación' : 'Pago ' + pago.estado }}
                            </h3>
                            <p class="text-sm text-gray-600">Referencia: #{{ pago.nro_pago }}</p>
                        </div>
                    </div>
                </div>

                <div class="mb-8">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        {{ pago.cuota_pago ? 'Detalles de Cuota' : 'Detalles de Compra' }}
                    </h2>
                    <div class="bg-gray-50 rounded-xl p-5 space-y-3 border border-gray-100">
                        <div v-if="pago.cuota_pago" class="flex justify-between border-b border-gray-200 pb-2">
                            <span class="text-gray-500">Crédito / Cuota:</span>
                            <span class="font-semibold">ID #{{ pago.cuota_pago.credito?.id }} - Cuota {{ pago.cuota_pago.numero_cuota }}</span>
                        </div>
                        <div v-if="pago.venta && !pago.cuota_pago" class="flex justify-between border-b border-gray-200 pb-2">
                            <span class="text-gray-500">Número de Venta:</span>
                            <span class="font-semibold">{{ pago.venta?.nro_venta }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-500">Monto Total:</span>
                            <span class="text-2xl font-black text-green-700">Bs. {{ Number(pago.monto).toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500">Método:</span>
                            <span class="font-medium bg-white px-2 py-1 rounded shadow-sm border text-sm">
                                {{ pago.metodo_pago === 'qr' ? '📱 QR PagoFácil' : (pago.metodo_pago === 'tigo_money' ? '📲 Tigo Money' : pago.metodo_pago) }}
                            </span>
                        </div>
                    </div>
                </div>

               <!-- 🔵 MOSTRAR QR SI ES PAGO QR Y AÚN NO HAY COMPROBANTE -->
                <div v-if= true>
                    <div class="text-center bg-blue-50 p-6 rounded-2xl border-2 border-blue-100">
                        <h2 class="text-xl font-bold mb-4 text-blue-900">
                            Escanea para pagar
                        </h2>
                        
                        <div class="relative inline-block">
                            <img 
                                src="/images/qr_pago.jpeg"
                                alt="QR de Pago"
                                class="w-72 h-72 mx-auto object-contain bg-white p-3 shadow-lg rounded-xl border"
                            />
                        </div>
                        
                        <p class="mt-4 text-sm text-blue-700 italic">
                            Abre la app de tu banco, escanea el código y realiza la transferencia por el monto exacto.
                        </p>
                    </div>
                </div>


<div v-if="!pago.comprobante_path || pago.estado === 'rechazado'">
    
    <div v-if="pago.estado === 'rechazado'" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
        <h4 class="text-red-800 font-bold">Pago Rechazado</h4>
        <p class="text-red-700 text-sm">
            Motivo: <span class="italic font-medium">"{{ pago.observaciones || 'Comprobante no válido o ilegible.' }}"</span>
        </p>
        <p class="text-red-700 text-xs mt-1 font-semibold underline">Por favor, intenta subir el comprobante correcto nuevamente.</p>
    </div>

    <h3 class="text-center font-bold text-gray-800 mb-4">
       <!--  {{ pago.estado === 'rechazado' ? 'Vuelve a subir tu comprobante:' : '¿Ya realizaste el pago? Sube tu comprobante:' }} -->
    </h3>

    <form @submit.prevent="submitComprobante" class="space-y-4">
        <div class="flex items-center justify-center w-full">
            <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg class="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>

                    <p class="text-sm text-gray-500 font-medium">
                        Click para seleccionar imagen del comprobante
                    </p>

                    <p v-if="uploadForm.comprobante" class="text-blue-600 font-bold mt-1 text-sm">
                        📍 {{ uploadForm.comprobante.name }}
                    </p>
                </div>

                <input 
                    type="file" 
                    class="hidden" 
                    @change="handleFileSelect" 
                    accept="image/*" 
                />
            </label>
        </div>

        <button 
            type="submit" 
            :disabled="uploadForm.processing || !uploadForm.comprobante"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-md transition-all disabled:opacity-50 flex justify-center items-center"
        >
            <span v-if="uploadForm.processing">
                <svg class="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"></svg>
                Enviando...
            </span>
            <span v-else>Enviar Comprobante para Verificación</span>
        </button>
    </form>
</div>

<div 
    v-else-if="pago.comprobante_path && pago.estado === 'pendiente'"
    class="mt-6 p-8 bg-orange-50 border border-orange-200 rounded-2xl text-center shadow-inner"
>
    <span class="text-5xl mb-3 block animate-bounce">📁</span>

    <h3 class="font-bold text-orange-800 text-lg">
        Comprobante en revisión
    </h3>

    <p class="text-orange-700 mt-2">
        Hemos recibido tu comprobante con éxito. <br>
        <span class="font-semibold text-orange-900">
            Un administrador está realizando la verificación.
        </span>
    </p>

    <p class="text-xs text-orange-600 mt-4 italic">
        Te notificaremos una vez que el pago sea validado.
    </p>
</div>

                <!-- <div v-if="pago.metodo_pago === 'tigo_money' && pago.estado === 'pendiente'" class="mb-6">
                    <div class="bg-blue-600 text-white rounded-xl p-5 shadow-lg">
                        <h2 class="text-xl font-bold mb-2">📲 Esperando Tigo Money</h2>
                        <p class="text-sm opacity-90">Revisa tu teléfono. Debes confirmar la transacción con tu PIN en la app o menú Tigo Money.</p>
                        <p v-if="pago.nro_transaccion" class="mt-3 text-xs bg-blue-800 p-2 rounded">ID de Transacción: {{ pago.nro_transaccion }}</p>
                    </div>
                </div> -->

                <div class="flex flex-wrap gap-4 mt-10">
                    <div class="flex-1 min-w-[200px] flex flex-col gap-2">
                        <button v-if="['pendiente', 'procesando'].includes(pago.estado)"
                                @click="checkStatus" :disabled="checking"
                                class="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50">
                            {{ checking ? 'Verificando...' : 'Verificar Estado del Pago' }}
                        </button>
                    </div>

                    <button v-if="infoPagoActiva" @click="showPaymentInfoModal = true"
                            class="flex-1 min-w-[200px] bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition-colors">
                        Ver Logs del Estado
                    </button>

                    <Link v-if="pago.estado === 'completado'" 
                          :href="pago.cuota_pago?.credito ? route('customer.credit.detail', pago.cuota_pago.credito.id) : route('customer.orders')"
                          class="flex-1 min-w-[200px] bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold text-center shadow-lg">
                        {{ pago.cuota_pago ? 'Volver al Crédito' : 'Ver Mis Compras' }}
                    </Link>

                    <Link :href="route('shop.index')"
                          class="flex-1 min-w-[200px] bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium text-center">
                        Continuar Comprando
                    </Link>
                </div>

                <div v-if="['pendiente', 'procesando'].includes(pago.estado) && autoCheck" class="mt-6">
                    <div class="flex items-center justify-center gap-2 text-gray-400 text-xs">
                        <div class="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                        Actualizando automáticamente cada 30 segundos...
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showPaymentInfoModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showPaymentInfoModal = false">
            <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-bold text-gray-800">Detalles técnicos del Pago</h2>
                        <button @click="showPaymentInfoModal = false" class="text-gray-400 hover:text-gray-600">✖</button>
                    </div>

                    <div v-if="infoPagoActiva" class="space-y-3">
                        <div class="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-lg border">
                            <span class="text-gray-500 text-sm">Estado API:</span>
                            <span class="font-bold text-right" :class="infoPagoActiva.paymentStatus === 1 ? 'text-green-600' : 'text-yellow-600'">
                                {{ infoPagoActiva.paymentStatusDescription || getStatusText(infoPagoActiva.paymentStatus) }}
                            </span>
                            <span class="text-gray-500 text-sm">ID Pasarela:</span>
                            <span class="text-right text-xs font-mono">{{ infoPagoActiva.pagofacilTransactionId }}</span>
                        </div>
                    </div>

                    <button @click="showPaymentInfoModal = false" class="mt-6 w-full py-2 bg-gray-800 text-white rounded-lg">Cerrar</button>
                </div>
            </div>
        </div>
    </ShopLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Link, router, useForm } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import ShopLayout from '@/Layouts/ShopLayout.vue';

const props = defineProps({
    pago: Object,
    paymentInfo: Object
});

const checking = ref(false);
const autoCheck = ref(true);
const showPaymentInfoModal = ref(false);
const infoPagoActiva = ref(props.paymentInfo || null);
let intervalId = null;

const checkStatus = async () => {
    checking.value = true;
    try {
        await router.get(route('payment.check-status', props.pago.id), {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.paymentInfo) infoPagoActiva.value = page.props.paymentInfo;
                if (page.props.pago?.estado === 'completado') {
                    autoCheck.value = false;
                    if (intervalId) clearInterval(intervalId);
                }
            }
        });
    } catch (error) {
        console.error('Error verificando estado:', error);
    } finally {
        checking.value = false;
    }
};

const uploadForm = useForm({
    pago_id: props.pago.id,
    comprobante: null, // Este es el campo que valida el :disabled del botón
});

const handleFileSelect = (event) => {
    // Asignamos el archivo capturado al formulario
    uploadForm.comprobante = event.target.files[0];
    
    // Opcional: Log para verificar en consola que el archivo se cargó
    console.log("Archivo seleccionado:", uploadForm.comprobante.name);
};

const submitComprobante = () => {
    uploadForm.post(route('payment.upload'), {
        forceFormData: true,
        preserveScroll: true,
    });
};

const getStatusText = (s) => ({ 1: 'PAGADO', 2: 'PENDIENTE', 3: 'EXPIRADO', 4: 'CANCELADO' }[s] || 'DESCONOCIDO');

onMounted(() => {
    if (['pendiente', 'procesando'].includes(props.pago.estado)) {
        intervalId = setInterval(checkStatus, 30000);
    }
});

onUnmounted(() => { if (intervalId) clearInterval(intervalId); });
</script>