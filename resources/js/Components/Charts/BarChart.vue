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
    BarElement,
    BarController,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    Title,
    Tooltip,
    Legend
);

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    title: String,
    colors: {
        type: Array,
        default: () => ['rgb(59, 130, 246)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)', 'rgb(239, 68, 68)']
    }
});

const chartCanvas = ref(null);
let chartInstance = null;

const hasData = computed(() => {
    if (props.data?.datasets) {
        const hasValidDataset = props.data.datasets.some(ds => ds.data && Array.isArray(ds.data) && ds.data.length > 0);
        const labels = props.data?.labels || [];
        return hasValidDataset && labels.length > 0;
    }
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
    const datasets = [];

    if (props.data?.datasets) {
        props.data.datasets.forEach((dataset, index) => {
            datasets.push({
                label: dataset.label,
                data: dataset.data || [],
                backgroundColor: props.colors[index % props.colors.length] + '80',
                borderColor: props.colors[index % props.colors.length],
                borderWidth: 1
            });
        });
    } else {
        const values = props.data?.values || props.data?.total || [];
        if (labels.length === 0 || values.length === 0) {
            return;
        }
        datasets.push({
            label: props.title || 'Datos',
            data: values,
            backgroundColor: props.colors[0] + '80',
            borderColor: props.colors[0],
            borderWidth: 1
        });
    }

    // Verificar que el canvas no esté siendo usado por otro gráfico
    const canvas = chartCanvas.value;
    if (canvas && Chart.getChart(canvas)) {
        Chart.getChart(canvas).destroy();
    }

    chartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: props.data.labels || [],
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: datasets.length > 1 || !!props.title,
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
            if (hasData.value) {
                if (chartInstance) {
                    const labels = props.data?.labels || [];
                    chartInstance.data.labels = labels;
                    if (props.data?.datasets) {
                        props.data.datasets.forEach((dataset, index) => {
                            if (chartInstance.data.datasets[index]) {
                                chartInstance.data.datasets[index].data = dataset.data || [];
                                chartInstance.data.datasets[index].label = dataset.label;
                            }
                        });
                    } else {
                        const values = props.data?.values || props.data?.total || [];
                        if (chartInstance.data.datasets[0]) {
                            chartInstance.data.datasets[0].data = values;
                        }
                    }
                    chartInstance.update('none');
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

