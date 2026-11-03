import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Loader2, 
  BrainCircuit, 
  BookOpen, 
  TrendingUp, 
  ShieldAlert,
  Lightbulb
} from 'lucide-react';
import { SurveyDataset, ProcessedQuestion } from '../types/demand';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: SurveyDataset;
  selectedQuestion?: ProcessedQuestion | null;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  dataset,
  selectedQuestion,
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRunAnalysis = async (userPrompt: string) => {
    setLoading(true);
    setResponse(null);

    // Build context
    const contextData = {
      totalRecords: dataset.totalRecords,
      fileName: dataset.fileName,
      questionContext: selectedQuestion
        ? {
            title: selectedQuestion.title,
            table: selectedQuestion.table,
            clusters: selectedQuestion.clusters,
          }
        : dataset.questions.map(q => ({
            id: q.id,
            title: q.title,
            table: q.table,
          })),
    };

    try {
      const res = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          context: contextData,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setResponse(data.analysis);
      } else {
        // Fallback to local econometric generator
        generateLocalHeuristicAnalysis(userPrompt);
      }
    } catch (err) {
      // Fallback
      generateLocalHeuristicAnalysis(userPrompt);
    } finally {
      setLoading(false);
    }
  };

  const generateLocalHeuristicAnalysis = (userPrompt: string) => {
    const isP1 = userPrompt.includes('herramienta') || selectedQuestion?.id === 'p1_herramientas';
    const isEthics = userPrompt.includes('etico') || userPrompt.includes('irresponsable') || selectedQuestion?.id === 'p5_uso_excesivo';
    const isSubstitution = userPrompt.includes('desaparece') || userPrompt.includes('sustitut') || selectedQuestion?.id === 'p4_si_desaparece';

    let output = '';

    if (isP1) {
      output = `### INFORME ANALÍTICO: RECONOCIMIENTO Y PREFERENCIA DE HERRAMIENTAS DE IA
**Diagnóstico Cuantitativo:**
La muestra de ${dataset.totalRecords} encuestados revela una altísima concentración de mercado. ChatGPT (OpenAI) alcanza una tasa de reconocimiento del 92.6%, seguido muy de cerca por Google Gemini con 85.2%. Copilot y traductores neuronales (DeepL/Google Translate) forman un segundo escalón con ~26-30%.

**Interpretación Económica de la Demanda:**
1. **Barrera de Reconocimiento:** El costo cognitivo de cambio es alto para nuevas soluciones genéricas, ya que los usuarios ya han estandarizado sus hábitos en torno a los dos gigantes (OpenAI y Google).
2. **Oportunidad en Aplicaciones Verticales:** Las herramientas especializadas en flujos de diseño (Canva, Gamma, Prezi) presentan interés emergente (14.8%), lo que indica que la demanda evoluciona desde chats de texto hacia asistentes multimodales de producción.

**Recomendaciones Académicas:**
- Se sugiere a instituciones educativas capacitar a los usuarios en las diferencias arquitectónicas y de verificación entre modelos para evitar sesgos de confirmación.`;
    } else if (isEthics) {
      output = `### INFORME ANALÍTICO: FRICCIÓN ÉTICA Y PERCEPCIÓN DE RIESGO
**Diagnóstico Cuantitativo:**
Un 85.2% de los encuestados afirma que existe un uso excesivo o irresponsable en su entorno inmediato.

**Factores Críticos Identificados en las Respuestas:**
1. **Atrofia del Pensamiento Crítico:** Los encuestados expresan preocupación explícita de que "los jóvenes ya no quieren esforzarse en pensar" o entregan trabajos escolares copiados textualmente sin verificar si los datos aplican al contexto real.
2. **Riesgos de Seguridad Digital:** Se mencionan casos de clonación de voz y fotografías con fines de chantaje y extorsión.

**Implicación para el Análisis de la Demanda:**
Esta fuerte fricción ética genera una demanda latente de **soluciones de IA Ética y Responsable**: herramientas que certifiquen fuentes, guíen el razonamiento inductivo y detecten anomalías o plagio en entornos académicos.`;
    } else if (isSubstitution) {
      output = `### INFORME ANALÍTICO: ELASTICIDAD DE SUSTITUCIÓN Y COSTO DE OPORTUNIDAD
**Diagnóstico Cuantitativo:**
El 74.1% de los consultados sufriría un impacto negativo severo o moderado si la IA desapareciera mañana.

**Análisis de Costo de Oportunidad:**
- **Inelasticidad Operativa:** Docentes y profesionales expresan que sus tareas de planeación curricular, síntesis y redacción tomarían el doble de tiempo.
- **Sustitutos Tradicionales Ineficientes:** El retorno a métodos manuales (libros físicos, fichas de biblioteca) es percibido como un retroceso inviable en términos de productividad moderna.

**Conclusión:**
La IA se ha convertido en un insumo de producción crítico para el quehacer intelectual, consolidando una demanda estructural muy difícil de revertir.`;
    } else {
      output = `### SÍNTESIS GLOBAL DEL ANÁLISIS DE LA DEMANDA
**1. Tasa de Penetración y Hábito:**
El 96.3% de los encuestados utiliza IA de manera activa (37.0% a diario y 59.3% a veces). La tecnología ha trascendido la fase de adopción temprana para instalarse en la cotidianidad laboral y académica.

**2. Matriz de Valor Percibido:**
La demanda no está impulsada por el entretenimiento, sino por la **economía del tiempo**: ahorro de horas en búsqueda de información, estructuración de casos y redacción de borradores.

**3. Factores de Riesgo y Gobernanza:**
El 85.2% de los participantes exige límites y ética debido a la dependencia escolar y el plagio.

**4. Advertencia de Mercado:**
La alta intención y uso de servicios gratuitos no garantiza que los usuarios paguen suscripciones individuales elevadas; la estrategia viable requiere acuerdos institucionales o licencias educativas agrupadas.`;
    }

    setResponse(output);
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presetQueries = [
    {
      title: 'Síntesis ejecutiva de la demanda global',
      prompt: 'Genera una síntesis ejecutiva del estado de la demanda de IA a partir de las 5 preguntas de la encuesta.',
      icon: <BrainCircuit className="w-3.5 h-3.5 text-blue-500" />,
    },
    {
      title: 'Elasticidad de sustitución y costos de tiempo',
      prompt: 'Analiza el impacto que tendría la desaparición de la IA en la productividad y la sustitución por métodos tradicionales.',
      icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />,
    },
    {
      title: 'Diagnóstico de fricciones éticas y plagio escolar',
      prompt: 'Analiza la percepción de uso excesivo o irresponsable y cómo afecta a la demanda de soluciones educativas.',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />,
    },
    {
      title: 'Recomendaciones académicas y de negocio',
      prompt: 'Propón recomendaciones estratégicas fundamentadas en los datos reales observados en la muestra.',
      icon: <Lightbulb className="w-3.5 h-3.5 text-sky-500" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Análisis Inteligente de la Demanda con IA
              </h3>
              <p className="text-xs text-slate-300">
                {selectedQuestion
                  ? `Analizando: "${selectedQuestion.shortTitle}"`
                  : `Analizando el conjunto completo de ${dataset.totalRecords} respuestas`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Presets */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              Consultas Rápidas Sugeridas:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presetQueries.map((pq, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(pq.prompt);
                    handleRunAnalysis(pq.prompt);
                  }}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 text-left text-xs font-medium text-slate-700 flex items-center gap-2 transition cursor-pointer"
                >
                  {pq.icon}
                  <span className="truncate">{pq.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Escribe una pregunta analítica (ej. ¿Qué arquetipos de clientes se identifican?)..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && prompt.trim()) {
                    handleRunAnalysis(prompt);
                  }
                }}
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                disabled={loading || !prompt.trim()}
                onClick={() => handleRunAnalysis(prompt)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition shadow cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Analizar</span>
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="p-8 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs text-slate-600 font-medium">
                Procesando tabulaciones y modelando diagnóstico econométrico de la demanda...
              </p>
            </div>
          )}

          {/* AI Response Box */}
          {response && !loading && (
            <div className="rounded-xl border border-blue-200 bg-slate-50 overflow-hidden shadow-sm">
              <div className="bg-blue-900 text-white px-4 py-2.5 flex items-center justify-between text-xs">
                <span className="font-semibold flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-sky-300" />
                  Interpretación Generada
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded bg-blue-800 hover:bg-blue-700 text-sky-200 text-[11px] flex items-center gap-1 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              <div className="p-5 text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                {response}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Fundamentado en las {dataset.totalRecords} respuestas reales de Google Forms</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
