<?php
// ===================================================
// LÍNEAS DE DIAGNÓSTICO: DEJAR PARA PROBAR, LUEGO ELIMINAR
// Estas líneas fuerzan a PHP a mostrar el error en pantalla
error_reporting(E_ALL); 
ini_set('display_errors', 1); 
// ===================================================

// === 1. CONFIGURACIÓN INICIAL ===
date_default_timezone_set('America/Panama'); 

// === 2. VERIFICACIÓN DEL MÉTODO DE ENVÍO ===
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // === 3. RECOLECCIÓN Y SANITIZACIÓN DE DATOS ===
    // htmlspecialchars() protege el servidor de entradas maliciosas
    $nombre = htmlspecialchars($_POST['nombre'] ?? '');
    $email = htmlspecialchars($_POST['email'] ?? '');
    $telefono = htmlspecialchars($_POST['telefono'] ?? 'N/A'); 
    $interes = htmlspecialchars($_POST['interes'] ?? '');
    $mensaje = htmlspecialchars($_POST['mensaje'] ?? '');
    $fecha = date("Y-m-d H:i:s");
    
    // === 4. DEFINICIÓN Y RUTA DEL ARCHIVO (CORRECCIÓN CLAVE) ===
    // Definimos solo el nombre del archivo. Como el script PHP se está ejecutando en 'data/', 
    // el archivo CSV se creará automáticamente allí.
    $archivo_datos = 'mensajes_contacto.csv'; 
    $ruta_completa = $archivo_datos; 

    // === 5. PREPARACIÓN DE LA LÍNEA CSV ===
    $linea_datos = [
        $fecha,
        $nombre,
        $email,
        $telefono,
        $interes,
        // Reemplazamos saltos de línea para que el CSV no se rompa
        str_replace(["\r", "\n"], " ", $mensaje) 
    ];
    
    // === 6. ESCRITURA EN EL ARCHIVO ===
    
    // Intentamos abrir el archivo en modo 'a' (append/añadir)
    $file = fopen($ruta_completa, 'a');

    // Manejo de Éxito o Fracaso al abrir/crear el archivo
    if ($file) {
        // Escribe la cabecera (títulos de columna) solo si el archivo está vacío (solo la primera vez)
        if (filesize($ruta_completa) == 0) {
            $cabecera = ['Fecha', 'Nombre', 'Email', 'Telefono', 'Interes', 'Mensaje'];
            fputcsv($file, $cabecera);
        }

        // Escribe la línea de datos del formulario
        fputcsv($file, $linea_datos);
        fclose($file);

        // === 7. REDIRECCIÓN DE ÉXITO ===
        header("Location: ../html/gracias.html");
        exit();

    } else {
        // ESTO SE MOSTRARÁ SI HAY UN PROBLEMA DE PERMISOS
        echo "<h1>ERROR: No se pudo crear o escribir en el archivo de datos.</h1>";
        echo "<p>Verifica que la carpeta 'data/' tenga permisos de escritura en tu instalación de XAMPP.</p>";
        exit(); 
    }

} else {
    // Si se accede directamente al PHP sin enviar el formulario, redirige al contacto
    header("Location: ../html/contacto.html");
    exit();
}
?>