import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Compass, 
  ShieldCheck, 
  Workflow, 
  Cpu, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { SurveyDataset, DemandIndicators } from '../types/demand';

interface DemandAnalysisViewProps {
  dataset: SurveyDataset;
  indicators: DemandIndicators;
  onOpenAI: () => void;
}

export const DemandAnalysisView: React.FC<DemandAnalysisViewProps> = ({
  dataset,
  indicators,
  onOpenAI,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Análisis Estratégico de la Demanda
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Caracterización de necesidades del mercado, segmentación de adoptantes, elasticidad de sustitución y factores de fricción ética.
          </p>
        </div>

        <button
          onClick={onOpenAI}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition flex-shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-sky-200" />
          <span>Generar Diagnóstico Econométrico con IA</span>
        </button>
      </div>

      {/* 1. Demand Segments (Customer Archetypes) */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>1. Segmentación de Usuarios y Arquetipos de Demanda</span>
            </h3>
            <p className="text-xs text-slate-500">
              Clasificación de los encuestados según intensidad de adopción y criticidad operativa
            </p>
          </div>
          <span className="text-xs font-mono bg-blue-50 text-blue-800 px-2 py-1 rounded font-semibold">
            N = {indicators.totalParticipants} usuarios
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Segment A */}
          <div className="p-5 rounded-xl border-2 border-blue-200 bg-blue-50/30 space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  Segmento Primario
                </span>
                <h4 className="font-bold text-base text-slate-900 mt-1">
                  Heavy Users / Profesionales Intensivos
                </h4>
              </div>
              <span className="text-2xl font-extrabold text-blue-900 font-mono">
                {indicators.dailyUsageRate}%
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Integran la IA cotidianamente en planeación curricular, estructuración de casos, redacción académica y verificación de código de programación.
            </p>

            <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-blue-200">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                <span>Elasticidad: <strong className="text-blue-900">Inelástica</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Disposición a Pagar: <strong className="text-slate-900">Media - Alta</strong></span>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                "Mis actividades operativas y de investigación previa tomarían el doble de tiempo sin IA."
              </p>
            </div>
          </div>

          {/* Segment B */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  Segmento Ocasional
                </span>
                <h4 className="font-bold text-base text-slate-900 mt-1">
                  Casual Adopters / Exploradores
                </h4>
              </div>
              <span className="text-2xl font-extrabold text-sky-800 font-mono">
                {indicators.occasionalUsageRate}%
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Utilizan la IA para resolver consultas puntuales, resolver dudas de estudio, diseñar presentaciones o editar fotos publicitarias cuando lo necesitan.
            </p>

            <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Elasticidad: <strong className="text-sky-900">Elástica (sensible a costo)</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-slate-500" />
                <span>Demanda Principal: <strong className="text-slate-900">Versiones Gratuitas</strong></span>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                "Es útil porque facilita tareas y ayuda a resolver dudas, pero puedo hacer cosas por mi cuenta."
              </p>
            </div>
          </div>

          {/* Segment C */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                  Segmento Marginal
                </span>
                <h4 className="font-bold text-base text-slate-900 mt-1">
                  Resistentes / Trabajo Físico
                </h4>
              </div>
              <span className="text-2xl font-extrabold text-slate-700 font-mono">
                3.7%
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Individuos cuyas labores operativas son prioritariamente físicas o que desconfían de la veracidad y prefieren métodos presenciales tradicionales.
            </p>

            <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />
                <span>Demanda: <strong className="text-slate-700">Inactiva o Nula</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-slate-400" />
                <span>Barrera: <strong className="text-slate-900">Baja afinidad digital</strong></span>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                "No la considero importante ya que todo mi trabajo requiere esfuerzo físico."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Needs Analysis & Value Proposition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>2. Necesidades Expresadas vs. Servicios Demandados</span>
            </h3>
            <p className="text-xs text-slate-500">
              Mapeo de dolor de los encuestados y funcionalidad requerida
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Compresión del Tiempo de Investigación</span>
                <span className="text-blue-600 font-mono">51.9% Demanda</span>
              </div>
              <p className="text-slate-600">
                Los usuarios no buscan que la IA reemplace su criterio, sino eliminar la lentitud de buscar en múltiples bibliotecas o libros físicos para estructurar borradores.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Tutoría Pedagógica y Resolución de Dudas Complejas</span>
                <span className="text-blue-600 font-mono">29.6% Demanda</span>
              </div>
              <p className="text-slate-600">
                Demanda de un "interlocutor disponible 24/7" para destrabar dudas técnicas o académicas difíciles de comprender en clases tradicionales.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Generación de Contenidos Visuales & Presentaciones</span>
                <span className="text-blue-600 font-mono">11.1% Demanda</span>
              </div>
              <p className="text-slate-600">
                Uso de herramientas como Gamma, Canva AI, CapCut para crear fondos publicitarios y diapositivas de exposición de alta calidad en minutos.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Verificación de Errores Técnicos y Código</span>
                <span className="text-blue-600 font-mono">7.4% Demanda</span>
              </div>
              <p className="text-slate-600">
                Auditoría de comandos de programación, corrección sintáctica y control de calidad en labores de ingeniería o desarrollo tecnológico.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Substitution Elasticity and Frictions */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>3. Elasticidad de Sustitutos y Factores de Fricción</span>
            </h3>
            <p className="text-xs text-slate-500">
              Resistencia al cambio y barreras éticas observadas en el entorno
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {/* Cost of opportunity */}
            <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200/80 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Costo de Sustitución Severo (74.1%)</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Si la IA dejara de existir, los métodos tradicionales sustitutos (libros físicos, bibliotecas, redacción manual) implicarían <strong className="text-amber-950 font-semibold">duplicar los tiempos de trabajo</strong>. Esto confirma que el producto tiene una utilidad neta percibida muy alta.
              </p>
            </div>

            {/* Ethical Friction */}
            <div className="p-3 rounded-lg bg-red-50/40 border border-red-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-red-900">
                <ShieldCheck className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>Fricción Ética y Riesgo de Dependencia (85.2%)</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Existe profunda preocupación de que los jóvenes y aprendices "se vuelvan flojos", dejen de pensar por sí mismos o copien tareas sin verificar. Adicionalmente se advierten riesgos emergentes de clonación de voz y chantaje digital.
              </p>
            </div>

            {/* Opportunity */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Oportunidad de Mercado: "IA Asistida Ética"</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Los encuestados reclaman herramientas que fomenten el pensamiento crítico: plataformas que verifiquen fuentes, detecten plagio y guíen el razonamiento en lugar de simplemente suministrar respuestas finales directas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SWOT Matrix of the Demand */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <span>4. Matriz Estratégica FODA / DAFO de la Demanda de IA</span>
          </h3>
          <p className="text-xs text-slate-500">
            Síntesis integral de fortalezas, oportunidades, debilidades y amenazas de la demanda observada
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Fortalezas */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" /> Fortalezas de la Demanda
            </h4>
            <ul className="list-disc list-inside text-emerald-950 space-y-1">
              <li>Adopción casi universal (96.3% de la muestra es usuaria).</li>
              <li>ChatGPT y Gemini disfrutan de altísimo posicionamiento y confianza operativa.</li>
              <li>Valor tangible demostrado en ahorro drástico de tiempo y agilidad.</li>
            </ul>
          </div>

          {/* Oportunidades */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
            <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> Oportunidades de Mercado
            </h4>
            <ul className="list-disc list-inside text-blue-950 space-y-1">
              <li>Desarrollo de soluciones de IA educativa con trazabilidad y citas académicas.</li>
              <li>Integración de suites especializadas (Canva, Gamma, traductores contextuales).</li>
              <li>Programas de formación en pensamiento crítico e ingeniería de prompts ética.</li>
            </ul>
          </div>

          {/* Debilidades */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600" /> Debilidades & Fricciones
            </h4>
            <ul className="list-disc list-inside text-amber-950 space-y-1">
              <li>El 59.3% de los usuarios tiene un uso esporádico ("a veces"), no consolidado.</li>
              <li>Baja disposición a pagar suscripciones premium individuales.</li>
              <li>Falta de validación crítica: tendencia a aceptar respuestas falsas o sesgadas.</li>
            </ul>
          </div>

          {/* Amenazas */}
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
            <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600" /> Amenazas del Entorno
            </h4>
            <ul className="list-disc list-inside text-rose-950 space-y-1">
              <li>Riesgo de prohibición o restricciones severas en colegios y universidades.</li>
              <li>Uso fraudulento en clonación de imágenes, voces y estafas digitales.</li>
              <li>Atrofia cognitiva en jóvenes por sustitución del esfuerzo analítico formativo.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
