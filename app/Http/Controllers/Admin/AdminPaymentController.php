<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pago;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPaymentController extends Controller
{
    public function index()
    {
        // Traemos pagos pendientes con comprobante y cargamos relaciones
        $pagos = Pago::where('estado', 'pendiente')
            ->whereNotNull('comprobante_path')
            ->with(['venta.cliente']) 
            ->latest()
            ->get();

        return Inertia::render('Admin/Payments/Index', [
            'pagos' => $pagos
        ]);
    }

    public function updateStatus(Request $request, Pago $pago)
    {
        $request->validate([
            'status' => 'required|in:completado,rechazado',
            'observaciones' => 'nullable|string'
        ]);

        $pago->update([
            'estado' => $request->status,
            'observaciones' => $request->observaciones,
            'fecha_confirmacion' => $request->status === 'completado' ? now() : null
        ]);

        return back()->with('success', 'El estado del pago ha sido actualizado.');
    }
}