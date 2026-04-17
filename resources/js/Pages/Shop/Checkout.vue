<template>
    <ShopLayout>
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-6">Finalizar Compra</h1>

            <div v-if="cart && cart.items && cart.items.length > 0" class="max-w-4xl mx-auto">
                <div class="bg-white shadow rounded-lg p-6 mb-6 border-l-4 border-green-500">
                    <h2 class="text-xl font-semibold mb-4">Resumen del Pedido</h2>
                    <div class="space-y-3">
                        <div v-for="item in cart.items" :key="item.id" class="flex justify-between py-2 border-b border-gray-100">
                            <div>
                                <span class="font-medium text-gray-800">{{ item.nombre }}</span>
                                <span class="text-gray-500 text-sm ml-2">x {{ item.cantidad }}</span>
                            </div>
                            <span class="font-semibold text-gray-700">Bs. {{ (item.precio * item.cantidad).toFixed(2) }}</span>
                        </div>
                        <div class="mt-4 pt-4 border-t-2 flex justify-between text-2xl font-black">
                            <span>Total a Pagar:</span>
                            <span class="text-green-600">Bs. {{ Number(cart.total || 0).toFixed(2) }}</span>
                        </div>
                    </div>
                </div>

                <div v-if="cliente" class="bg-white shadow rounded-lg p-6 mb-6">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span>📍</span> Datos de Entrega
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                        <div class="space-y-1">
                            <p class="text-xs text-gray-500 uppercase font-bold">Consignatario</p>
                            <p class="font-medium">{{ cliente.nombre }} (CI: {{ cliente.ci }})</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-xs text-gray-500 uppercase font-bold">Teléfono de contacto</p>
                            <p class="font-medium text-blue-600">{{ cliente.telefono || 'No especificado' }}</p>
                        </div>
                        <div class="md:col-span-2 space-y-1">
                            <p class="text-xs text-gray-500 uppercase font-bold">Dirección de Envío</p>
                            <p class="font-medium">{{ cliente.direccion || 'Debe actualizar su dirección en el perfil' }}</p>
                        </div>
                    </div>
                </div>

                <form @submit.prevent="submit" class="bg-white shadow-lg rounded-xl p-8 border border-blue-100">
                    <h2 class="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Selecciona la forma de pago</h2>

                    <RadioInput
                        v-model="form.tipo_pago"
                        label="¿Cómo deseas pagar?"
                        name="tipo_pago"
                        :options="tipoPagoOptions"
                        option-value="value"
                        option-label="label"
                        option-description="description"
                        required
                        class="mb-6"
                    />

                    <div v-if="form.tipo_pago === 'credito'" class="mt-4 ml-8 animate-in slide-in-from-left duration-300">
                        <div v-if="opcionesCredito.length > 0" class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <SelectInput
                                v-model="form.numero_cuotas"
                                label="Plan de Cuotas"
                                name="numero_cuotas"
                                placeholder="Selecciona el número de cuotas"
                                required
                                :options="opcionesCredito.map(cuota => ({
                                    value: cuota,
                                    label: `${cuota} cuota${cuota > 1 ? 's' : ''} - Bs. ${(cart.total / cuota).toFixed(2)} c/u`
                                }))"
                                option-value="value"
                                option-label="label"
                            />
                            <p class="text-xs text-blue-600 mt-2 font-medium">
                                ℹ️ El monto se dividirá en partes iguales mensualmente.
                            </p>
                        </div>

                        <div v-else class="p-4 rounded-lg border bg-yellow-50 border-yellow-200">
                            <p class="text-sm font-semibold text-yellow-800">⚠️ Requiere Verificación</p>
                            <p class="text-sm text-yellow-700 mt-1">
                                Tu cuenta aún no está habilitada para créditos. Por favor, sube tus documentos.
                            </p>
                            <Link :href="route('customer.verificar-credito')" class="inline-block mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-bold">
                                Gestionar Documentos
                            </Link>
                        </div>
                    </div>

                    <div v-if="form.tipo_pago === 'contado' || (form.tipo_pago === 'credito' && opcionesCredito.length > 0)" 
                         class="mt-8 pt-6 border-t animate-in fade-in">
                        <SelectInput
                            v-model="form.metodo_pago"
                            label="Medio de Pago"
                            name="metodo_pago"
                            placeholder="Selecciona cómo realizarás el pago"
                            required
                            :error="form.errors.metodo_pago"
                            :options="metodoPagoOptions"
                            option-value="value"
                            option-label="label"
                        />
                    </div>

                    <div class="flex flex-col sm:flex-row gap-4 mt-8">
                        <Link :href="route('cart.index')" class="flex-1">
                            <Button type="button" variant="outline" full-width size="lg">
                                Volver al Carrito
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            :loading="form.processing"
                            :disabled="isSubmitDisabled"
                            variant="primary"
                            full-width
                            size="lg"
                        >
                            {{ form.metodo_pago === 'qr' ? 'Generar Código QR' : 'Confirmar Compra' }}
                        </Button>
                    </div>
                </form>
            </div>

            <div v-else class="text-center py-20 bg-gray-50 rounded-3xl mt-10">
                <div class="text-9xl mb-6">🛒</div>
                <h2 class="text-2xl font-bold text-gray-400 mb-6">Tu carrito está esperando por ti</h2>
                <Link :href="route('shop.index')" class="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg">
                    Explorar Catálogo
                </Link>
            </div>
        </div>
    </ShopLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useForm, Link } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import ShopLayout from '@/Layouts/ShopLayout.vue';
import SelectInput from '@/Components/Form/SelectInput.vue';
import RadioInput from '@/Components/Form/RadioInput.vue';
import Button from '@/Components/Button.vue';

const props = defineProps({
    cart: Object,
    cliente: Object,
    puedeCredito: Boolean,
    opcionesCredito: Array
});


const metodoPagoOptions = [
    { value: 'efectivo', label: '💵 Efectivo (Contra entrega)' },
    { value: 'qr', label: '📱 QR PagoFácil (Inmediato)' },

];

const tipoPagoOptions = computed(() => {
    const options = [
        {
            value: 'contado',
            label: 'Pago al Contado',
            description: 'Paga la totalidad del monto ahora'
        }
    ];

    if (props.puedeCredito) {
        options.push({
            value: 'credito',
            label: 'Pago a Crédito',
            description: `Usa tu línea de crédito (Límite: Bs. ${props.cliente?.limite_credito || 0})`
        });
    }

    return options;
});

const form = useForm({
    tipo_pago: 'contado',
    metodo_pago: '',
    numero_cuotas: null
});

// Validación para deshabilitar el botón
const isSubmitDisabled = computed(() => {
    if (form.processing) return true;
    if (!form.metodo_pago) return true;
    if (form.tipo_pago === 'credito' && !form.numero_cuotas) return true;
    return false;
});

watch(() => form.tipo_pago, (newTipo) => {
    if (newTipo === 'contado') form.numero_cuotas = null;
});

const submit = () => {
    // Transformamos los datos para asegurar limpieza antes de enviar al backend
    form.transform((data) => ({
        ...data,
        // Si no es crédito, nos aseguramos de que numero_cuotas sea nulo
        numero_cuotas: data.tipo_pago === 'credito' ? data.numero_cuotas : null
    })).post(route('checkout.process'));
};
</script>