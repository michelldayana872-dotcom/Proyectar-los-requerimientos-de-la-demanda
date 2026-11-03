import React, { useState } from 'react';
import { 
  PieChart, 
  BarChart3, 
  BarChart2, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  SlidersHorizontal 
} from 'lucide-react';
import { SurveyDataset, ProcessedQuestion } from '../types/demand';
import { SimpleBarChart, SimpleDoughnutChart } from './StatCharts';

interface ChartsViewProps {
  dataset: SurveyDataset;
  onOpenAIQuestion: (question: ProcessedQuestion) => void;
}

export const ChartsView: React.FC<ChartsViewProps> = ({
  dataset,
  onOpenAIQuestion,
}) => {
  // Store chart mode override per question
  const [chartModes, setChartModes] = useState<Record<string, 'bar' | 'horizontal_bar' | 'doughnut'>>({});

  const getChartMode = (q: ProcessedQuestion) => {
    return chartModes[q.id] || q.chartTypeDefault;
  };

  const setQuestionMode = (qId: string, mode: 'bar' | 'horizontal_bar' | 'doughnut') => {
    setChartModes(prev => ({ ...prev, [qId]: mode }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Visualización y Gráficos Estadísticos de la Demanda
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Representaciones gráficas adaptativas (barras verticales, barras horizontales y diagramas circulares/donas) con selectores interactivos para cada variable.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>{dataset.questions.length} dimensiones analizadas gráficamente</span>
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {dataset.questions.map((q, idx) => {
          const currentMode = getChartMode(q);

          return (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition"
            >
              {/* Question Chart Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Dimensión {idx + 1}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1 line-clamp-2" title={q.title}>
                    {q.shortTitle}
                  </h3>
                </div>

                {/* Chart Toggle Buttons */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg flex-shrink-0 self-start sm:self-auto">
                  <button
                    onClick={() => setQuestionMode(q.id, 'horizontal_bar')}
                    className={`p-1.5 rounded text-xs transition cursor-pointer ${
                      currentMode === 'horizontal_bar'
                        ? 'bg-white shadow text-blue-600 font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Barras Horizontales"
                  >
                    <BarChart2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setQuestionMode(q.id, 'bar')}
                    className={`p-1.5 rounded text-xs transition cursor-pointer ${
                      currentMode === 'bar'
                        ? 'bg-white shadow text-blue-600 font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Barras Verticales"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setQuestionMode(q.id, 'doughnut')}
                    className={`p-1.5 rounded text-xs transition cursor-pointer ${
                      currentMode === 'doughnut'
                        ? 'bg-white shadow text-blue-600 font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Gráfico Circular / Dona"
                  >
                    <PieChart className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chart Render Body */}
              <div className="py-4 flex-1 flex items-center justify-center min-h-[260px]">
                {currentMode === 'horizontal_bar' && (
                  <SimpleBarChart data={q.table} horizontal={true} />
                )}
                {currentMode === 'bar' && (
                  <SimpleBarChart data={q.table} horizontal={false} />
                )}
                {currentMode === 'doughnut' && (
                  <SimpleDoughnutChart data={q.table} size={220} />
                )}
              </div>

              {/* Chart Interpretation Footer */}
              <div className="pt-3 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-6 p-4 rounded-b-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    Lectura Estadística y Demanda:
                  </span>
                  <button
                    onClick={() => onOpenAIQuestion(q)}
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-sky-500" />
                    <span>Ampliar con IA</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {q.interpretation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
