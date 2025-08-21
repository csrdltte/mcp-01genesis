/*
 * =================================================================
 * PASO 1: INSTALACIÓN Y CONFIGURACIÓN
 * =================================================================
 *
 * 1. Instala las dependencias necesarias en tu terminal:
 * npm install openai dotenv
 *
 * 2. Crea un archivo llamado '.env' en la raíz de tu proyecto
 * y añade tu clave de API del LLM.
 *
 * // .env
 * LLM_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
 * // Opcional: Si usas un servicio compatible como Groq, Perplexity, etc.
 * // LLM_API_BASE="https://api.groq.com/openai/v1"
 *
 * =================================================================
 */


/*
 * =================================================================
 * PASO 2: CREACIÓN DE LA HERRAMIENTA ESPECIALIZADA
 * =================================================================
 *
 * Este archivo (translator.tool.ts) contiene la lógica para
 * interactuar con el LLM de forma controlada.
 */

// translator.tool.ts
//import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { json } from 'stream/consumers';

// Carga las variables de entorno del archivo .env
dotenv.config({path:"/Users/cesar/source/repos/csrdltte/mcp-01genesis/.env"});

// Inicializa el cliente del LLM.

// OpenAI
/*
// Es compatible con la API de OpenAI y otros servicios que la imitan.
const llmClient = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_API_BASE, // Descomenta o modifica si no usas OpenAI directamente
});
*/

// Google GenAI
// Usa tu API key, idealmente desde variables de entorno para mayor seguridad
const GEMINI_API_KEY = process.env.LLM_API_KEY || 'TU_API_KEY';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);



export class TranslatorTool {
  /**
   * Traduce un texto de español a inglés usando un LLM con un prompt complejo y directivo.
   * @param text El texto en español a traducir.
   * @returns Una promesa que se resuelve con la traducción en inglés.
   */
  public static async translate(text: string): Promise<string> {
    console.log(`[TranslatorTool] Iniciando traducción para: "${text}"`);

    // --- INICIO DEL PROMPT COMPLEJO ---
    // Para la API de Gemini, combinamos las instrucciones y el input del usuario en un solo prompt.
    const fullPrompt = `
      Eres un traductor profesional de español a inglés, especializado en frases con significado poético o literario.
      Tu única función es recibir un texto en español y devolver su traducción más evocadora en inglés.

      REGLAS ESTRICTAS E INQUEBRANTABLES:
      1.  Tu respuesta debe contener ÚNICAMENTE el texto traducido.
      2.  NO incluyas explicaciones, aclaraciones, saludos o cualquier texto adicional.
      3.  NO uses comillas ni ningún otro formato en tu respuesta.
      4.  Si el texto de entrada es "Luna de verano", tu única respuesta posible es "Summer's Moon".

      Traduce el siguiente texto: "${text}"
    `;
    // --- FIN DEL PROMPT COMPLEJO ---

    try {

        // openai
        /*
        const response = await llmClient.chat.completions.create({
            model: 'llama3-8b-8192', // Modelo recomendado por su velocidad y calidad (ej. en Groq). Puedes usar 'gpt-4o', etc.
            messages: [
            {
                role: 'system',
                content: systemPrompt, // Aquí inyectamos nuestras instrucciones maestras.
            },
            {
                role: 'user',
                content: text, // Este es el texto variable que proporciona el usuario.
            },
            ],
            temperature: 0.2, // Una temperatura baja hace que la respuesta sea más predecible y se ciña a las reglas.
            max_tokens: 60,   // Limitamos la longitud de la respuesta para evitar texto innecesario.
        });
        */
        const llmClient = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await llmClient.generateContent(fullPrompt);
        const response = result.response;
        const translation = response.text().trim();

      if (!translation) {
        throw new Error('La respuesta del LLM no contenía texto.');
      }
      //console.log(`[TranslatorTool] raw: "${JSON.stringify(response)}"`);
      console.log(`[TranslatorTool] Traducción recibida: "${translation}"`);
      return translation;

    } catch (error) {
      console.error('[TranslatorTool] Ha ocurrido un error al comunicarse con el LLM:', error);
      // En caso de error, devolvemos un mensaje claro para el juego.
      return 'Error al traducir. '+
        "[TranslatorTool] Ha ocurrido un error al comunicarse con el LLM:" + error.mensaje +" - "+JSON.stringify(error) ;
    }
  }
}