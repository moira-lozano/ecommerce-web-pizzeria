<template>
    <div>
        <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>

        <!-- Preview de la imagen -->
        <div v-if="preview || currentImage" class="mb-4">
            <div class="relative inline-block">
                <img
                    :src="preview || (currentImage ? `/storage/${currentImage}` : null)"
                    :alt="label || 'Imagen'"
                    class="w-48 h-48 object-contain border-2 border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                    v-if="preview || currentImage"
                    @click="removeImage"
                    type="button"
                    class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
                    title="Eliminar imagen"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Input de archivo -->
        <div class="flex items-center gap-4">
            <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg class="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="mb-2 text-sm text-gray-500">
                        <span class="font-semibold">Click para subir</span> o arrastra y suelta
                    </p>
                    <p class="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                </div>
                <input
                    ref="fileInput"
                    type="file"
                    @change="handleFileChange"
                    accept="image/*"
                    class="hidden"
                />
            </label>
        </div>

        <!-- Información de compresión -->
        <div v-if="compressing" class="mt-2 text-sm text-blue-600">
            <div class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Comprimiendo imagen...
            </div>
        </div>

        <div v-if="compressionInfo" class="mt-2 text-xs text-gray-500">
            {{ compressionInfo }}
        </div>

        <!-- Error -->
        <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
        <p v-if="hint" class="mt-1 text-xs text-gray-500">{{ hint }}</p>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: File | null,
    label: String,
    required: Boolean,
    hint: String,
    currentImage: String,
    maxSize: {
        type: Number,
        default: 5 * 1024 * 1024 // 5MB por defecto
    },
    maxWidth: {
        type: Number,
        default: 1200 // Ancho máximo en píxeles
    },
    maxHeight: {
        type: Number,
        default: 1200 // Alto máximo en píxeles
    },
    quality: {
        type: Number,
        default: 0.8 // Calidad de compresión (0.0 a 1.0)
    }
});

const emit = defineEmits(['update:modelValue']);

const fileInput = ref(null);
const preview = ref(null);
const error = ref(null);
const compressing = ref(false);
const compressionInfo = ref(null);

// Función para comprimir imagen usando Canvas API
const compressImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                compressing.value = true;

                // Calcular nuevas dimensiones manteniendo la proporción
                let width = img.width;
                let height = img.height;

                if (width > props.maxWidth || height > props.maxHeight) {
                    const ratio = Math.min(props.maxWidth / width, props.maxHeight / height);
                    width = width * ratio;
                    height = height * ratio;
                }

                // Crear canvas para redimensionar y comprimir
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convertir a blob con compresión
                canvas.toBlob(
                    (blob) => {
                        compressing.value = false;

                        if (!blob) {
                            reject(new Error('Error al comprimir la imagen'));
                            return;
                        }

                        // Crear nuevo File desde el blob
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });

                        // Calcular información de compresión
                        const originalSize = (file.size / 1024 / 1024).toFixed(2);
                        const compressedSize = (blob.size / 1024 / 1024).toFixed(2);
                        const reduction = ((1 - blob.size / file.size) * 100).toFixed(1);

                        compressionInfo.value = `Original: ${originalSize}MB → Comprimido: ${compressedSize}MB (${reduction}% reducción)`;

                        resolve(compressedFile);
                    },
                    'image/jpeg',
                    props.quality
                );
            };

            img.onerror = () => {
                compressing.value = false;
                reject(new Error('Error al cargar la imagen'));
            };

            img.src = e.target.result;
        };

        reader.onerror = () => {
            compressing.value = false;
            reject(new Error('Error al leer el archivo'));
        };

        reader.readAsDataURL(file);
    });
};

const handleFileChange = async (event) => {
    error.value = null;
    compressionInfo.value = null;

    const file = event.target.files[0];

    if (!file) {
        emit('update:modelValue', null);
        preview.value = null;
        return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
        error.value = 'Solo se permiten archivos de imagen.';
        event.target.value = '';
        return;
    }

    // Validar tamaño original (antes de comprimir)
    if (file.size > props.maxSize * 2) {
        error.value = `El archivo es demasiado grande. El tamaño máximo es ${(props.maxSize / 1024 / 1024).toFixed(0)}MB.`;
        event.target.value = '';
        return;
    }

    try {
        // Comprimir la imagen
        const compressedFile = await compressImage(file);

        // Crear preview
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.value = e.target.result;
        };
        reader.readAsDataURL(compressedFile);

        // Emitir el archivo comprimido
        emit('update:modelValue', compressedFile);

    } catch (err) {
        error.value = err.message || 'Error al procesar la imagen';
        event.target.value = '';
        preview.value = null;
    }
};

const removeImage = () => {
    preview.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
    // Emitir null para indicar que se eliminó la imagen
    // Si había una imagen actual, esto permitirá al formulario detectar la eliminación
    emit('update:modelValue', null);
};

// Limpiar preview si se elimina el valor desde fuera
watch(() => props.modelValue, (newValue) => {
    if (!newValue) {
        preview.value = null;
        if (fileInput.value) {
            fileInput.value.value = '';
        }
    }
});
</script>

