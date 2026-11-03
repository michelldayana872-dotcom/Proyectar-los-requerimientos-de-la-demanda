import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Award, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Target,
  Layers,
  BrainCircuit,
  ArrowUpRight
} from 'lucide-react';
import { DemandIndicators, SurveyDataset } from '../types/demand';
import { SimpleBarChart, SimpleDoughnutChart } from './StatCharts';
import { NavTab } from './Header';

interface DashboardViewProps {
  indicators: DemandIndicators;
  dataset: SurveyDataset;
  setActiveTab: (tab: NavTab) => void;
  onOpenAI: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  indicators,
  dataset,
  setActiveTab,
  onOpenAI,
}) => {
  const p1 = dataset.questions.find(q => q.id === 'p1_herramientas');
  const p2 = dataset.questions.find(q => q.id === 'p2_frecuencia');
  const p4 = dataset.questions.find(q => q.id === 'p4_si_desaparece');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-4">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Diagnóstico Integral de Demanda Tecnológica</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Sistema Inteligente de Análisis de la Demanda
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Transformación analítica, estadística y econométrica de encuestas de Google Forms.
            Procesando actualmente la muestra real de <strong className="text-white">{indicators.totalParticipants} entrevistas</strong> sobre herramientas de Inteligencia Artificial, frecuencias de uso, elasticidad de sustitución y factores de fricción ética.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('tabulacion')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <span>Ver Tabulaciones Estadísticas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('proyecciones')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs sm:text-sm font-medium border border-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              <Target className="w-4 h-4 text-sky-400" />
              <span>Modelar Proyecciones TAM/SAM/SOM</span>
            </button>
            <button
              onClick={onOpenAI}
              className="px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-lg text-xs sm:text-sm font-medium border border-sky-500/40 flex items-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-sky-300" />
              <span>Generar Síntesis con IA</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1: Muestra */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Muestra Procesada
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mb-1">
            {indicators.totalParticipants}
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% registros válidos sin omisiones</span>
          </p>
        </div>

        {/* KPI 2: Tasa de Adopción */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tasa de Adopción
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mb-1">
            {indicators.adoptionRate}%
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1">
            <div className="bg-sky-600 h-full rounded-full" style={{ width: `${indicators.adoptionRate}%` }} />
          </div>
          <p className="text-xs text-slate-500">
            {indicators.dailyUsageRate}% a diario · {indicators.occasionalUsageRate}% ocasional
          </p>
        </div>

        {/* KPI 3: Grado de Necesidad */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Necesidad Crítica
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mb-1">
            {indicators.highNecessityRate}%
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${indicators.highNecessityRate}%` }} />
          </div>
          <p className="text-xs text-slate-500">
            Consideran la IA imprescindible o muy necesaria
          </p>
        </div>

        {/* KPI 4: Fricción Ética */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fricción Ética Percibida
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mb-1">
            {indicators.ethicalConcernRate}%
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1">
            <div className="bg-amber-600 h-full rounded-full" style={{ width: `${indicators.ethicalConcernRate}%` }} />
          </div>
          <p className="text-xs text-slate-500">
            Alerta por dependencia, plagio o falta de análisis
          </p>
        </div>
      </div>

      {/* Main Charts & Funnel Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top of Mind Demand Ranking */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Preferencia de Mercado y Ecosistema de Herramientas
              </h2>
              <p className="text-xs text-slate-500">
                Frecuencia de mención espontánea y asistida en la muestra (Pregunta 1)
              </p>
            </div>
            <button
              onClick={() => setActiveTab('graficos')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Gráficos</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {p1 && (
            <div className="pt-2">
              <SimpleBarChart data={p1.table.slice(0, 6)} horizontal={true} />
            </div>
          )}

          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80 text-xs text-slate-700 space-y-1">
            <strong className="text-slate-900 font-semibold block">Diagnóstico de Concentración de Demanda:</strong>
            <p>
              Existe un duopolio hegemónico: <strong className="text-blue-800">ChatGPT (OpenAI)</strong> con 92.6% y <strong className="text-sky-800">Google Gemini</strong> con 85.2%. Las soluciones especializadas (diseño visual, código, traductores) representan demandas secundarias complementarias.
            </p>
          </div>
        </div>

        {/* Right Column: Demand Adoption Funnel */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Embudo de Madurez de la Demanda
            </h2>
            <p className="text-xs text-slate-500">
              Niveles de conversión de los encuestados
            </p>
          </div>

          <div className="space-y-3">
            {/* Stage 1 */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center mb-1 text-xs font-medium">
                <span className="text-slate-700">1. Conocimiento & Conciencia (Awareness)</span>
                <span className="font-mono font-bold text-slate-900">100.0%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: '100%' }} />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Todos conocen al menos 1 herramienta</span>
            </div>

            {/* Stage 2 */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center mb-1 text-xs font-medium">
                <span className="text-slate-700">2. Demanda Activa Total (Uso Ocasional + Diario)</span>
                <span className="font-mono font-bold text-slate-900">{indicators.adoptionRate}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full" style={{ width: `${indicators.adoptionRate}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">26 de 27 encuestados activos</span>
            </div>

            {/* Stage 3 */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center mb-1 text-xs font-medium">
                <span className="text-slate-700">3. Demanda Intensiva Diaria (Heavy Users)</span>
                <span className="font-mono font-bold text-slate-900">{indicators.dailyUsageRate}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full" style={{ width: `${indicators.dailyUsageRate}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Integración continua en clases y trabajo</span>
            </div>

            {/* Stage 4 */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center mb-1 text-xs font-medium">
                <span className="text-slate-700">4. Dependencia Crítica (Impacto Severo)</span>
                <span className="font-mono font-bold text-slate-900">{indicators.substitutionImpactRate}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: `${indicators.substitutionImpactRate}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Tardaría el doble de tiempo sin la IA</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-900">
            <span className="font-semibold block mb-0.5">Índice Sintético de Demanda (NDS):</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-blue-900">{indicators.netDemandScore}</span>
              <span className="text-slate-500">/ 100 puntos (Demanda Fuerte)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h3 className="font-bold text-sm text-slate-900">Motivador de Demanda</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            El valor principal que impulsa el consumo no es la novedad tecnológica, sino la <strong className="text-slate-800">economía del tiempo</strong>: reducción de plazos de investigación, planeación curricular y síntesis de fuentes complejas.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h3 className="font-bold text-sm text-slate-900">Elasticidad de Sustitución</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Un 74.1% percibe que retornar a bibliotecas físicas o libros manuales causaría pérdida crítica de competitividad. El costo de oportunidad de abandonar la IA es elevado en labores pedagógicas y analíticas.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <h3 className="font-bold text-sm text-slate-900">Fricción de Mercado</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            El 85.2% alerta sobre riesgos éticos: atrofia del pensamiento crítico por copia pasiva en entornos escolares y clonación de identidad. Exige herramientas con trazabilidad, verificación de datos y enfoque pedagógico.
          </p>
        </div>
      </div>
    </div>
  );
};
