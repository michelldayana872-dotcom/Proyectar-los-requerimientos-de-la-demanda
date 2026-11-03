import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  GraduationCap, 
  UserCheck, 
  Briefcase, 
  CheckCircle2, 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Layers, 
  Award, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  const [activeRole, setActiveRole] = useState<'instructor' | 'aprendiz' | 'coordinador' | 'todos'>('todos');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyManual = () => {
    // Read from the preloaded text or write to clipboard
    const textToCopy = `MANUAL DE USUARIO Y GUÍA PEDAGÓGICA - SISTEMA INTELIGENTE DE ANÁLISIS DE LA DEMANDA
Roles incluidos: Instructor, Aprendiz y Coordinador Académico.
Ver archivo /manual o /manual.md en la raíz del proyecto para la versión completa en texto plano y Markdown.`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center shadow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  Manual de Usuario y Guía Pedagógica
                </h3>
                <span className="text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded">
                  /manual.md en raíz
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Guía de uso para Instructor, Aprendiz y Coordinador Académico
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveRole('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeRole === 'todos'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Visión General</span>
          </button>

          <button
            onClick={() => setActiveRole('instructor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeRole === 'instructor'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
            <span>Rol: Instructor</span>
          </button>

          <button
            onClick={() => setActiveRole('aprendiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeRole === 'aprendiz'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Rol: Aprendiz</span>
          </button>

          <button
            onClick={() => setActiveRole('coordinador')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeRole === 'coordinador'
                ? 'bg-indigo-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
            <span>Rol: Coordinador Académico</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm text-slate-800 leading-relaxed">
          {/* General View */}
          {(activeRole === 'todos' || activeRole === 'instructor') && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                  <GraduationCap className="w-5 h-5 text-blue-700" />
                  <span>GUÍA PARA EL ROL DE INSTRUCTOR (Facilitador Metodológico)</span>
                </div>
                <p className="text-slate-700 text-xs text-justify">
                  El instructor lidera la enseñanza del análisis cuantitativo y cualitativo de la demanda, supervisa la calidad muestral y valida la aplicación de los métodos de pronóstico.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-blue-100 space-y-1">
                    <strong className="text-blue-900 block font-semibold">1. Validación de Instrumentos:</strong>
                    Enseñar a exportar el archivo CSV desde Google Forms sin alterar los encabezados originales.
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-blue-100 space-y-1">
                    <strong className="text-blue-900 block font-semibold">2. Control de Sumatorias Matemáticas:</strong>
                    Verificar que la frecuencia relativa sume $\sum h_i = 1.0000$ y el porcentaje sume $100.0\%$.
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-blue-100 space-y-1">
                    <strong className="text-blue-900 block font-semibold">3. Didáctica de Métodos de Pronóstico:</strong>
                    Explicar por qué la <strong>Regresión Múltiple</strong> es el método más acertado frente al error del promedio simple.
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-blue-100 space-y-1">
                    <strong className="text-blue-900 block font-semibold">4. Rúbrica de Evaluación:</strong>
                    Exigir la presencia obligatoria de la <em>Advertencia Metodológica</em> en el informe final de los aprendices.
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeRole === 'todos' || activeRole === 'aprendiz') && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                  <UserCheck className="w-5 h-5 text-emerald-700" />
                  <span>GUÍA PARA EL ROL DE APRENDIZ (Investigador de Mercado)</span>
                </div>
                <p className="text-slate-700 text-xs text-justify">
                  El aprendiz explora los datos de la encuesta, comprende las necesidades del usuario y genera su informe académico formal sin errores de cálculo manual.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-100 space-y-1">
                    <strong className="text-emerald-900 block font-semibold">1. Exploración del Embudo de Demanda:</strong>
                    Comprender la diferencia entre conocer una herramienta (96.3%) y usarla a diario (37.0%).
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-100 space-y-1">
                    <strong className="text-emerald-900 block font-semibold">2. Análisis de Respuestas Abiertas:</strong>
                    Identificar las citas textuales clave sobre ahorro de tiempo de investigación y preparación de guías.
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-100 space-y-1">
                    <strong className="text-emerald-900 block font-semibold">3. Simulación de Mercado (TAM / SAM / SOM):</strong>
                    Mover los sliders para proyectar la demanda en una sede real (ej. 3,000 aprendices).
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-100 space-y-1">
                    <strong className="text-emerald-900 block font-semibold">4. Entrega y Sustentación:</strong>
                    Usar el botón «Imprimir / Guardar como PDF» o «Copiar en Markdown» para su informe de proyecto.
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeRole === 'todos' || activeRole === 'coordinador') && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-indigo-900 text-sm">
                  <Briefcase className="w-5 h-5 text-indigo-700" />
                  <span>GUÍA PARA EL ROL DE COORDINADOR ACADÉMICO (Supervisión Estratégica)</span>
                </div>
                <p className="text-slate-700 text-xs text-justify">
                  El coordinador toma decisiones de dotación institucional, evalúa la pertinencia tecnológica y lidera las políticas curriculares sobre ética y autenticidad.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-indigo-100 space-y-1">
                    <strong className="text-indigo-900 block font-semibold">1. Diagnóstico Institucional:</strong>
                    Evaluar el Net Demand Score (76.8 pts) y la tasa de adopción para justificar recursos o licencias.
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-indigo-100 space-y-1">
                    <strong className="text-indigo-900 block font-semibold">2. Mitigación de Fricciones Éticas:</strong>
                    El 85.2% de alerta exige protocolos institucionales contra el plagio y fomento del pensamiento crítico.
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-indigo-100 space-y-1">
                    <strong className="text-indigo-900 block font-semibold">3. Auditoría de Proyectos Formativos:</strong>
                    Verificar que las proyecciones estudiantiles cuenten con base matemática y distinción entre muestra y mercado.
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-indigo-100 space-y-1">
                    <strong className="text-indigo-900 block font-semibold">4. Archivo y Trazabilidad:</strong>
                    Descargar el libro de Excel consolidado con el botón «Exportar Todas las Tablas a Excel» para el repositorio.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Summary of the 10 Forecasting Methods */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Resumen de Métodos de Pronóstico Evaluados:
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-200 font-bold text-slate-800">
                  <tr>
                    <th className="p-2 border border-slate-300">Método</th>
                    <th className="p-2 border border-slate-300">Tipo</th>
                    <th className="p-2 border border-slate-300 text-center">Score</th>
                    <th className="p-2 border border-slate-300">Veredicto para la Encuesta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-emerald-50 font-semibold">
                    <td className="p-2 border border-slate-200">Regresión Lineal Múltiple</td>
                    <td className="p-2 border border-slate-200">Causal</td>
                    <td className="p-2 border border-slate-200 text-center font-mono text-emerald-800">98%</td>
                    <td className="p-2 border border-slate-200">El más acertado para datos de corte transversal con múltiples atributos.</td>
                  </tr>
                  <tr className="bg-blue-50 font-semibold">
                    <td className="p-2 border border-slate-200">Método de Holt (Suav. Doble)</td>
                    <td className="p-2 border border-slate-200">Series Tendencia</td>
                    <td className="p-2 border border-slate-200 text-center font-mono text-blue-800">94%</td>
                    <td className="p-2 border border-slate-200">El más acertado para proyectar el horizonte temporal a 3 años.</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-200">Promedio Móvil Simple</td>
                    <td className="p-2 border border-slate-200">Series Estacionarias</td>
                    <td className="p-2 border border-slate-200 text-center font-mono text-rose-800">38%</td>
                    <td className="p-2 border border-slate-200">Inadecuado: Asume serie plana e ignora la tendencia exponencial de IA.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <span>Ubicación física: <code>/manual</code> y <code>/manual.md</code> en el directorio raíz.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium cursor-pointer"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
