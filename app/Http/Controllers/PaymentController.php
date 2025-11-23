<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use App\Services\PaymentGatewayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

date_default_timezone_set('America/La_Paz');

class PaymentController extends Controller
{
    /**
     * PASO 5A: Callback desde PagoFacil (MÉTODO RECOMENDADO)
     * Según documentación oficial, PagoFácil envía un POST a esta URL cuando el usuario paga
     * Formato según documentación:
     * {
     *   "PedidoID": "ID_INTERNO_TUYO",
     *   "Fecha": "2025-06-25",
     *   "Hora": "14:32:11",
     *   "MetodoPago": "QR BNB",
     *   "Estado": "APROBADO"
     * }
     */
    public function callback(Request $request)
    {
        try {
            Log::info('Callback recibido de PagoFacil', [
                'data' => $request->all(),
                'headers' => $request->headers->all(),
                'method' => $request->method()
            ]);

            // Según documentación oficial, PagoFácil envía:
            // - PedidoID: nuestro paymentNumber (nro_pago interno)
            // - Estado: "APROBADO" cuando está pagado
            // - Fecha y Hora del pago
            // - MetodoPago: método usado

            $pedidoID = $request->input("PedidoID")
                     ?? $request->input("paymentNumber")
                     ?? $request->input("payment_number")
                     ?? $request->input("nro_pago");

            $estado = $request->input("Estado")
                   ?? $request->input("status")
                   ?? $request->input("estado");

            $fecha = $request->input("Fecha");
            $hora = $request->input("Hora");
            $metodoPago = $request->input("MetodoPago");

            Log::info('Datos extraídos del callback según documentación', [
                'PedidoID' => $pedidoID,
                'Estado' => $estado,
                'Fecha' => $fecha,
                'Hora' => $hora,
                'MetodoPago' => $metodoPago
            ]);

            if (!$pedidoID) {
                Log::warning('Callback sin PedidoID', ['request' => $request->all()]);
                return response()->json([
                    'error' => 1,
                    'status' => 0,
                    'message' => "PedidoID no encontrado en el callback",
                    'values' => false
                ], 400);
            }

            // Según documentación, Estado = "APROBADO" significa que está pagado
            // También aceptamos otros formatos por compatibilidad
            $estadoAprobado = in_array(strtoupper($estado ?? ''), [
                'APROBADO', 'APPROVED', 'COMPLETED', 'PAID', 'SUCCESS',
                '1', 1, true, 'PAGADO'
            ]);

            if ($estadoAprobado) {
                $paymentGatewayService = app(PaymentGatewayService::class);

                // Buscar el pago por nuestro ID interno (PedidoID = paymentNumber = nro_pago)
                $pago = \App\Models\Pago::where('nro_pago', $pedidoID)->first();

                if ($pago) {
                    // Actualizar información adicional si viene en el callback
                    if ($fecha && $hora) {
                        try {
                            $pago->fecha_confirmacion = \Carbon\Carbon::parse($fecha . ' ' . $hora);
                        } catch (\Exception $e) {
                            Log::warning('Error parseando fecha del callback', [
                                'fecha' => $fecha,
                                'hora' => $hora
                            ]);
                        }
                    }

                    if ($metodoPago) {
                        // Guardar método de pago si viene
                        Log::info('Método de pago recibido en callback', ['metodo' => $metodoPago]);
                    }

                    $pago->save();
                }

                // Confirmar el pago (actualiza estado a completado)
                $paymentGatewayService->confirmPayment($pedidoID);

                Log::info('Pago confirmado desde callback', [
                    'PedidoID' => $pedidoID,
                    'Estado' => $estado,
                    'Fecha' => $fecha,
                    'Hora' => $hora
                ]);
            } else {
                Log::info('Callback recibido pero estado no es APROBADO', [
                    'PedidoID' => $pedidoID,
                    'Estado' => $estado
                ]);
            }

            // IMPORTANTE: Según documentación, debemos responder con este formato exacto
            // Si no respondemos 200 OK, PagoFácil volverá a reenviar la notificación
            return response()->json([
                'error' => 0,
                'status' => 1,
                'message' => 'Notificación recibida',
                'values' => true
            ], 200);

        } catch (\Throwable $th) {
            Log::error('Error en callback de pago: ' . $th->getMessage(), [
                'trace' => $th->getTraceAsString(),
                'request' => $request->all()
            ]);

            // Aún así responder OK para evitar reenvíos de PagoFácil
            // pero registrar el error para revisión manual
            return response()->json([
                'error' => 1,
                'status' => 0,
                'message' => "Error al procesar el callback: " . $th->getMessage(),
                'values' => false
            ], 200); // Responder 200 para evitar reenvíos, pero con error = 1
        }
    }

    /**
     * Mostrar página de confirmación de pago
     */
    public function confirm($id)
    {
        $pago = Pago::with([
            'venta.cliente',
            'venta.detalles.producto',
            'cuotaPago.credito'
        ])->findOrFail($id);

        return \Inertia\Inertia::render('Shop/PaymentConfirm', [
            'pago' => $pago
        ]);
    }

    /**
     * Consultar estado de pago
     */
    public function checkStatus($id)
    {
        $pago = Pago::with([
            'venta.cliente',
            'venta.detalles.producto',
            'cuotaPago.credito'
        ])->findOrFail($id);

        $paymentGatewayService = app(PaymentGatewayService::class);
        $result = $paymentGatewayService->consultPaymentStatus($pago);

        $pago->refresh();

        // Extraer paymentInfo si está disponible
        $paymentInfo = null;
        if (is_array($result) && isset($result['paymentInfo'])) {
            $paymentInfo = $result['paymentInfo'];
        }

        // Si es una petición Inertia, redirigir a la página de confirmación
        if (request()->wantsJson() || request()->header('X-Inertia')) {
            return \Inertia\Inertia::render('Shop/PaymentConfirm', [
                'pago' => $pago->fresh([
                    'venta.cliente',
                    'venta.detalles.producto',
                    'cuotaPago.credito'
                ]),
                'paymentInfo' => $paymentInfo
            ]);
        }

        return response()->json([
            'pago' => $pago,
            'result' => $result,
            'paymentInfo' => $paymentInfo
        ]);
    }
}

