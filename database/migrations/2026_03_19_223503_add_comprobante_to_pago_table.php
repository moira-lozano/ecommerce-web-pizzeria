<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('pago', function (Blueprint $table) {
            $table->string('comprobante_path')->nullable()->after('monto');
           // $table->enum('estado', ['pendiente', 'aprobado', 'rechazado'])->default('pendiente')->after('comprobante_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pago', function (Blueprint $table) {
            //
        });
    }
};
