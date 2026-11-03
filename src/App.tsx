import React, { useState, useMemo } from 'react';
import { Header, NavTab } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { UploadView } from './components/UploadView';
import { TabulationView } from './components/TabulationView';
import { ChartsView } from './components/ChartsView';
import { DemandAnalysisView } from './components/DemandAnalysisView';
import { ProjectionsView } from './components/ProjectionsView';
import { AcademicReportView } from './components/AcademicReportView';
import { AIAssistantModal } from './components/AIAssistantModal';
import { ManualModal } from './components/ManualModal';

import { ATTACHED_SURVEY_CSV } from './data/surveyDataset';
import { 
  parseCSVString, 
  calculateDemandIndicators, 
  downloadAllTablesExcel 
} from './utils/statisticalEngine';
import { SurveyDataset, ProcessedQuestion } from './types/demand';

export default function App() {
  // Initialize with real attached survey responses
  const [dataset, setDataset] = useState<SurveyDataset>(() => {
    return parseCSVString(ATTACHED_SURVEY_CSV, 'Untitled_form__Responses__b74c237b.csv');
  });

  const [activeTab, setActiveTab] = useState<NavTab>('inicio');
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isManualOpen, setIsManualOpen] = useState<boolean>(false);
  const [aiTargetQuestion, setAiTargetQuestion] = useState<ProcessedQuestion | null>(null);

  // Dynamic indicators recalculation
  const indicators = useMemo(() => {
    return calculateDemandIndicators(dataset);
  }, [dataset]);

  const handleResetData = () => {
    const original = parseCSVString(ATTACHED_SURVEY_CSV, 'Untitled_form__Responses__b74c237b.csv');
    setDataset(original);
  };

  const handleOpenGlobalAI = () => {
    setAiTargetQuestion(null);
    setIsAIModalOpen(true);
  };

  const handleOpenQuestionAI = (question: ProcessedQuestion) => {
    setAiTargetQuestion(question);
    setIsAIModalOpen(true);
  };

  const handleExportExcel = () => {
    downloadAllTablesExcel(dataset);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        datasetName={dataset.fileName}
        totalRecords={dataset.totalRecords}
        onOpenAI={handleOpenGlobalAI}
        onResetData={handleResetData}
        onExportExcel={handleExportExcel}
        onOpenManual={() => setIsManualOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'inicio' && (
          <DashboardView
            indicators={indicators}
            dataset={dataset}
            setActiveTab={setActiveTab}
            onOpenAI={handleOpenGlobalAI}
          />
        )}

        {activeTab === 'cargar-datos' && (
          <UploadView
            dataset={dataset}
            onDatasetLoaded={newDs => {
              setDataset(newDs);
            }}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tabulacion' && (
          <TabulationView
            dataset={dataset}
            onOpenAIQuestion={handleOpenQuestionAI}
          />
        )}

        {activeTab === 'graficos' && (
          <ChartsView
            dataset={dataset}
            onOpenAIQuestion={handleOpenQuestionAI}
          />
        )}

        {activeTab === 'analisis-demanda' && (
          <DemandAnalysisView
            dataset={dataset}
            indicators={indicators}
            onOpenAI={handleOpenGlobalAI}
          />
        )}

        {activeTab === 'proyecciones' && (
          <ProjectionsView indicators={indicators} dataset={dataset} />
        )}

        {activeTab === 'informe-final' && (
          <AcademicReportView
            dataset={dataset}
            indicators={indicators}
            onOpenAI={handleOpenGlobalAI}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">
              Sistema Inteligente de Análisis de la Demanda
            </span>
            <span>·</span>
            <span>Estudio de Mercado & Google Forms Analytics</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Muestra activa: {dataset.totalRecords} participantes</span>
            <span>·</span>
            <button
              onClick={() => setActiveTab('informe-final')}
              className="text-sky-400 hover:text-sky-300 font-medium cursor-pointer"
            >
              Generar Informe
            </button>
            <span>·</span>
            <button
              onClick={handleExportExcel}
              className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
            >
              Descargar Excel
            </button>
            <span>·</span>
            <button
              onClick={() => setIsManualOpen(true)}
              className="text-sky-300 hover:text-white font-medium cursor-pointer"
            >
              Manual de Usuario
            </button>
          </div>
        </div>
      </footer>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        dataset={dataset}
        selectedQuestion={aiTargetQuestion}
      />

      {/* Role-based Manual Modal */}
      <ManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />
    </div>
  );
}
