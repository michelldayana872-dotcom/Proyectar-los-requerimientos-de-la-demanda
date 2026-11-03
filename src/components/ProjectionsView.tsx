import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Sliders, 
  Calculator, 
  ShieldAlert, 
  CheckCircle2, 
  Award, 
  AlertTriangle, 
  GitFork, 
  Network, 
  BrainCircuit, 
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { DemandIndicators, SurveyDataset, MethodForecastModel } from '../types/demand';
import { calculateDemandProjections } from '../utils/statisticalEngine';
import { calculateAllForecastMethods } from '../utils/forecastMethodsEngine';

interface ProjectionsViewProps {
  indicators: DemandIndicators;
  dataset: SurveyDataset;
}

export const ProjectionsView: React.FC<ProjectionsViewProps> = ({ indicators, dataset }) => {
  // Configurable parameters
  const [tamPopulation, setTamPopulation] = useState<number>(5000);
  const [samPercent, setSamPercent] = useState<number>(65);
  const [selectedMethodId, setSelectedMethodId] = useState<string>('causal_multiple_regression');

  // Calculate methods from image taxonomy
  const { methods, bestFitMethod, comparisonSummary } = calculateAllForecastMethods(
    dataset,
    indicators,
    tamPopulation,
    samPercent
  );

  const activeMethod = methods.find(m => m.id === selectedMethodId) || bestFitMethod;
  const maxYear3Value = Math.max(...methods.map(m => m.projections.year3), 1);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Proyecciones de la Demanda Basadas en Métodos de Pronóstico
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Modelación comparativa según la taxonomía metodológica: <span className="font-semibold text-slate-800">Cualitativos</span>, <span className="font-semibold text-slate-800">Series de Tiempo (Estacionarias / Tendencia / Estacionales)</span> y <span className="font-semibold text-slate-800">Modelos Causales</span>.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-1.5 flex-shrink-0">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Método Más Acertado Identificado</span>
        </div>
      </div>

      {/* Mandatory Academic Caveat Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-1.5 text-xs shadow-sm">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>ADVERTENCIA METODOLÓGICA Y LIMITACIONES DEL MODELO:</span>
        </div>
        <p className="text-amber-900/90 leading-relaxed">
          <strong>Una encuesta de preferencias y percepciones no representa necesariamente la demanda real o transaccional del mercado.</strong> Los resultados aquí proyectados constituyen estimaciones econométricas sujetas a supuestos explicados. Debe diferenciarse entre las respuestas observadas en la muestra ($N={dataset.totalRecords}$) y las proyecciones teóricas basadas en modelos matemáticos.
        </p>
      </div>

      {/* VEREDICTO METODOLÓGICO: CUÁL MÉTODO SE ACIERTA MÁS */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>DICTAMEN METODOLÓGICO: MÉTODO MÁS ACERTADO AL INFORME</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                1. Regresión Lineal Múltiple (Causal) & 2. Método de Holt (Tendencia)
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed text-justify">
                Al analizar la estructura de la entrevista de Google Forms, los datos recopilados son de <strong className="text-sky-300">corte transversal (Cross-sectional)</strong>, no de serie temporal histórica. Por ello, el método cuantitativo que <strong>más se acierta directamente a la encuesta es el Modelo Causal de Regresión Lineal Múltiple</strong>:
              </p>

              <div className="space-y-2 text-xs text-slate-200">
                <div className="p-2.5 rounded-lg bg-white/10 border border-white/10 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">¿Por qué Regresión Lineal Múltiple?</strong> Modela la demanda efectiva ($Y$) en función de variables reales medidas en la encuesta: <em>Nivel de Necesidad ($X_1$)</em>, <em>Dominio de Herramientas ($X_2$)</em> y <em>Costo de Sustitución ($X_3$)</em> con un ajuste $R^2 = 0.814$.
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white/10 border border-white/10 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">¿Y para la proyección temporal a 3 años?</strong> El <strong>Método de Holt (Suavización Exponencial Doble para Series con Tendencia)</strong> es el más acertado de la rama de series de tiempo, ya que la adopción de IA es un fenómeno acelerado que invalida los promedios simples estacionarios.
                  </div>
                </div>
              </div>
            </div>

            {/* Scorecard Box */}
            <div className="bg-slate-800/90 rounded-xl p-5 border border-slate-700 space-y-3 text-center">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Índice de Idoneidad Metodológica
              </span>
              <div className="text-4xl font-extrabold text-emerald-400 font-mono">
                98 <span className="text-lg text-slate-400 font-normal">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Máximo acierto teórico y estadístico para el cuestionario estructurado de Google Forms.
              </p>
              <button
                onClick={() => setSelectedMethodId('causal_multiple_regression')}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition cursor-pointer"
              >
                Ver Parámetros y Fórmula
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ARBOL VISUAL Y TAXONOMÍA DE LA IMAGEN */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-blue-600" />
              <span>Mapa Conceptual de Métodos de Pronósticos (Taxonomía de la Imagen)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Haga clic en cualquier método para evaluar su fórmula, idoneidad y proyección calculada
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-mono">
            10 Métodos Analizados
          </span>
        </div>

        {/* Tree Interactive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Branch 1: Cualitativos */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Condición: No existen datos históricos
                </span>
                <h4 className="font-bold text-sm text-slate-900">Métodos Cualitativos</h4>
              </div>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                Cualitativo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedMethodId('qualitative_analogy')}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  selectedMethodId === 'qualitative_analogy'
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-sm'
                    : 'bg-white hover:bg-blue-50/50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>Analogía Histórica</span>
                  <span className="text-[10px] opacity-80">88 pts</span>
                </div>
                <div className="text-[10px] opacity-75 mt-0.5">Curva S de difusión (Rogers)</div>
              </button>

              <button
                onClick={() => setSelectedMethodId('qualitative_panel')}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  selectedMethodId === 'qualitative_panel'
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-sm'
                    : 'bg-white hover:bg-blue-50/50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>Consenso de Panel / Delphi</span>
                  <span className="text-[10px] opacity-80">80 pts</span>
                </div>
                <div className="text-[10px] opacity-75 mt-0.5">Opiniones de docentes/expertos</div>
              </button>
            </div>
          </div>

          {/* Branch 2: Cuantitativos */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/20 space-y-3">
            <div className="flex items-center justify-between border-b border-blue-200 pb-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700">
                  Condición: Sí existen datos empíricos / modelos
                </span>
                <h4 className="font-bold text-sm text-slate-900">Métodos Cuantitativos</h4>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-bold">
                Más Acertados
              </span>
            </div>

            <div className="space-y-2">
              {/* Causal Highlight */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Modelos Causales (Multivariados) - [MÁXIMO AJUSTE A ENCUESTA]:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedMethodId('causal_multiple_regression')}
                    className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer relative ${
                      selectedMethodId === 'causal_multiple_regression'
                        ? 'bg-emerald-700 text-white border-emerald-700 font-semibold shadow-sm'
                        : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-950'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Regresión Múltiple</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-mono font-bold">
                        98 pts ★
                      </span>
                    </div>
                    <div className="text-[10px] opacity-85 mt-0.5">Y = f(Necesidad, Herramientas, Impacto)</div>
                  </button>

                  <button
                    onClick={() => setSelectedMethodId('causal_simple_regression')}
                    className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                      selectedMethodId === 'causal_simple_regression'
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-sm'
                        : 'bg-white hover:bg-blue-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Regresión Simple</span>
                      <span className="text-[10px] opacity-80">89 pts</span>
                    </div>
                    <div className="text-[10px] opacity-75 mt-0.5">Y = f(Necesidad)</div>
                  </button>
                </div>
              </div>

              {/* Time Series Highlight */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Series de Tiempo (Con Tendencia) - [MÁXIMO AJUSTE TEMPORAL]:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedMethodId('trend_holt')}
                    className={`p-2 rounded-lg border text-left text-xs transition cursor-pointer ${
                      selectedMethodId === 'trend_holt'
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-sm'
                        : 'bg-white hover:bg-blue-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="font-bold flex justify-between">
                      <span>Método de Holt</span>
                      <span className="text-[10px] text-sky-600">94 pts</span>
                    </div>
                    <div className="text-[10px] opacity-75">Suav. doble (Lt, Tt)</div>
                  </button>

                  <button
                    onClick={() => setSelectedMethodId('trend_brown')}
                    className={`p-2 rounded-lg border text-left text-xs transition cursor-pointer ${
                      selectedMethodId === 'trend_brown'
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-sm'
                        : 'bg-white hover:bg-blue-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="font-bold flex justify-between">
                      <span>Método de Brown</span>
                      <span className="text-[10px] text-slate-500">84 pts</span>
                    </div>
                    <div className="text-[10px] opacity-75">Suav. un parámetro</div>
                  </button>

                  <button
                    onClick={() => setSelectedMethodId('trend_dma')}
                    className={`p-2 rounded-lg border text-left text-xs transition cursor-pointer ${
                      selectedMethodId === 'trend_dma'
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-sm'
                        : 'bg-white hover:bg-blue-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="font-bold flex justify-between">
                      <span>Prom. Móvil Doble</span>
                      <span className="text-[10px] text-slate-500">75 pts</span>
                    </div>
                    <div className="text-[10px] opacity-75">Ajuste de rezago</div>
                  </button>
                </div>
              </div>

              {/* Inadequate Methods */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                  Series Estacionarias & Estacionales (Desaconsejados para esta encuesta):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                  <button
                    onClick={() => setSelectedMethodId('stationary_sma')}
                    className={`p-2 rounded-lg border text-left text-[11px] transition cursor-pointer ${
                      selectedMethodId === 'stationary_sma'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div>Promedio Móvil Simple (38 pts)</div>
                    <div className="text-[9px] text-amber-700">Subestima crecimiento</div>
                  </button>

                  <button
                    onClick={() => setSelectedMethodId('stationary_ses')}
                    className={`p-2 rounded-lg border text-left text-[11px] transition cursor-pointer ${
                      selectedMethodId === 'stationary_ses'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div>Suavización Simple (45 pts)</div>
                    <div className="text-[9px] text-amber-700">Asume media plana</div>
                  </button>

                  <button
                    onClick={() => setSelectedMethodId('seasonal_winter')}
                    className={`p-2 rounded-lg border text-left text-[11px] transition cursor-pointer ${
                      selectedMethodId === 'seasonal_winter'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div>Método de Winter (50 pts)</div>
                    <div className="text-[9px] text-slate-500">Sin ciclos trimestrales</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETALLE DEL MÉTODO SELECCIONADO Y PROYECCIÓN CALCULADA */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                {activeMethod.categoryLabel}
              </span>
              {activeMethod.isBestFit && (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Award className="w-3 h-3" /> Método Más Acertado
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {activeMethod.name} ({activeMethod.subType})
            </h3>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Puntaje de Idoneidad</span>
            <div className="text-2xl font-bold font-mono text-blue-900">
              {activeMethod.suitabilityScore} <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>
        </div>

        {/* Math & Justification Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <strong className="text-slate-900 block font-semibold">Formulación Matemática / Enfoque:</strong>
            <code className="block p-2 rounded bg-slate-900 text-sky-300 font-mono text-xs overflow-x-auto">
              {activeMethod.formula}
            </code>
            <p className="text-slate-600 mt-2">
              <strong>Requisitos de datos:</strong> {activeMethod.dataRequirements}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <strong className="text-slate-900 block font-semibold">Evaluación con Respecto a la Entrevista:</strong>
            <p className="text-slate-700 leading-relaxed text-justify">
              {activeMethod.whyFitsOrFails}
            </p>
            {activeMethod.metrics && (
              <div className="pt-2 border-t border-slate-200 text-slate-600 font-mono text-[11px]">
                {activeMethod.metrics.rSquared && <span>R² = {activeMethod.metrics.rSquared} | </span>}
                {activeMethod.metrics.alpha && <span>α = {activeMethod.metrics.alpha} | </span>}
                {activeMethod.metrics.beta && <span>β = {activeMethod.metrics.beta} | </span>}
                {activeMethod.metrics.notes}
              </div>
            )}
          </div>
        </div>

        {/* Calculated Projection Results for This Method */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
            <span>Resultados de Demanda Proyectada a 3 Años con este Método:</span>
            <span className="text-slate-500 font-normal">Población Objetivo: {tamPopulation.toLocaleString()} ({samPercent}% accesible)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-center space-y-1">
              <span className="text-[11px] font-bold text-blue-800 uppercase">Año 1 (Inicio)</span>
              <div className="text-2xl font-extrabold text-blue-900 font-mono">
                {activeMethod.projections.year1.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">Usuarios activos estimados</span>
            </div>

            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 text-center space-y-1">
              <span className="text-[11px] font-bold text-sky-800 uppercase">Año 2 (+12 meses)</span>
              <div className="text-2xl font-extrabold text-sky-900 font-mono">
                {activeMethod.projections.year2.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">
                +{Math.round(((activeMethod.projections.year2 - activeMethod.projections.year1) / activeMethod.projections.year1) * 100)}% de crecimiento
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">Año 3 (+24 meses)</span>
              <div className="text-2xl font-extrabold text-emerald-900 font-mono">
                {activeMethod.projections.year3.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">Consolidación de demanda</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA COMPARATIVA COMPLETA DE TODOS LOS 10 MÉTODOS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Tabla Comparativa de los 10 Métodos de Pronóstico
            </h3>
            <p className="text-xs text-slate-500">
              Ranking de precisión y aplicabilidad con base en la entrevista de Google Forms
            </p>
          </div>
          <span className="text-xs px-2 py-1 rounded bg-slate-100 font-mono text-slate-700">
            Ordenado por Idoneidad
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                <th className="py-2.5 px-3 font-bold border border-slate-200 w-12 text-center">Rank</th>
                <th className="py-2.5 px-3 font-bold border border-slate-200">Método de Pronóstico</th>
                <th className="py-2.5 px-3 font-bold border border-slate-200">Categoría (Diagrama)</th>
                <th className="py-2.5 px-3 font-bold text-center border border-slate-200 font-mono">Idoneidad</th>
                <th className="py-2.5 px-3 font-bold text-right border border-slate-200 font-mono">Año 1</th>
                <th className="py-2.5 px-3 font-bold text-right border border-slate-200 font-mono">Año 2</th>
                <th className="py-2.5 px-3 font-bold text-right border border-slate-200 font-mono">Año 3</th>
                <th className="py-2.5 px-3 font-bold border border-slate-200 text-center">Diagnóstico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {methods.map((m, idx) => {
                const isSelected = m.id === selectedMethodId;
                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedMethodId(m.id)}
                    className={`cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-50/70 font-semibold'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2 px-3 text-center font-mono border border-slate-200">
                      #{idx + 1}
                    </td>
                    <td className="py-2 px-3 text-slate-900 border border-slate-200 flex items-center justify-between">
                      <span>{m.name}</span>
                      {m.isBestFit && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded ml-2">
                          Mejor Ajuste
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-slate-600 border border-slate-200">
                      {m.categoryLabel}
                    </td>
                    <td className="py-2 px-3 text-center font-mono font-bold border border-slate-200">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          m.suitabilityScore >= 90
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.suitabilityScore >= 75
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {m.suitabilityScore}%
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono border border-slate-200 text-slate-700">
                      {m.projections.year1.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-mono border border-slate-200 text-slate-700">
                      {m.projections.year2.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold border border-slate-200 text-blue-900">
                      {m.projections.year3.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-center border border-slate-200">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          m.suitabilityScore >= 90
                            ? 'text-emerald-700 bg-emerald-50'
                            : m.suitabilityScore >= 70
                            ? 'text-blue-700 bg-blue-50'
                            : 'text-rose-700 bg-rose-50'
                        }`}
                      >
                        {m.suitabilityScore >= 90 ? 'Altamente Recomendado' : m.suitabilityScore >= 70 ? 'Viable' : 'Inadecuado'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
