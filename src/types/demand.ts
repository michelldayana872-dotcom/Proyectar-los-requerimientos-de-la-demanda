export interface TableRow {
  category: string;
  count: number; // fi (Frecuencia absoluta)
  relativeFreq: number; // hi (Frecuencia relativa)
  percentage: number; // % (Porcentaje)
  cumulativeFreq: number; // Fi (Frecuencia acumulada)
  cumulativePercent: number; // % Acumulado
}

export interface ThematicCluster {
  theme: string;
  count: number;
  percentage: number;
  sentiment: 'favorable' | 'moderado' | 'critico' | 'neutral';
  keywords: string[];
  sampleQuotes: string[];
}

export interface ProcessedQuestion {
  id: string;
  originalIndex: number;
  title: string;
  shortTitle: string;
  type: 'frequency' | 'tools_multi' | 'open_text' | 'yes_no' | 'general';
  validResponses: number;
  table: TableRow[];
  clusters?: ThematicCluster[];
  chartTypeDefault: 'bar' | 'pie' | 'doughnut' | 'horizontal_bar';
  interpretation: string;
  demandImplication: string;
}

export interface SurveyDataset {
  name: string;
  fileName: string;
  loadedAt: string;
  totalRecords: number;
  columns: string[];
  rawRows: Record<string, string>[];
  questions: ProcessedQuestion[];
}

export interface DemandIndicators {
  totalParticipants: number;
  dailyUsageRate: number; // % diario
  occasionalUsageRate: number; // % a veces
  adoptionRate: number; // % total que usa IA
  topTool: { name: string; percentage: number; mentions: number };
  secondTool: { name: string; percentage: number; mentions: number };
  highNecessityRate: number; // % considera muy necesario
  substitutionImpactRate: number; // % afectado negativamente si desaparece
  ethicalConcernRate: number; // % percibe uso irresponsable o excesivo
  netDemandScore: number; // Índice sintético de demanda 0-100
}

export interface ProjectionScenario {
  name: string;
  annualGrowth: number;
  marketShare: number;
  year1: number;
  year2: number;
  year3: number;
  description: string;
}

export interface DemandProjectionConfig {
  tamPopulation: number; // Mercado total disponible
  samSegmentPercent: number; // Segmento alcanzable %
  adoptionConversionRate: number; // Conversión esperada %
  currentSampleDemandRate: number; // Demanda observada en la encuesta
  scenarios: ProjectionScenario[];
}

/**
 * Image-based Forecast Taxonomies and Detailed Methods Evaluation
 */
export type ForecastCategory = 
  | 'cualitativos' 
  | 'series_estacionarias' 
  | 'series_tendencia' 
  | 'series_estacionales' 
  | 'modelos_causales';

export interface MethodForecastModel {
  id: string;
  name: string;
  category: ForecastCategory;
  categoryLabel: string;
  subType: string;
  suitabilityScore: number; // 0-100 rating based on the interview data structure
  verdictRank: number; // 1 = highest accuracy/fit
  isBestFit: boolean;
  formula: string;
  dataRequirements: string;
  whyFitsOrFails: string;
  projections: {
    year1: number;
    year2: number;
    year3: number;
  };
  metrics?: {
    rSquared?: number;
    alpha?: number;
    beta?: number;
    gamma?: number;
    slope?: number;
    intercept?: number;
    notes?: string;
  };
}
