import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API endpoint for Gemini-powered Demand Analysis
app.post('/api/ai-analyze', async (req, res) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Falta el prompt para el análisis.' });
    }

    if (!aiClient) {
      return res.status(503).json({
        error: 'Servicio de Gemini no configurado en el servidor (GEMINI_API_KEY no detectada). Se utilizará el motor analítico heurístico local.',
      });
    }

    const systemInstruction = `
Eres un experto economista senior y consultor en Investigación de Mercados y Análisis de la Demanda.
Tu objetivo es analizar los datos empíricos de encuestas (ej. Google Forms) para generar interpretaciones precisas, técnicas, rigurosas y académicas.
Debes distinguir claramente entre respuestas observadas en la muestra y estimaciones de demanda de mercado.
Estructura tus respuestas con:
1. Hallazgo Clave (Diagnóstico cuantitativo).
2. Interpretación de la Demanda (Elasticidad, intención de uso, sustitutos, fricciones).
3. Conclusiones y Recomendaciones Académicas o de Negocio.
Responde en español con tono profesional, objetivo y fundamentado.
`;

    const fullPrompt = `${context ? `[DATOS DE CONTEXTO]:\n${JSON.stringify(context, null, 2)}\n\n` : ''}[SOLICITUD]:\n${prompt}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    return res.json({
      success: true,
      analysis: response.text || 'No se pudo generar respuesta de texto.',
    });
  } catch (error: any) {
    console.error('Error in /api/ai-analyze:', error);
    return res.status(500).json({
      error: error.message || 'Error al procesar la solicitud con Gemini.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!apiKey,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port} (${isDev ? 'development' : 'production'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
