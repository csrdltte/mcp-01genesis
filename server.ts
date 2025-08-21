import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod'
import { exec, execSync } from 'child_process'
import { TranslatorTool } from './translator.tool'; // Asegúrate de que la ruta sea correcta


class Mcp01Genesis {
    private server: McpServer;

    constructor() {

        // 1. Crear el servidor MCP
        // el servidor es la interfaz principal con el protocolo MCP. Maneja la comunicación y la lógica de negocio.

        this.server = new McpServer({
            name: 'mcp-01genesis',
            version: '1.0.0',
            description: 'MCP server for translation',
        },
            {
                capabilities: {
                    tools: {},
                },
            }
        )

        this.setupToolHandlers();
        this.server.server.onerror = (error: any) => {
            console.error('[MCP Server Error]', error);
            this.server.close();
        };
        console.log('MCP server 01genesis initialized and ready to receive requests.');
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }




    // 2. Definir herramienta
    // Las herramientas permiten al LLM realizar acciones específicas. 
    private setupToolHandlers() {
        this.server.tool(
            'translate-to-english',
            'Translate text to English',
            {
                inputText: z.string().describe('Text to translate'),
            },
            async ({ inputText }, _extra) => {
                let responseText: string;
                if (inputText.length === 0) {
                    responseText = 'empty text';
                    console.log(`(Al jugador) -> ${responseText}`);
                } else {
                    // ¡Aquí es donde usamos nuestra herramienta!
                    responseText = await TranslatorTool.translate(inputText);
                    console.log(`(Al jugador) -> ${responseText}`);
                }
                return {
                    content: [{
                        type: "text",
                        text: `${responseText}`
                    }],
                };
            }
        )

    }

    // 3. Escuchar las conexiones del cliente
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('ImageN MCP server running on stdio');
    }

}


const server = new Mcp01Genesis();
server.run().catch(console.error);

