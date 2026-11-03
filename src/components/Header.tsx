import React from 'react';
import { 
  BarChart3, 
  FileSpreadsheet, 
  TrendingUp, 
  Table2, 
  PieChart, 
  FileText, 
  UploadCloud, 
  Sparkles,
  Printer,
  RotateCcw,
  BookOpen
} from 'lucide-react';

export type NavTab = 
  | 'inicio' 
  | 'cargar-datos' 
  | 'tabulacion' 
  | 'graficos' 
  | 'analisis-demanda' 
  | 'proyecciones' 
  | 'informe-final';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  datasetName: string;
  totalRecords: number;
  onOpenAI: () => void;
  onResetData: () => void;
  onExportExcel: () => void;
  onOpenManual: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  datasetName,
  totalRecords,
  onOpenAI,
  onResetData,
  onExportExcel,
  onOpenManual,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'inicio', label: 'Inicio', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'cargar-datos', label: 'Cargar datos', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'tabulacion', label: 'Tabulación', icon: <Table2 className="w-4 h-4" /> },
    { id: 'graficos', label: 'Gráficos', icon: <PieChart className="w-4 h-4" /> },
    { id: 'analisis-demanda', label: 'Análisis de demanda', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'proyecciones', label: 'Proyecciones', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'informe-final', label: 'Informe final', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-sky-600 to-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                  Sistema Inteligente de Análisis de la Demanda
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-sky-950 text-sky-400 border border-sky-800">
                  Google Forms Analytics
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Procesamiento estadístico, proyecciones econométricas e informe académico
              </p>
            </div>
          </div>

          {/* Quick Action Badges & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sample Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300">Muestra Activa:</span>
              <strong className="text-white font-mono">{totalRecords} participantes</strong>
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAI}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="Generar análisis inteligente con IA"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-200" />
              <span className="hidden sm:inline">Análisis IA</span>
            </button>

            {/* Manual Button */}
            <button
              onClick={onOpenManual}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white text-xs font-medium border border-slate-700 transition cursor-pointer"
              title="Ver Manual de Usuario (Instructor, Aprendiz, Coordinador)"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Manual</span>
            </button>

            {/* Export Excel Button */}
            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 transition cursor-pointer"
              title="Descargar tabulaciones en Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Exportar Excel</span>
            </button>

            {/* Print / PDF Button */}
            <button
              onClick={() => {
                setActiveTab('informe-final');
                setTimeout(() => window.print(), 300);
              }}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition cursor-pointer"
              title="Imprimir o Guardar como PDF"
            >
              <Printer className="w-4 h-4 text-slate-300" />
            </button>

            {/* Reset data */}
            <button
              onClick={onResetData}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-300 text-xs font-medium border border-slate-700 transition cursor-pointer"
              title="Recargar encuesta adjunta original"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-950/60 border-t border-slate-800 px-4 sm:px-6 lg:px-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-2 py-1.5 min-w-max">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
