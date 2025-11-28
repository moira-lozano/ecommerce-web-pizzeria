<template>
    <div class="bg-white rounded-lg p-4 h-full">
        <div v-if="!hasData" class="flex items-center justify-center h-full text-gray-500">
            <div class="text-center">
                <p class="text-sm">No hay datos para mostrar</p>
            </div>
        </div>
        <canvas v-else ref="chartCanvas"></canvas>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue';
import {
    Chart,
    ArcElement,
    DoughnutController,
    Tooltip,
    Legend
} from 'chart.js';

Chart.register(ArcElement, DoughnutController, Tooltip, Legend);

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    title: String,
    colors: {
        type: Array,
        default: () => [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)',
            'rgb(139, 92, 246)',
            'rgb(236, 72, 153)'
        ]
    }
});

const chartCanvas = ref(null);
let chartInstance = null;

const hasData = computed(() => {
    const labels = props.data?.labels || [];
    const values = props.data?.values || props.data?.total || [];
    // Verificar que haya labels y values, y que al menos un valor sea mayor a 0
    return labels.length > 0 && values.length > 0 && values.length === labels.length && values.some(v => Number(v) > 0);
});

const createChart = () => {
    if (!chartCanvas.value) return;

    // Destruir gráfico anterior si existe
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    const labels = props.data?.labels || [];
    const values = props.data?.values || props.data?.total || [];

    if (labels.length === 0 || values.length === 0) {
        return;
    }

    // Verificar que el canvas no esté siendo usado por otro gráfico
    const canvas = chartCanvas.value;
    if (canvas && Chart.getChart(canvas)) {
        Chart.getChart(canvas).destroy();
    }
    
    chartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: props.data.labels || [],
            datasets: [{
                data: values,
                backgroundColor: props.colors.slice(0, values.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: !!props.title,
                    text: props.title,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: Bs. ${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
};

onMounted(() => {
    nextTick(() => {
        setTimeout(() => {
            createChart();
        }, 100);
    });
});

watch(() => props.data, () => {
    // Pequeño delay para asegurar que el DOM esté listo
    nextTick(() => {
        setTimeout(() => {
            if (hasData.value) {
                if (chartInstance) {
                    const labels = props.data?.labels || [];
                    const values = props.data?.values || props.data?.total || [];
                    if (labels.length > 0 && values.length > 0 && labels.length === values.length) {
                        chartInstance.data.labels = labels;
                        chartInstance.data.datasets[0].data = values;
                        chartInstance.update('none');
                    } else {
                        chartInstance.destroy();
                        chartInstance = null;
                        createChart();
                    }
                } else {
                    createChart();
                }
            } else {
                if (chartInstance) {
                    chartInstance.destroy();
                    chartInstance = null;
                }
            }
        }, 100);
    });
}, { deep: true, immediate: false });

onBeforeUnmount(() => {
    if (chartInstance) {
        chartInstance.destroy();
    }
});
</script>

