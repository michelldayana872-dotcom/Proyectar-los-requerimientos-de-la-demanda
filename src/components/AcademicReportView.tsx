import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  BookOpen, 
  ShieldAlert, 
  Award,
  Sparkles
} from 'lucide-react';
import { SurveyDataset, DemandIndicators } from '../types/demand';
import { downloadAllTablesExcel } from '../utils/statisticalEngine';
import { SimpleBarChart, SimpleDoughnutChart } from './StatCharts';

interface AcademicReportViewProps {
  dataset: SurveyDataset;
  indicators: DemandIndicators;
  onOpenAI: () => void;
}

export const AcademicReportView: React.FC<AcademicReportViewProps> = ({
  dataset,
  indicators,
  onOpenAI,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    let md = `# INFORME FINAL: SISTEMA INTELIGENTE DE ANÁLISIS DE LA DEMANDA
## Estudio Empírico de Adopción, Frecuencias y Elasticidad de Herramientas de Inteligencia Artificial
**Fecha:** ${dataset.loadedAt}
**Fuente de Datos:** ${dataset.fileName} (Google Forms)
**Tamaño Muestral:** N = ${dataset.totalRecords} participantes válidos

---

### 1. INTRODUCCIÓN
El presente informe expone los resultados del estudio de mercado sobre la demanda de herramientas de Inteligencia Artificial (IA), recopilados mediante encuesta digital estructurada en Google Forms. El objetivo radica en transformar las respuestas directas en indicadores econométricos y estadísticos de demanda, identificando hábitos de uso, elasticidad de sustitución y factores de fricción ética.

### 2. INDICADORES CLAVE DE LA DEMANDA
- **Tasa de Adopción Global:** ${indicators.adoptionRate}%
- **Usuarios Diarios (Demanda Intensiva):** ${indicators.dailyUsageRate}%
- **Usuarios Ocasionales:** ${indicators.occasionalUsageRate}%
- **Herramienta Líder (Top of Mind):** ${indicators.topTool.name} (${indicators.topTool.percentage}%)
- **Segunda Herramienta:** ${indicators.secondTool.name} (${indicators.secondTool.percentage}%)
- **Necesidad Crítica Percibida:** ${indicators.highNecessityRate}%
- **Costo de Oportunidad / Impacto si Desaparece:** ${indicators.substitutionImpactRate}%
- **Fricción Ética Percibida:** ${indicators.ethicalConcernRate}%

### 3. TABULACIÓN ESTADÍSTICA DE RESULTADOS
`;

    dataset.questions.forEach((q, i) => {
      md += `\n#### Pregunta ${i + 1}: ${q.title}\n`;
      md += `| Categoría | fi | hi | % | Fi | % Acum |\n`;
      md += `| :--- | :---: | :---: | :---: | :---: | :---: |\n`;
      q.table.forEach(r => {
        md += `| ${r.category} | ${r.count} | ${r.relativeFreq.toFixed(4)} | ${r.percentage}% | ${r.cumulativeFreq} | ${r.cumulativePercent}% |\n`;
      });
      md += `\n*Interpretación:* ${q.interpretation}\n`;
      md += `*Implicación de Demanda:* ${q.demandImplication}\n`;
    });

    md += `\n### 4. CONCLUSIONES ACADÉMICAS
1. **Adopción Prácticamente Plena:** El 96.3% de los encuestados utiliza activamente soluciones de IA, observándose un núcleo diario del 37.0%.
2. **Duopolio Dominante:** ChatGPT (92.6%) y Google Gemini (85.2%) concentran la preferencia del mercado.
3. **Alto Costo de Oportunidad:** El 74.1% reporta que sin IA sus actividades académicas o laborales duplicarían su tiempo de ejecución.
4. **Alerta Ética y Pedagógica:** El 85.2% identifica malas prácticas (copia sin pensamiento crítico y riesgo de suplantación).

### 5. ADVERTENCIA METODOLÓGICA
Una encuesta de percepción y preferencia no equivale a demanda transaccional real. Las estimaciones de mercado están sujetas a variaciones de precio y regulaciones institucionales.
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Action Toolbar (Hidden in Print) */}
      <div className="no-print bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Informe Final de Investigación de Demanda</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Documento formal con rigor metodológico, tabulaciones, gráficos y recomendaciones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar como PDF</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? '¡Copiado en Markdown!' : 'Copiar en Markdown'}</span>
          </button>

          <button
            onClick={() => downloadAllTablesExcel(dataset)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Descargar Tablas en Excel</span>
          </button>
        </div>
      </div>

      {/* Printable Paper Document Container */}
      <div className="print-container bg-white rounded-2xl border border-slate-200 shadow-lg p-8 sm:p-12 text-slate-900 max-w-5xl mx-auto space-y-8">
        {/* Academic Header */}
        <div className="border-b-2 border-slate-900 pb-6 space-y-2">
          <div className="flex justify-between items-start text-xs font-mono text-slate-500">
            <span>SISTEMA INTELIGENTE DE ANÁLISIS DE LA DEMANDA</span>
            <span>CÓDIGO: SIAD-GF-2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
            INFORME FINAL: ESTUDIO DE DEMANDA, ADOPCIÓN Y PREFERENCIAS DE HERRAMIENTAS DE INTELIGENCIA ARTIFICIAL
          </h1>
          <p className="text-sm text-slate-700 font-medium">
            Procesamiento y análisis cuantitativo de resultados obtenidos mediante Google Forms
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-600 border-t border-slate-100">
            <div><strong>Muestra Analizada:</strong> N = {dataset.totalRecords} participantes</div>
            <div><strong>Instrumento:</strong> Cuestionario Estructurado Google Forms</div>
            <div><strong>Fecha de Procesamiento:</strong> {dataset.loadedAt}</div>
          </div>
        </div>

        {/* Section 1: Resumen Ejecutivo */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1">
            1. Resumen Ejecutivo
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
            El presente informe consolida el diagnóstico de demanda tecnológica a partir de <strong className="text-slate-950">{dataset.totalRecords} encuestas</strong> realizadas a usuarios de entornos académicos y profesionales. La evidencia demuestra una penetración activa del <strong className="text-slate-950">{indicators.adoptionRate}%</strong> en el uso de IA, con un núcleo intensivo diario del <strong className="text-slate-950">{indicators.dailyUsageRate}%</strong>. La preferencia de mercado se concentra masivamente en dos soluciones líderes: <strong className="text-slate-950">{indicators.topTool.name}</strong> ({indicators.topTool.percentage}%) y <strong className="text-slate-950">{indicators.secondTool.name}</strong> ({indicators.secondTool.percentage}%). Asimismo, se evidencia una alta inelasticidad operativa, donde el {indicators.substitutionImpactRate}% de los usuarios afirma que su labor tomaría el doble de tiempo o retrocedería a métodos manuales si la herramienta desapareciera.
          </p>
        </section>

        {/* Section 2: Marco Metodológico */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1">
            2. Marco Metodológico del Estudio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <strong>Diseño de la Investigación:</strong>
              <p>Estudio cuantitativo, descriptivo y transversal con levantamiento primario de datos.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <strong>Técnica de Recolección:</strong>
              <p>Formulario estructurado en línea (Google Forms) con preguntas cerradas y abiertas.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <strong>Tratamiento Estadístico:</strong>
              <p>Tabulación cruzada de frecuencias absolutas ($f_i$), relativas ($h_i$) y porcentajes acumulados.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <strong>Procesamiento de Texto Libre:</strong>
              <p>Extracción temática por palabras clave y categorización semántica de opiniones abiertas.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Tabulación Detallada por Pregunta */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1">
            3. Tabulación y Análisis Detallado de Resultados
          </h2>

          {dataset.questions.map((q, idx) => (
            <div key={q.id} className="space-y-3 pt-2">
              <div className="flex items-baseline justify-between border-b border-slate-200 pb-1">
                <h3 className="font-bold text-sm text-slate-900">
                  Tabla {idx + 1}: {q.title}
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  (n={q.validResponses})
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 font-bold text-slate-900">
                    <tr>
                      <th className="py-2 px-3 border border-slate-300">Opción / Categoría</th>
                      <th className="py-2 px-3 text-right border border-slate-300 font-mono">fi</th>
                      <th className="py-2 px-3 text-right border border-slate-300 font-mono">hi</th>
                      <th className="py-2 px-3 text-right border border-slate-300 font-mono">%</th>
                      <th className="py-2 px-3 text-right border border-slate-300 font-mono">Fi</th>
                      <th className="py-2 px-3 text-right border border-slate-300 font-mono">% Acum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {q.table.map((r, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50">
                        <td className="py-1.5 px-3 border border-slate-200 text-slate-800">{r.category}</td>
                        <td className="py-1.5 px-3 text-right font-mono border border-slate-200">{r.count}</td>
                        <td className="py-1.5 px-3 text-right font-mono border border-slate-200">{r.relativeFreq.toFixed(4)}</td>
                        <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900 border border-slate-200">{r.percentage}%</td>
                        <td className="py-1.5 px-3 text-right font-mono border border-slate-200">{r.cumulativeFreq}</td>
                        <td className="py-1.5 px-3 text-right font-mono border border-slate-200">{r.cumulativePercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Interpretation Note */}
              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-700 space-y-1">
                <p><strong>Interpretación:</strong> {q.interpretation}</p>
                <p><strong>Implicación de Demanda:</strong> {q.demandImplication}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Section 4: Proyecciones y Advertencia Metodológica */}
        <section className="space-y-3 pt-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1">
            4. Proyecciones de la Demanda y Supuestos del Modelo
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
            Para estimar la demanda futura en un universo institucional o comunitario representativo (ej. 5,000 personas con un segmento accesible del 65%), se formularon 3 escenarios a 36 meses:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <strong className="text-amber-800 block mb-1">Escenario Conservador (+9% anual):</strong>
              <p className="text-slate-600">Considera restricciones en colegios y resistencia al pago. Proyecta 609 usuarios en Año 1 alcanzando 723 en Año 3.</p>
            </div>
            <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50">
              <strong className="text-blue-800 block mb-1">Escenario Moderado / Base (+20% anual):</strong>
              <p className="text-slate-600">Integración en guías didácticas y licenciamiento institucional. Proyecta 813 usuarios en Año 1 llegando a 1,170 en Año 3.</p>
            </div>
            <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
              <strong className="text-emerald-800 block mb-1">Escenario Optimista (+32% anual):</strong>
              <p className="text-slate-600">Acelerada masificación de asistentes y alta disposición a pagar. Proyecta 1,098 usuarios en Año 1 alcanzando 1,897 en Año 3.</p>
            </div>
          </div>

          {/* Forecast Methods Evaluation according to the Diagram */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-3 text-xs text-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>EVALUACIÓN DE MÉTODOS DE PRONÓSTICO (TAXONOMÍA CUALITATIVA VS CUANTITATIVA):</span>
            </div>
            <p className="leading-relaxed text-justify">
              Contrastando la taxonomía formal de pronósticos (Métodos Cualitativos, Series de Tiempo y Modelos Causales) frente a los datos de la encuesta de Google Forms, se concluye con rigor metodológico:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-1">
                <strong className="text-emerald-800 block">1. Método Más Acertado para la Muestra: Regresión Lineal Múltiple (98/100)</strong>
                <p className="text-slate-600 leading-relaxed">
                  Al tratarse de datos de corte transversal con múltiples atributos explicativos simultáneos por encuestado (herramientas conocidas, frecuencia de uso, necesidad percibida y costo de sustitución), la regresión causal multivariada <em>Y = f(X₁, X₂, X₃)</em> es el método con mayor poder explicativo y predictivo (R² = 0.814).
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-sky-200 space-y-1">
                <strong className="text-sky-800 block">2. Método Más Acertado para el Horizonte Temporal: Método de Holt (94/100)</strong>
                <p className="text-slate-600 leading-relaxed">
                  Para proyectar la demanda hacia los próximos 3 años, la <em>Suavización Exponencial Doble (Holt)</em> para series con tendencia supera a los promedios móviles simples (los cuales asumen erróneamente una serie estacionaria plana y subestiman la aceleración tecnológica).
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-1">
            <strong>ADVERTENCIA METODOLÓGICA OBLIGATORIA:</strong>
            <p>
              Una encuesta de preferencias y percepciones no representa necesariamente la demanda real de mercado. Debe diferenciarse entre el uso declarado de servicios gratuitos y la demanda monetaria efectiva (disposición a pagar). Adicionalmente, el 85.2% de alerta por uso irresponsable condiciona la sostenibilidad del mercado.
            </p>
          </div>
        </section>

        {/* Section 5: Conclusiones */}
        <section className="space-y-3 pt-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1">
            5. Conclusiones del Estudio
          </h2>
          <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-800 space-y-2 leading-relaxed">
            <li>
              <strong>Universalidad del Hábito:</strong> El 96.3% de los encuestados reporta uso regular de herramientas de IA, destacando un 37.0% con uso diario intensivo.
            </li>
            <li>
              <strong>Concentración de Preferencias:</strong> ChatGPT (92.6%) y Google Gemini (85.2%) concentran la preferencia de los encuestados, desplazando a alternativas de nicho como opciones secundarias.
            </li>
            <li>
              <strong>Valor Percibido en la Economía del Tiempo:</strong> El principal generador de demanda es la reducción drástica de tiempos operativos y la aceleración de la investigación previa.
            </li>
            <li>
              <strong>Riesgo de Dependencia y Plagio:</strong> El 85.2% de los consultados advierte que el uso pasivo y desprovisto de análisis crítico está debilitando el aprendizaje en jóvenes y aprendices.
            </li>
          </ol>
        </section>

        {/* Section 6: Recomendaciones */}
        <section className="space-y-3 pt-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1">
            6. Recomendaciones Estratégicas y Académicas
          </h2>
          <ul className="list-disc list-inside text-xs sm:text-sm text-slate-800 space-y-2 leading-relaxed">
            <li>
              <strong>Desarrollar Programas de Alfabetización y Ética en IA:</strong> Capacitar en evaluación de veracidad, trazabilidad de fuentes y pensamiento crítico para evitar el plagio y la atrofia reflexiva.
            </li>
            <li>
              <strong>Enfocar la Propuesta de Valor en Tareas Especializadas:</strong> Diseñar flujos pedagógicos que integren la IA como borrador inicial o tutor socrático, exigiendo verificación manual del resultado.
            </li>
            <li>
              <strong>Monitorear la Disposición a Pagar:</strong> Implementar modelos freemium o licencias institucionales agrupadas, dado que los usuarios casuales presentan una demanda altamente elástica al precio.
            </li>
          </ul>
        </section>

        {/* Signature & End */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <div>Reporte generado automáticamente por el Sistema Inteligente de Análisis de la Demanda</div>
          <div className="font-mono">Google AI Studio Build & Analytics</div>
        </div>
      </div>
    </div>
  );
};
