<template>
    <div class="min-h-screen bg-orange-50/30 flex items-center justify-center p-4">
        <div v-motion-fade
            class="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-orange-100">
            
            <div class="text-center mb-8">
                <h2 class="text-4xl font-black bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent mb-2">
                    Iniciar Sesión
                </h2>
                <p class="text-zinc-500 font-medium">¡Bienvenido a la locura de la pizza!</p>
            </div>

            <Transition enter-active-class="transition ease-out duration-300"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100">
                <div v-if="$page.props.flash?.error"
                    class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-bold text-sm">{{ $page.props.flash.error }}</span>
                </div>
            </Transition>

            <form @submit.prevent="submit" class="space-y-5">
                <TextInput v-model="form.email" label="Email" type="email" name="email" placeholder="tu@email.com"
                    required :error="form.errors.email" :validation-rules="[validateEmail]" />

                <TextInput v-model="form.password" label="Contraseña" type="password" name="password"
                    placeholder="••••••" required :error="form.errors.password" :min-length="6"
                    hint="Mínimo 6 caracteres" />

                <div class="flex items-center">
                    <input 
                        id="remember"
                        v-model="form.remember" 
                        type="checkbox" 
                        name="remember"
                        class="h-5 w-5 text-red-600 focus:ring-red-500 border-zinc-300 rounded-lg cursor-pointer transition-colors" 
                    />
                    <label for="remember" class="ml-2 block text-sm font-bold text-zinc-600 cursor-pointer hover:text-red-600 transition-colors">
                        Recordarme
                    </label>
                </div>

                <Button type="submit" :loading="form.processing" :disabled="form.processing" 
                    class="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-200 transition-all active:scale-95">
                    ENTRAR
                </Button>

                <div class="mt-6 text-center">
                    <Link :href="route('register')"
                        class="text-red-600 hover:text-red-700 font-bold transition-colors duration-200">
                    ¿No tienes cuenta? <span class="underline underline-offset-4">Regístrate aquí</span>
                    </Link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { useForm, Link } from '@inertiajs/vue3';
import TextInput from '@/Components/Form/TextInput.vue';
import Button from '@/Components/Button.vue';
import { route } from 'ziggy-js';

const form = useForm({ 
    email: '', 
    password: '', 
    remember: false // Asegúrate de que el valor inicial sea booleano
});

const validateEmail = (value) => {
    if (!value) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Email inválido';
};

const submit = () => { 
    form.post(route('login'), {
        onFinish: () => form.reset('password'),
    }); 
};

defineOptions({ layout: null });
</script>