<template>
    <MainLayout>
        <div class="py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div class="p-6 bg-white border-b border-gray-200">
                        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
                            Dashboard
                        </h2>
                        <p class="text-gray-600">
                            Panel de administración del sistema
                        </p>
                    </div>
                </div>

                <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Módulos del sistema -->
                    <DashboardCard
                        title="Productos"
                        :count="0"
                        icon="📦"
                        :href="route('productos.index')"
                    />
                    <DashboardCard
                        title="Clientes"
                        :count="0"
                        icon="👥"
                        :href="route('clientes.index')"
                    />
                    <DashboardCard
                        title="Ventas"
                        :count="0"
                        icon="💰"
                        :href="route('ventas.index')"
                    />
                    <DashboardCard
                        title="Compras"
                        :count="0"
                        icon="🛒"
                        :href="route('compras.index')"
                    />
                    <DashboardCard
                        title="Proveedores"
                        :count="0"
                        icon="🏢"
                        :href="route('proveedores.index')"
                    />
                    <DashboardCard
                        title="Inventario"
                        :count="0"
                        icon="📊"
                        :href="route('inventario.index')"
                    />
                </div>
            </div>
        </div>
    </MainLayout>
</template>

<script setup>
import { route } from 'ziggy-js';
import MainLayout from '@/Layouts/MainLayout.vue';
import DashboardCard from '@/Components/DashboardCard.vue';
</script>
