<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;  // ← Esta línea es CRÍTICA

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
{
    if ($this->app->environment('local')) {
        URL::forceRootUrl('http://localhost:8000');
    }

    if ($this->app->environment('production')) {
        URL::forceScheme('https');
        URL::forceRootUrl('https://www.tecnoweb.org.bo/inf513/grupo12sa/proyecto2/public');
    }
}


////////ASI ESTA ORIGINALMENTE, PERO NO FUNCIONA EN LOCAL, SOLO EN PRODUCCION////
 /*public function boot(): void
    {
        // Forzar esquema HTTPS
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // Forzar URL raíz
        URL::forceRootUrl('https://www.tecnoweb.org.bo/inf513/grupo12sa/proyecto2/public');
                // Agregar esto para forzar URL de storage
        \Illuminate\Support\Facades\URL::macro('storage', function ($path) {
            return config('app.url') . '/storage/' . ltrim($path, '/');
        });
    }
*/        

}
