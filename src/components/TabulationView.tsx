import React, { useState } from 'react';
import { 
  Table2, 
  Download, 
  FileSpreadsheet, 
  Layers, 
  MessageSquareQuote, 
  Sparkles, 
  Info,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { SurveyDataset, ProcessedQuestion } from '../types/demand';
import { downloadTableCSV, downloadAllTablesExcel } from '../utils/statisticalEngine';

interface TabulationViewProps {
  dataset: SurveyDataset;
  onOpenAIQuestion: (question: ProcessedQuestion) => void;
}

export const TabulationView: React.FC<TabulationViewProps> = ({
  dataset,
  onOpenAIQuestion,
}) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('all');

  const questions = dataset.questions;
  const currentQuestions = selectedQuestionId === 'all' 
    ? questions 
    : questions.filter(q => q.id === selectedQuestionId);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header & Actions */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Table2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Tabulación Estadística de Resultados
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Tablas automáticas con frecuencia absoluta (<span className="font-mono font-semibold">fi</span>), frecuencia relativa (<span className="font-mono font-semibold">hi</span>), porcentaje (<span className="font-mono font-semibold">%</span>) y distribución acumulada.
          </p>
        </div>

        <button
          onClick={() => downloadAllTablesExcel(dataset)}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition flex-shrink-0 cursor-pointer"
          title="Descargar libro completo de Excel con todas las preguntas tabuladas"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
          <span>Exportar Todas las Tablas a Excel (.xlsx)</span>
        </button>
      </div>

      {/* Filter Tabs / Question Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1 flex-shrink-0">
          <Filter className="w-3.5 h-3.5" /> Filtrar:
        </span>
        <button
          onClick={() => setSelectedQuestionId('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex-shrink-0 ${
            selectedQuestionId === 'all'
              ? 'bg-blue-600 text-white shadow-sm font-semibold'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Todas las Preguntas ({questions.length})
        </button>
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setSelectedQuestionId(q.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex-shrink-0 max-w-[200px] truncate ${
              selectedQuestionId === q.id
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
            title={q.title}
          >
            P{idx + 1}: {q.shortTitle}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-8">
        {currentQuestions.map((q, qIndex) => {
          const totalFi = q.table.reduce((sum, r) => sum + r.count, 0);
          const totalHi = q.table.reduce((sum, r) => sum + r.relativeFreq, 0);

          return (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Question Header Card */}
              <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-600 text-white">
                      Pregunta {qIndex + 1}
                    </span>
                    <span className="text-xs text-slate-300">
                      N = {q.validResponses} respuestas analizadas
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {q.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onOpenAIQuestion(q)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                    title="Analizar esta pregunta con IA"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>Interpretar con IA</span>
                  </button>
                  <button
                    onClick={() => downloadTableCSV(q.table, q.shortTitle)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                    title="Descargar esta tabla en CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* Statistical Table */}
              <div className="p-5 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                      <th className="py-2.5 px-3 font-bold border border-slate-200">
                        Categoría / Opción de Respuesta
                      </th>
                      <th className="py-2.5 px-3 font-bold text-right border border-slate-200 font-mono">
                        Frecuencia Absoluta (fi)
                      </th>
                      <th className="py-2.5 px-3 font-bold text-right border border-slate-200 font-mono">
                        Frecuencia Relativa (hi)
                      </th>
                      <th className="py-2.5 px-3 font-bold text-right border border-slate-200 font-mono">
                        Porcentaje (%)
                      </th>
                      <th className="py-2.5 px-3 font-bold text-right border border-slate-200 font-mono">
                        Frecuencia Acumulada (Fi)
                      </th>
                      <th className="py-2.5 px-3 font-bold text-right border border-slate-200 font-mono">
                        % Acumulado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {q.table.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 transition">
                        <td className="py-2.5 px-3 text-slate-900 border border-slate-200 flex items-center justify-between">
                          <span>{row.category}</span>
                          {rIdx === 0 && (
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 ml-2">
                              Líder
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 border border-slate-200">
                          {row.count}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600 border border-slate-200">
                          {row.relativeFreq.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-800 border border-slate-200">
                          {row.percentage}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600 border border-slate-200">
                          {row.cumulativeFreq}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600 border border-slate-200">
                          {row.cumulativePercent}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-400">
                      <td className="py-2.5 px-3 border border-slate-200 uppercase tracking-wider">
                        Total Muestra Analizada (Σ)
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono border border-slate-200">
                        {totalFi}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono border border-slate-200">
                        {totalHi.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono border border-slate-200 text-blue-900">
                        100.0%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-500 border border-slate-200">
                        -
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-500 border border-slate-200">
                        -
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Thematic Clusters for Open-Ended Questions */}
              {q.clusters && q.clusters.length > 0 && (
                <div className="mx-5 mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquareQuote className="w-4 h-4 text-blue-700" />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      Clasificación Temática de Respuestas Abiertas (Text Mining & Sentiment)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.clusters.map((cluster, cIdx) => (
                      <div
                        key={cIdx}
                        className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            {cluster.theme}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              cluster.sentiment === 'favorable'
                                ? 'bg-emerald-100 text-emerald-800'
                                : cluster.sentiment === 'critico'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {cluster.percentage}% ({cluster.count})
                          </span>
                        </div>

                        <div className="space-y-1 text-slate-600 italic border-l-2 border-blue-400 pl-2">
                          {cluster.sampleQuotes.map((quote, qIdx) => (
                            <p key={qIdx} className="line-clamp-2">
                              "{quote}"
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interpretation and Demand Implication Footer */}
              <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-blue-600" /> Interpretación Estadística:
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {q.interpretation}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-blue-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Implicación para el Análisis de Demanda:
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {q.demandImplication}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
