/*
 * =================================================================
 * PASO 3: INTEGRACIÓN EN EL SERVIDOR MCP
 * =================================================================
 *
 * Este es un ejemplo simplificado de cómo usarías tu TranslatorTool
 * en el archivo principal de tu servidor (ej. server.ts).
 */

// server.ts
import { TranslatorTool } from './translator.tool'; // Asegúrate de que la ruta sea correcta

/**
 * Simula el manejo de un comando de un jugador en el servidor.
 * Por ejemplo, cuando un jugador escribe: /translate Luna de verano
 */
async function handlePlayerCommand(command: string, args: string[]) {
  if (command.toLowerCase() === '/translate') {
    if (args.length === 0) {
      const messageToPlayer = 'Uso: /translate <texto para traducir>';
      console.log(`(Al jugador) -> ${messageToPlayer}`);
      return;
    }

    const textToTranslate = args.join(' ');
    console.log(`(Del jugador) -> Comando recibido: /translate ${textToTranslate}`);

    // ¡Aquí es donde usamos nuestra herramienta!
    const translatedText = await TranslatorTool.translate(textToTranslate);

    // El resultado se enviaría de vuelta al chat del jugador.
    const finalMessage = `Traducción: ${translatedText}`;
    console.log(`(Al jugador) -> ${finalMessage}`);
  }
}

/**
 * Función principal para simular la ejecución del servidor.
 */
async function main() {
  console.log('Servidor MCP escuchando comandos...');
  console.log('------------------------------------');

  // Simulamos la ejecución del comando del ejemplo
  await handlePlayerCommand('/translate', ['Luna', 'de', 'verano']);

  console.log('------------------------------------');
  
  // Simulamos otro ejemplo
  await handlePlayerCommand('/translate', ['Corazón', 'de', 'león']);
}

// Ejecutamos la simulación
main();

/*
 * =================================================================
 * SALIDA ESPERADA EN LA CONSOLA:
 * =================================================================
 *
 * Servidor MCP escuchando comandos...
 * ------------------------------------
 * (Del jugador) -> Comando recibido: /translate Luna de verano
 * [TranslatorTool] Iniciando traducción para: "Luna de verano"
 * [TranslatorTool] Traducción recibida: "Summer's Moon"
 * (Al jugador) -> Traducción: Summer's Moon
 * ------------------------------------
 * (Del jugador) -> Comando recibido: /translate Corazón de león
 * [TranslatorTool] Iniciando traducción para: "Corazón de león"
 * [TranslatorTool] Traducción recibida: "Lionheart"
 * (Al jugador) -> Traducción: Lionheart
 *
 */