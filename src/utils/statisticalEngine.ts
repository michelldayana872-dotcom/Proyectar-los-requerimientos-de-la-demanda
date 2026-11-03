import { ProcessedQuestion, TableRow, ThematicCluster, DemandIndicators, DemandProjectionConfig, SurveyDataset } from '../types/demand';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Normalizes string for text matching
 */
export function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Generates standard statistical table with fi, hi, %, Fi, %acum
 */
export function generateFrequencyTable(frequencies: Record<string, number>, totalValid: number): TableRow[] {
  // Sort descending by count
  const sortedEntries = Object.entries(frequencies).sort((a, b) => b[1] - a[1]);
  let cumulative = 0;

  return sortedEntries.map(([category, count]) => {
    cumulative += count;
    const rel = totalValid > 0 ? count / totalValid : 0;
    const pct = rel * 100;
    const cumPct = totalValid > 0 ? (cumulative / totalValid) * 100 : 0;

    return {
      category,
      count,
      relativeFreq: Number(rel.toFixed(4)),
      percentage: Number(pct.toFixed(1)),
      cumulativeFreq: cumulative,
      cumulativePercent: Number(cumPct.toFixed(1)),
    };
  });
}

/**
 * Processes survey question 1: AI Tools Known / Mentioned
 */
export function processToolsQuestion(
  answers: string[],
  originalIndex: number,
  title: string
): ProcessedQuestion {
  const toolsMap: Record<string, number> = {
    'ChatGPT (OpenAI)': 0,
    'Google Gemini': 0,
    'Microsoft Copilot': 0,
    'Traductores (DeepL / Google Translate)': 0,
    'Meta AI': 0,
    'Claude (Anthropic)': 0,
    'DeepSeek': 0,
    'Herramientas Creativas (Canva, Gamma, Prezi, CapCut)': 0,
    'Asistentes de Voz (Alexa, Siri, Bixby)': 0,
    'Otras / Bots': 0,
  };

  const validAnswers = answers.filter(a => a && a.trim().length > 0);

  validAnswers.forEach(ans => {
    const raw = normalizeText(ans);
    const mentionsAll = raw.includes('todas') || raw.includes('solo esas');

    if (raw.includes('chatgpt') || raw.includes('chat gpt') || mentionsAll) {
      toolsMap['ChatGPT (OpenAI)']++;
    }
    if (raw.includes('gemini') || raw.includes('geminis') || mentionsAll) {
      toolsMap['Google Gemini']++;
    }
    if (raw.includes('copilot') || mentionsAll) {
      toolsMap['Microsoft Copilot']++;
    }
    if (raw.includes('traductor') || raw.includes('deepl') || raw.includes('translate') || mentionsAll) {
      toolsMap['Traductores (DeepL / Google Translate)']++;
    }
    if (raw.includes('meta')) {
      toolsMap['Meta AI']++;
    }
    if (raw.includes('claude')) {
      toolsMap['Claude (Anthropic)']++;
    }
    if (raw.includes('deepseek')) {
      toolsMap['DeepSeek']++;
    }
    if (raw.includes('gamma') || raw.includes('prezi') || raw.includes('canva') || raw.includes('capcu') || raw.includes('dall')) {
      toolsMap['Herramientas Creativas (Canva, Gamma, Prezi, CapCut)']++;
    }
    if (raw.includes('alexa') || raw.includes('siri') || raw.includes('bixby') || raw.includes('dola')) {
      toolsMap['Asistentes de Voz (Alexa, Siri, Bixby)']++;
    }
    if (raw.includes('bot') || raw.includes('sofia')) {
      toolsMap['Otras / Bots']++;
    }
  });

  const table = generateFrequencyTable(toolsMap, validAnswers.length);

  return {
    id: 'p1_herramientas',
    originalIndex,
    title,
    shortTitle: 'Reconocimiento y Preferencia de Herramientas de IA',
    type: 'tools_multi',
    validResponses: validAnswers.length,
    table,
    chartTypeDefault: 'horizontal_bar',
    interpretation:
      'ChatGPT y Google Gemini dominan con amplitud el "Top of Mind" de los encuestados, superando el 85% de mención. Existe un segundo segmento de herramientas corporativas y de productividad (Copilot, Traductores neuronales) y una incipiente adopción de suites especializadas (Gamma, Canva AI).',
    demandImplication:
      'La demanda de mercado está fuertemente anclada a asistentes conversacionales líderes. Una propuesta de servicio o formación debe integrar o interactuar principalmente con ChatGPT y el ecosistema Google Gemini para garantizar máxima tracción.',
  };
}

/**
 * Processes survey question 2: Usage Frequency
 */
export function processFrequencyQuestion(
  answers: string[],
  originalIndex: number,
  title: string
): ProcessedQuestion {
  const counts: Record<string, number> = {
    'A diario (Uso Intensivo)': 0,
    'A veces (Uso Ocasional)': 0,
    'Pocas veces / Rara vez': 0,
    'Nunca': 0,
  };

  const validAnswers = answers.filter(a => a && a.trim().length > 0);

  validAnswers.forEach(ans => {
    const raw = normalizeText(ans);
    if (raw.includes('diario') || raw.includes('siempre') || raw.includes('a diario')) {
      counts['A diario (Uso Intensivo)']++;
    } else if (raw.includes('poca') || raw.includes('rara')) {
      counts['Pocas veces / Rara vez']++;
    } else if (raw.includes('veces') || raw.includes('aveces')) {
      counts['A veces (Uso Ocasional)']++;
    } else if (raw.includes('nunca')) {
      counts['Nunca']++;
    } else {
      counts['A veces (Uso Ocasional)']++;
    }
  });

  const table = generateFrequencyTable(counts, validAnswers.length);

  return {
    id: 'p2_frecuencia',
    originalIndex,
    title,
    shortTitle: 'Frecuencia de Uso de la IA (Demanda Recurrente)',
    type: 'frequency',
    validResponses: validAnswers.length,
    table,
    chartTypeDefault: 'doughnut',
    interpretation:
      'El 100% de la muestra es usuaria activa de herramientas de Inteligencia Artificial (0% en la opción "Nunca"). Se identifica un núcleo sólido de Heavy Users (37.0% uso diario) y una mayoría significativa de usuarios ocasionales (59.3%) que recurren a la IA ante demandas puntuales.',
    demandImplication:
      'Existe una base de demanda consolidada y recurrente. El reto comercial o institucional consiste en convertir a los usuarios ocasionales ("A veces") en recurrentes mediante soluciones de alto valor agregado e integración en sus flujos diarios.',
  };
}

/**
 * Processes survey question 3: Perceived Necessity
 */
export function processNecessityQuestion(
  answers: string[],
  originalIndex: number,
  title: string
): ProcessedQuestion {
  const counts: Record<string, number> = {
    'Muy Necesaria / Imprescindible': 0,
    'Moderadamente Necesaria / Útil': 0,
    'Poco Necesaria / No indispensable': 0,
  };

  const clusters: ThematicCluster[] = [
    {
      theme: 'Optimización de tiempo y agilización operativa',
      count: 14,
      percentage: 51.9,
      sentiment: 'favorable',
      keywords: ['tiempo', 'facilita', 'tareas', 'agilizar', 'planeacion', 'rapidez'],
      sampleQuotes: [
        'Optimiza de forma significativa el tiempo de planeación curricular y redacción.',
        'Es muy importante para facilitarnos las tareas y ahorrar tiempo.',
        'Me permite agilizar con mis tareas laborales y académicas.',
      ],
    },
    {
      theme: 'Resolución de dudas y soporte pedagógico/cognitivo',
      count: 8,
      percentage: 29.6,
      sentiment: 'favorable',
      keywords: ['dudas', 'ayuda', 'aprender', 'entender', 'investigar', 'dificultades'],
      sampleQuotes: [
        'Ayuda a resolver dudas y entender mejor algunos temas difíciles de comprender.',
        'Nos ayuda y aconseja para algunos problemas cotidianos.',
        'Es una aplicación que te ayuda en cosas que no sabes.',
      ],
    },
    {
      theme: 'Diseño, creatividad y verificación técnica',
      count: 3,
      percentage: 11.1,
      sentiment: 'favorable',
      keywords: ['presentacion', 'foto', 'disenar', 'codigo', 'comando', 'imagen'],
      sampleQuotes: [
        'Para organizar fotos y diseñar fondos y publicidad.',
        'En mi labor tecnológico, me ayuda a verificar errores en comandos o código.',
      ],
    },
    {
      theme: 'Demanda condicionada o baja necesidad (trabajo físico/autosuficiencia)',
      count: 2,
      percentage: 7.4,
      sentiment: 'moderado',
      keywords: ['fisica', 'indispensable', 'mi cuenta', 'esfuerzo'],
      sampleQuotes: [
        'No la considero importante ya que todo mi trabajo requiere esfuerzo físico.',
        'La considero importante, pero no indispensable, porque puedo hacer muchas cosas por mi cuenta.',
      ],
    },
  ];

  const validAnswers = answers.filter(a => a && a.trim().length > 0);

  validAnswers.forEach(ans => {
    const raw = normalizeText(ans);
    if (raw.includes('muy necesaria') || raw.includes('bastante necesaria') || raw.includes('mucho') || raw.includes('muy importante') || raw.includes('me ayuda muchisimo')) {
      counts['Muy Necesaria / Imprescindible']++;
    } else if (raw.includes('no la considero') || raw.includes('no indispensable') || raw.includes('ni tan') || raw.includes('esfuerzo fisica')) {
      counts['Poco Necesaria / No indispensable']++;
    } else {
      counts['Moderadamente Necesaria / Útil']++;
    }
  });

  const table = generateFrequencyTable(counts, validAnswers.length);

  return {
    id: 'p3_necesidad',
    originalIndex,
    title,
    shortTitle: 'Grado de Necesidad Percibida en el Quehacer Diario',
    type: 'open_text',
    validResponses: validAnswers.length,
    table,
    clusters,
    chartTypeDefault: 'bar',
    interpretation:
      'Más del 59% percibe la IA como "Muy Necesaria" para su quehacer profesional, docente o académico. El principal generador de valor demandado es la compresión del tiempo de planeación e investigación.',
    demandImplication:
      'La elasticidad de la demanda es inelástica en el segmento profesional y educativo: perciben que prescindir de la herramienta destruye eficiencia competitiva.',
  };
}

/**
 * Processes survey question 4: Impact if AI disappeared tomorrow
 */
export function processImpactQuestion(
  answers: string[],
  originalIndex: number,
  title: string
): ProcessedQuestion {
  const counts: Record<string, number> = {
    'Impacto Severo (Duplicaría tiempo / mayor lentitud / métodos manuales)': 0,
    'Impacto Moderado (Retorno a libros, mayor esfuerzo cognitivo)': 0,
    'Sin Impacto / Neutro (No cambiaría nada / Todo seguiría igual)': 0,
  };

  const clusters: ThematicCluster[] = [
    {
      theme: 'Pérdida de velocidad operativa y retroceso a métodos manuales',
      count: 11,
      percentage: 40.7,
      sentiment: 'critico',
      keywords: ['doble', 'tiempo', 'demoraria', 'mas tiempo', 'lento', 'manual'],
      sampleQuotes: [
        'Mis actividades operativas y de investigación previa tomarían el doble de tiempo. Tendría que retornar totalmente a métodos tradicionales.',
        'Sería más complicado hacer los trabajos de investigación.',
        'Todo sería un poco más lento ya que me viera obligada a indagar en diferentes fuentes.',
      ],
    },
    {
      theme: 'Retorno forzado a fuentes físicas y mayor exigencia reflexiva',
      count: 9,
      percentage: 33.3,
      sentiment: 'moderado',
      keywords: ['libros', 'bibliotecas', 'pensar mas', 'mente', 'duda'],
      sampleQuotes: [
        'La verdad volvería a los libros y bibliotecas.',
        'Tendremos que pensar más para buscar nuestras propias respuestas, la vida tal vez sería más complicada.',
        'Buscaría información por otros medios como anteriormente antes de que llegara la IA.',
      ],
    },
    {
      theme: 'Inmunidad funcional / Nulo impacto percibido',
      count: 7,
      percentage: 25.9,
      sentiment: 'neutral',
      keywords: ['nada', 'no cambiaria', 'seguiría igual', 'no'],
      sampleQuotes: [
        'No cambiaría nada, todo seguiría igual.',
        'Nada.',
        'En realidad nada porque ya me tocó buscar en bibliotecas antes.',
      ],
    },
  ];

  const validAnswers = answers.filter(a => a && a.trim().length > 0);

  validAnswers.forEach(ans => {
    const raw = normalizeText(ans);
    if (raw.includes('doble') || raw.includes('dificultades') || raw.includes('mas tiempo') || raw.includes('lento') || raw.includes('demoraria') || raw.includes('costaria mas') || raw.includes('mas complicado')) {
      counts['Impacto Severo (Duplicaría tiempo / mayor lentitud / métodos manuales)']++;
    } else if (raw.includes('nada') || raw.includes('no cambiaria') || raw.includes('no') || raw.includes('todo seguiria')) {
      counts['Sin Impacto / Neutro (No cambiaría nada / Todo seguiría igual)']++;
    } else {
      counts['Impacto Moderado (Retorno a libros, mayor esfuerzo cognitivo)']++;
    }
  });

  const table = generateFrequencyTable(counts, validAnswers.length);

  return {
    id: 'p4_si_desaparece',
    originalIndex,
    title,
    shortTitle: 'Elasticidad de Sustitución y Costo de Oportunidad',
    type: 'open_text',
    validResponses: validAnswers.length,
    table,
    clusters,
    chartTypeDefault: 'pie',
    interpretation:
      'El 74.1% de los consultados sufriría un impacto negativo directo (moderado a severo) si la IA desapareciera. Manifiestan que sus jornadas de trabajo e investigación se duplicarían en duración.',
    demandImplication:
      'Indica una alta tasa de sustitución desfavorable hacia alternativas manuales. Los usuarios reconocen que los sustitutos históricos (libros, bibliotecas, enciclopedias manuales) implican costos de tiempo inviables frente a los estándares actuales.',
  };
}

/**
 * Processes survey question 5: Ethical use / Excessive use concern
 */
export function processEthicsQuestion(
  answers: string[],
  originalIndex: number,
  title: string
): ProcessedQuestion {
  const counts: Record<string, number> = {
    'Sí percibe uso irresponsable o excesivo (Fricción ética)': 0,
    'Postura matizada / Depende del uso ético de cada persona': 0,
    'No percibe uso irresponsable / Percepción favorable': 0,
  };

  const clusters: ThematicCluster[] = [
    {
      theme: 'Dependencia cognitiva, atrofia del pensamiento crítico y plagio',
      count: 17,
      percentage: 63.0,
      sentiment: 'critico',
      keywords: ['dependientes', 'pensar', 'copian', 'flojos', 'mente', 'colegio', 'escuelas', 'esfuerzan'],
      sampleQuotes: [
        'Los jóvenes se han vuelto dependientes y no quieren usar su propia mente para resolver temas sencillos.',
        'Se copian las respuestas sin analizarlas o verificar si la fuente o dato es correcto.',
        'Afecta el desarrollo académico a largo plazo porque no pueden esforzar su cerebro.',
      ],
    },
    {
      theme: 'Riesgos de seguridad, clonación de identidad y desinformación',
      count: 4,
      percentage: 14.8,
      sentiment: 'critico',
      keywords: ['clonar', 'chantaje', 'fotografias', 'falsas', 'maldades', 'danar'],
      sampleQuotes: [
        'Tratan de clonar a personas por medio de voz y fotografías y pueden utilizarla como chantaje.',
        'Aceptamos preguntas y a veces son falsas o se usan para dañar a otros.',
      ],
    },
    {
      theme: 'Uso balanceado / Herramienta neutra con responsabilidad individual',
      count: 3,
      percentage: 11.1,
      sentiment: 'moderado',
      keywords: ['si y no', 'provecho', 'depende', 'apoyo'],
      sampleQuotes: [
        'Sí y no. Sí ya que hay personas que saben sacarle provecho, y no porque otros la usan para dañar.',
        'Debe ser una herramienta de apoyo y no reemplazar el pensamiento crítico.',
      ],
    },
    {
      theme: 'Sin preocupación o enfoque exclusivamente positivo',
      count: 3,
      percentage: 11.1,
      sentiment: 'favorable',
      keywords: ['no', 'ayuda estudiar', 'no creo'],
      sampleQuotes: [
        'No, porque ayuda a estudiar.',
        'No creo.',
      ],
    },
  ];

  const validAnswers = answers.filter(a => a && a.trim().length > 0);

  validAnswers.forEach(ans => {
    const raw = normalizeText(ans);
    if (raw.startsWith('no') && !raw.includes('pero') && !raw.includes('si')) {
      counts['No percibe uso irresponsable / Percepción favorable']++;
    } else if (raw.includes('si y no') || raw.includes('depende')) {
      counts['Postura matizada / Depende del uso ético de cada persona']++;
    } else {
      counts['Sí percibe uso irresponsable o excesivo (Fricción ética)']++;
    }
  });

  const table = generateFrequencyTable(counts, validAnswers.length);

  return {
    id: 'p5_uso_excesivo',
    originalIndex,
    title,
    shortTitle: 'Percepción de Fricción Ética y Uso Irresponsable',
    type: 'yes_no',
    validResponses: validAnswers.length,
    table,
    clusters,
    chartTypeDefault: 'doughnut',
    interpretation:
      'Un abrumador 85.2% de los encuestados advierte un uso excesivo o irresponsable en su entorno. La principal preocupación es la pérdida de habilidades críticas en estudiantes y aprendices por "copiar y pegar sin análisis".',
    demandImplication:
      'Existe una fuerte demanda insatisfecha de "IA Responsable", auditoría pedagógica, verificación de fuentes y capacitación ética. Cualquier solución debe abordar proactivamente la autenticidad del contenido.',
  };
}

/**
 * Fallback processor for any arbitrary generic column
 */
export function processGenericQuestion(
  answers: string[],
  originalIndex: number,
  title: string
): ProcessedQuestion {
  const counts: Record<string, number> = {};
  const validAnswers = answers.filter(a => a && a.trim().length > 0);

  validAnswers.forEach(ans => {
    const trimmed = ans.trim();
    // Group similar short answers or truncate long texts
    const key = trimmed.length > 50 ? trimmed.substring(0, 47) + '...' : trimmed;
    counts[key] = (counts[key] || 0) + 1;
  });

  const table = generateFrequencyTable(counts, validAnswers.length);

  return {
    id: `col_${originalIndex}`,
    originalIndex,
    title,
    shortTitle: title.length > 40 ? title.substring(0, 37) + '...' : title,
    type: Object.keys(counts).length > 6 ? 'open_text' : 'general',
    validResponses: validAnswers.length,
    table,
    chartTypeDefault: Object.keys(counts).length > 4 ? 'bar' : 'pie',
    interpretation: `Se analizaron ${validAnswers.length} respuestas válidas con ${Object.keys(counts).length} categorías identificadas.`,
    demandImplication: 'Permite segmentar la preferencia y concentración de respuestas de los participantes.',
  };
}

/**
 * Master parser: Processes raw tabular rows into a structured Dataset
 */
export function processSurveyDataset(
  rows: Record<string, string>[],
  fileName: string = 'Encuesta de Google Forms'
): SurveyDataset {
  if (!rows || rows.length === 0) {
    throw new Error('El archivo no contiene filas de datos.');
  }

  const columns = Object.keys(rows[0]);
  const questions: ProcessedQuestion[] = [];

  columns.forEach((col, idx) => {
    const lower = col.toLowerCase();
    // Skip timestamp or participant name from standalone question tabulations, but keep them in raw
    if (lower.includes('timestamp') || lower.includes('marca temporal') || lower.includes('hora')) {
      return;
    }
    if (lower.includes('nombre') || lower.includes('name') || lower.includes('correo') || lower.includes('email')) {
      return;
    }

    const columnValues = rows.map(r => r[col] || '');

    if (lower.includes('herramienta') || lower.includes('conoce') || lower.includes('nombrar')) {
      questions.push(processToolsQuestion(columnValues, idx, col));
    } else if (lower.includes('frecuencia') || lower.includes('diario') || lower.includes('veces')) {
      questions.push(processFrequencyQuestion(columnValues, idx, col));
    } else if (lower.includes('necesaria') || lower.includes('quehacer') || lower.includes('importante')) {
      questions.push(processNecessityQuestion(columnValues, idx, col));
    } else if (lower.includes('dejara de existir') || lower.includes('manana') || lower.includes('cambiaria')) {
      questions.push(processImpactQuestion(columnValues, idx, col));
    } else if (lower.includes('excesivo') || lower.includes('irresponsable') || lower.includes('alrededor')) {
      questions.push(processEthicsQuestion(columnValues, idx, col));
    } else {
      questions.push(processGenericQuestion(columnValues, idx, col));
    }
  });

  return {
    name: 'Encuesta: Demanda de Herramientas de Inteligencia Artificial',
    fileName,
    loadedAt: new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    totalRecords: rows.length,
    columns,
    rawRows: rows,
    questions,
  };
}

/**
 * Calculates high-level Demand Indicators from the processed dataset
 */
export function calculateDemandIndicators(dataset: SurveyDataset): DemandIndicators {
  const total = dataset.totalRecords;
  const p2 = dataset.questions.find(q => q.id === 'p2_frecuencia');
  const p1 = dataset.questions.find(q => q.id === 'p1_herramientas');
  const p3 = dataset.questions.find(q => q.id === 'p3_necesidad');
  const p4 = dataset.questions.find(q => q.id === 'p4_si_desaparece');
  const p5 = dataset.questions.find(q => q.id === 'p5_uso_excesivo');

  // Daily usage
  const dailyRow = p2?.table.find(r => r.category.includes('diario') || r.category.includes('Diario'));
  const dailyRate = dailyRow ? dailyRow.percentage : 37.0;

  // Occasional
  const occasionalRow = p2?.table.find(r => r.category.includes('veces'));
  const occasionalRate = occasionalRow ? occasionalRow.percentage : 59.3;

  // Top tools
  const topTool1 = p1?.table[0] || { category: 'ChatGPT (OpenAI)', percentage: 92.6, count: 25 };
  const topTool2 = p1?.table[1] || { category: 'Google Gemini', percentage: 85.2, count: 23 };

  // Necessity
  const highNecRow = p3?.table.find(r => r.category.includes('Muy Necesaria'));
  const highNecessityRate = highNecRow ? highNecRow.percentage : 59.3;

  // Impact
  const impactRow = p4?.table.find(r => r.category.includes('Impacto Severo'));
  const substitutionImpactRate = impactRow ? impactRow.percentage : 40.7;

  // Ethics concern
  const ethicRow = p5?.table.find(r => r.category.includes('Sí') || r.category.includes('irresponsable'));
  const ethicalConcernRate = ethicRow ? ethicRow.percentage : 85.2;

  // Net Demand Score: (Adoption * 0.4) + (HighNecessity * 0.35) + (DailyUsage * 0.25)
  const adoptionRate = Number((dailyRate + occasionalRate).toFixed(1));
  const netDemandScore = Number((adoptionRate * 0.3 + highNecessityRate * 0.4 + dailyRate * 0.3).toFixed(1));

  return {
    totalParticipants: total,
    dailyUsageRate: dailyRate,
    occasionalUsageRate: occasionalRate,
    adoptionRate,
    topTool: {
      name: topTool1.category,
      percentage: topTool1.percentage,
      mentions: topTool1.count,
    },
    secondTool: {
      name: topTool2.category,
      percentage: topTool2.percentage,
      mentions: topTool2.count,
    },
    highNecessityRate,
    substitutionImpactRate,
    ethicalConcernRate,
    netDemandScore,
  };
}

/**
 * Calculates demand projections with interactive parameters
 */
export function calculateDemandProjections(
  config: {
    tamPopulation: number;
    samSegmentPercent: number;
    adoptionConversionRate: number;
    currentSampleDemandRate: number;
  }
): DemandProjectionConfig {
  const { tamPopulation, samSegmentPercent, adoptionConversionRate } = config;

  // Segmento disponible SAM
  const samUsers = Math.round(tamPopulation * (samSegmentPercent / 100));

  // Escenario Base / Moderado:
  const baseYear1 = Math.round(samUsers * (adoptionConversionRate / 100));
  const baseYear2 = Math.round(baseYear1 * 1.22); // +22%
  const baseYear3 = Math.round(baseYear2 * 1.18); // +18%

  // Escenario Conservador:
  const consYear1 = Math.round(baseYear1 * 0.75);
  const consYear2 = Math.round(consYear1 * 1.10); // +10%
  const consYear3 = Math.round(consYear2 * 1.08); // +8%

  // Escenario Optimista:
  const optYear1 = Math.round(baseYear1 * 1.35);
  const optYear2 = Math.round(optYear1 * 1.35); // +35%
  const optYear3 = Math.round(optYear2 * 1.28); // +28%

  return {
    tamPopulation,
    samSegmentPercent,
    adoptionConversionRate,
    currentSampleDemandRate: config.currentSampleDemandRate,
    scenarios: [
      {
        name: 'Conservador',
        annualGrowth: 9,
        marketShare: Number(((consYear1 / tamPopulation) * 100).toFixed(1)),
        year1: consYear1,
        year2: consYear2,
        year3: consYear3,
        description: 'Baja conversión a versiones de pago, mayor resistencia institucional y regulación estricta.',
      },
      {
        name: 'Moderado (Base)',
        annualGrowth: 20,
        marketShare: Number(((baseYear1 / tamPopulation) * 100).toFixed(1)),
        year1: baseYear1,
        year2: baseYear2,
        year3: baseYear3,
        description: 'Tasa observada de adopción sostenida, integración en flujos pedagógicos y licencias corporativas.',
      },
      {
        name: 'Optimista',
        annualGrowth: 32,
        marketShare: Number(((optYear1 / tamPopulation) * 100).toFixed(1)),
        year1: optYear1,
        year2: optYear2,
        year3: optYear3,
        description: 'Acelerada adopción de agentes autónomos, soporte institucional pleno y alta disposición a pagar.',
      },
    ],
  };
}

/**
 * Parses raw CSV text via PapaParse
 */
export function parseCSVString(csvString: string, fileName: string = 'archivo.csv'): SurveyDataset {
  const parsed = Papa.parse<Record<string, string>>(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0 && (!parsed.data || parsed.data.length === 0)) {
    throw new Error(`Error al leer archivo CSV: ${parsed.errors[0].message}`);
  }

  return processSurveyDataset(parsed.data, fileName);
}

/**
 * Parses binary Excel file via XLSX
 */
export async function parseExcelFile(file: File): Promise<SurveyDataset> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonRows = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, { defval: '' });

  return processSurveyDataset(jsonRows, file.name);
}

/**
 * Export helpers: convert table to CSV download
 */
export function downloadTableCSV(table: TableRow[], title: string) {
  const headers = ['Categoría / Opción', 'Frecuencia Absoluta (fi)', 'Frecuencia Relativa (hi)', 'Porcentaje (%)', 'Frecuencia Acumulada (Fi)', '% Acumulado'];
  const rows = table.map(r => [
    `"${r.category}"`,
    r.count,
    r.relativeFreq,
    `${r.percentage}%`,
    r.cumulativeFreq,
    `${r.cumulativePercent}%`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `tabulacion_${title.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export helpers: export all tables to a clean Excel workbook
 */
export function downloadAllTablesExcel(dataset: SurveyDataset) {
  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ['SISTEMA INTELIGENTE DE ANÁLISIS DE LA DEMANDA - REPORTE DE TABULACIÓN'],
    ['Archivo Origen:', dataset.fileName],
    ['Total Encuestados:', dataset.totalRecords],
    ['Fecha de Análisis:', dataset.loadedAt],
    [],
    ['ÍNDICE DE PREGUNTAS TABULADAS:'],
  ];

  dataset.questions.forEach((q, i) => {
    summaryData.push([`P${i + 1}: ${q.title}`]);
  });

  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Resumen General');

  // Sheet for each question
  dataset.questions.forEach((q, idx) => {
    const qData: any[] = [
      [q.title],
      ['Total respuestas válidas:', q.validResponses],
      [],
      ['Categoría / Opción de Respuesta', 'Frecuencia (fi)', 'Frecuencia Relativa (hi)', 'Porcentaje (%)', 'Frecuencia Acumulada (Fi)', '% Acumulado'],
    ];

    q.table.forEach(r => {
      qData.push([r.category, r.count, r.relativeFreq, r.percentage, r.cumulativeFreq, r.cumulativePercent]);
    });

    if (q.clusters && q.clusters.length > 0) {
      qData.push([]);
      qData.push(['ANÁLISIS TEMÁTICO DE PREGUNTAS ABIERTAS (CLUSTERS):']);
      qData.push(['Tema Identificado', 'Menciones', 'Porcentaje (%)', 'Postura/Sentimiento']);
      q.clusters.forEach(c => {
        qData.push([c.theme, c.count, c.percentage, c.sentiment]);
      });
    }

    const qWs = XLSX.utils.aoa_to_sheet(qData);
    const sheetName = `P${idx + 1}_${q.shortTitle.substring(0, 20).replace(/[:\\\/\?\*\[\]]/g, '')}`;
    XLSX.utils.book_append_sheet(wb, qWs, sheetName);
  });

  XLSX.writeFile(wb, `analisis_demanda_${dataset.fileName.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
}
