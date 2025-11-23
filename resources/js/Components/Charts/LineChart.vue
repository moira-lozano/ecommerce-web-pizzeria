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
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend,
    Filler
);

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    title: String,
    color: {
        type: String,
        default: 'rgb(59, 130, 246)'
    }
});

const chartCanvas = ref(null);
let chartInstance = null;

const hasData = computed(() => {
    const labels = props.data?.labels || [];
    const values = props.data?.values || props.data?.total || [];
    // Verificar que haya labels y values, y que tengan la misma longitud
    return labels.length > 0 && values.length > 0 && labels.length === values.length;
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

    // Si no hay datos, mostrar mensaje
    if (labels.length === 0 || values.length === 0) {
        return;
    }

    // Verificar que el canvas no esté siendo usado por otro gráfico
    const canvas = chartCanvas.value;
    if (canvas && Chart.getChart(canvas)) {
        Chart.getChart(canvas).destroy();
    }

    chartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: props.title || 'Datos',
                data: values,
                borderColor: props.color,
                backgroundColor: props.color + '20',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: !!props.title,
                    position: 'top',
                },
                title: {
                    display: !!props.title,
                    text: props.title
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Bs. ' + value.toLocaleString();
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
            } else if (hasData.value) {
                createChart();
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

