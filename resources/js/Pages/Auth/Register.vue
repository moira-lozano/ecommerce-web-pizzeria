<template>
    <div class="min-h-screen bg-orange-50/30 flex items-center justify-center p-4 py-12">
        <div v-motion-fade
            class="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-[2.5rem] shadow-2xl p-10 border border-orange-100">
            
            <div class="text-center mb-10">
                <h2 class="text-4xl font-black bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent mb-2">
                    Crear Cuenta
                </h2>
                <p class="text-zinc-500 font-medium italic italic">¡Únete a la pizzería más loca!</p>
            </div>

            <form @submit.prevent="submit" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <TextInput v-model="form.nombre" label="Nombre Completo" type="text" name="nombre" placeholder="Juan Pérez"
                    required :error="form.errors.nombre" :min-length="3" />

                <TextInput v-model="form.ci" label="CI" type="text" name="ci" placeholder="12345678"
                    required :error="form.errors.ci" :validation-rules="[validateCI]" />

                <div class="md:col-span-2">
                    <TextInput v-model="form.email" label="Email" type="email" name="email" placeholder="tu@email.com"
                        required :error="form.errors.email" :validation-rules="[validateEmail]" />
                </div>

                <TextInput v-model="form.telefono" label="Teléfono" type="tel" name="telefono" placeholder="+591 70000000" />

                <TextInput v-model="form.direccion" label="Dirección" type="text" name="direccion" placeholder="Calle, Barrio..." />

                <TextInput v-model="form.password" label="Contraseña" type="password" name="password" placeholder="••••••"
                    required :error="form.errors.password" :min-length="6" hint="Mínimo 6 caracteres"/>

                <TextInput v-model="form.password_confirmation" label="Confirmar" type="password" name="password_confirmation"
                    placeholder="••••••" required :error="passwordMatchError" hint="Mínimo 6 caracteres"/>

                <div class="md:col-span-2 mt-4">
                    <Button type="submit" :loading="form.processing" :disabled="form.processing"
                        class="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-200 uppercase tracking-widest transition-all active:scale-95">
                        Registrarse ahora
                    </Button>
                </div>

                <div class="md:col-span-2 mt-6 text-center">
                    <Link :href="route('login')" class="text-red-600 hover:text-red-700 font-bold transition-colors">
                        ¿Ya tienes cuenta? <span class="underline underline-offset-4">Inicia sesión</span>
                    </Link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useForm, Link } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import TextInput from '@/Components/Form/TextInput.vue';
import Button from '@/Components/Button.vue';

const form = useForm({
    nombre: '', ci: '', email: '', telefono: '', direccion: '', password: '', password_confirmation: '',
});

// Validaciones (Se mantienen iguales)
const validateEmail = (value) => { if (!value) return true; return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Email inválido'; };
const validateCI = (value) => { if (!value) return true; return /^\d{5,10}$/.test(value) || 'CI debe tener entre 5 y 10 dígitos'; };
const passwordMatchError = computed(() => (form.password_confirmation && form.password_confirmation !== form.password) ? 'No coinciden' : '');
const submit = () => { form.post(route('register')); };

defineOptions({ layout: null });
</script>