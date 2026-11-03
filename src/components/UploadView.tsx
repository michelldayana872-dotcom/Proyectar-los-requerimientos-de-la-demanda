import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Sparkles, 
  Table, 
  RotateCcw,
  Download,
  Info
} from 'lucide-react';
import { SurveyDataset } from '../types/demand';
import { parseCSVString, parseExcelFile } from '../utils/statisticalEngine';
import { ATTACHED_SURVEY_CSV } from '../data/surveyDataset';
import { NavTab } from './Header';

interface UploadViewProps {
  dataset: SurveyDataset;
  onDatasetLoaded: (newDataset: SurveyDataset) => void;
  setActiveTab: (tab: NavTab) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  dataset,
  onDatasetLoaded,
  setActiveTab,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const name = file.name.toLowerCase();
    try {
      if (name.endsWith('.csv') || file.type === 'text/csv') {
        const text = await file.text();
        const newDataset = parseCSVString(text, file.name);
        onDatasetLoaded(newDataset);
        setSuccessMsg(`¡Archivo CSV procesado con éxito! Se cargaron ${newDataset.totalRecords} respuestas.`);
      } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        const newDataset = await parseExcelFile(file);
        onDatasetLoaded(newDataset);
        setSuccessMsg(`¡Archivo Excel procesado con éxito! Se cargaron ${newDataset.totalRecords} respuestas.`);
      } else {
        // Attempt CSV parse anyway
        const text = await file.text();
        const newDataset = parseCSVString(text, file.name);
        onDatasetLoaded(newDataset);
        setSuccessMsg(`¡Archivo procesado como texto delimitado con éxito! (${newDataset.totalRecords} registros).`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar el archivo. Verifique el formato exportado de Google Forms.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleResetToAttachedData = () => {
    try {
      const original = parseCSVString(ATTACHED_SURVEY_CSV, 'Untitled_form__Responses__b74c237b.csv');
      onDatasetLoaded(original);
      setSuccessMsg('Se ha restaurado la encuesta real adjunta de 27 participantes con éxito.');
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg('Error al recargar datos adjuntos: ' + err.message);
    }
  };

  const filteredRows = dataset.rawRows.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Importación y Gestión de Respuestas de Google Forms
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Cargue archivos exportados en formato <span className="font-semibold text-slate-800">CSV</span> o <span className="font-semibold text-slate-800">Excel (.xlsx)</span> para procesamiento automático de tabulaciones y análisis de demanda.
          </p>
        </div>

        <button
          onClick={handleResetToAttachedData}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition flex-shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-sky-400" />
          <span>Cargar Encuesta Adjunta (27 respuestas)</span>
        </button>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setActiveTab('tabulacion')}
            className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
          >
            Ir a Tabulación →
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        onDragOver={e => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-slate-300 hover:border-slate-400 bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv, .xlsx, .xls, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="hidden"
          onChange={e => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-2">
          Arrastra tu archivo CSV o Excel aquí
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          Compatible con archivos generados directamente desde el botón "Descargar respuestas (.csv)" de Google Forms o exportados desde Google Sheets.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold shadow-md transition cursor-pointer"
          >
            Seleccionar archivo del dispositivo
          </button>
          <button
            onClick={handleResetToAttachedData}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition cursor-pointer"
          >
            Usar archivo actual del proyecto
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Archivos CSV UTF-8
          </span>
          <span className="flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-blue-500" /> Microsoft Excel (.xlsx)
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Detección de columnas
          </span>
        </div>
      </div>

      {/* Dataset Health and Column Mapping */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">
              Estado de la Muestra en Memoria
            </h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 font-mono text-slate-700">
            {dataset.fileName}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Total Registros</span>
            <strong className="text-base text-slate-900 font-mono">{dataset.totalRecords} filas</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Preguntas Tabuladas</span>
            <strong className="text-base text-slate-900 font-mono">{dataset.questions.length} dimensiones</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Columnas Detectadas</span>
            <strong className="text-base text-slate-900 font-mono">{dataset.columns.length} campos</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Último Procesamiento</span>
            <strong className="text-slate-900 font-medium block truncate">{dataset.loadedAt}</strong>
          </div>
        </div>
      </div>

      {/* Raw Data Preview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-3 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Table className="w-4 h-4 text-blue-600" />
              <span>Vista Previa de Respuestas Reales ({filteredRows.length} de {dataset.totalRecords})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Datos sin procesar tal como fueron ingresados por los encuestados
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar en respuestas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-96">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-white sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3 font-semibold border-b border-slate-800 w-12 text-center">#</th>
                {dataset.columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="py-2.5 px-3 font-semibold border-b border-slate-800 min-w-[200px]"
                    title={col}
                  >
                    <div className="line-clamp-2">{col}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-normal">
              {filteredRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-blue-50/40 transition">
                  <td className="py-2 px-3 text-center text-slate-400 font-mono bg-slate-50">
                    {rIdx + 1}
                  </td>
                  {dataset.columns.map((col, cIdx) => (
                    <td key={cIdx} className="py-2 px-3 text-slate-700 max-w-xs truncate" title={row[col]}>
                      {row[col] || <span className="text-slate-300 italic">Vacio</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
