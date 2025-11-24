<template>
    <AdminLayout>
        <div class="container mx-auto px-4 py-8">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold">Detalle del Producto</h1>
                <div class="space-x-2">
                    <Link v-if="puedeEditar" :href="route('admin.productos.edit', producto.id)" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
                        Editar
                    </Link>
                    <Link :href="route('admin.productos.index')" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium">
                        Volver
                    </Link>
                </div>
            </div>

            <div class="bg-white shadow rounded-lg p-6 max-w-2xl">
                <!-- Imagen del Producto -->
                <div v-if="producto.imagen" class="mb-6 flex justify-center">
                    <div class="relative">
                        <img
                        :src="storageUrl(producto.imagen)"

                            :alt="producto.nombre"
                            class="max-w-full h-auto max-h-96 rounded-lg shadow-lg object-contain"
                        />
                    </div>
                </div>
                <div v-else class="mb-6 flex justify-center">
                    <div class="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span class="text-gray-400 text-6xl">📦</span>
                    </div>
                </div>

                <dl class="grid grid-cols-1 gap-4">
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Código</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ producto.codigo }}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Nombre</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ producto.nombre }}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Descripción</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ producto.descripcion || '-' }}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Precio</dt>
                        <dd class="mt-1 text-sm text-gray-900 font-semibold text-green-600">Bs. {{ Number(producto.precio).toFixed(2) }}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Marca</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ producto.marca || '-' }}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Categoría</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ producto.categoria?.nombre || '-' }}</dd>
                    </div>
                </dl>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { usePermissions } from '@/composables/usePermissions';
import { useStorage } from '@/composables/useStorage';
const { storageUrl } = useStorage();


defineProps({
    producto: Object
});

const { tienePermiso } = usePermissions();

// Hacer reactivos los permisos usando computed
const puedeEditar = computed(() => tienePermiso('productos.editar'));
</script>

