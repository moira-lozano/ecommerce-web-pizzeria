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
        // Forzar esquema HTTPS
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // Forzar URL raíz
        URL::forceRootUrl('https://www.tecnoweb.org.bo/inf513/grupo12sa/proyecto2/public');
    }
}
