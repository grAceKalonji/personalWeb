// Project data for the portfolio

export const mainProjects = [
  {
    id: 1,
    title: 'ADHD Classification',
    description: 'Built a lightweight, two-staged model that uses EEG signals to help diagnose ADHD',
    size: 'large',
    details: 'Problem: Over the past two decades, rates of ADHD diagnosis have risen significantly. Despite this rise, ADHD screening methods remain almost entirely clinical, this increases diagnostic burden and creates a need for more objective, data driven tools. While research has been done on utilizing physiological data to diagnose patients, there still remains much room for improvement. Approach: Using a dataset of preprocessed EEG-derived feature vectors from Kaggle, I implemented a lightweight, teacher–student deep learning pipeline for 3 different models: A small 1D ResNet model, A transformer model, and A eegnet model. All these were trained as a "teacher" to identify discriminative EEG features using gradient-based saliency. These saliency maps were then used to filter low-importance features, and the resulting masked data was evaluated using EEGNet, a compact architecture designed for EEG classification. They all shared the same student architecture (EEGNet). Performance was compared against the masked data and the unfiltered data.',
    
    demos: [
      { description: 'Advanced signal processing and feature extraction from EEG data' },
     
    ],
  },

  {
    id: 2,
    title: 'Aegis',
    description: 'AI-assisted vaccine and therapeutic discovery with iterative simulation and real-time reasoning graphs',
    size: 'medium',
    details: {
      problem: 'Vaccine discovery is slow, subjective, and linear. Researchers spend months reading papers, score candidates inconsistently, and restart after every failed experiment with no system that evolves its proposals, cites the literature behind each decision, or shows its reasoning in one place.',
      approach: 'Aegis takes in disease biology papers, builds a searchable RAG knowledge base, and runs an iterative simulation that proposes, scores, and evolves candidates. Each round retrieves evidence, generates new options, scores them across 7 weighted dimensions with traceable citations, streams results to a live reasoning graph and displays the candidates 3 dimentional molecular structure.',
    },
    demos: [],
  },

  {
    id: 3,
    title: 'Analytics',
    description: 'Comprehensive social media insights and reporting',
    size: 'wide',
    demos: [
      {description: '' },

    ],
  },
  {
    id: 4,
    title: 'Tracker',
    description: 'Personal fitness tracking with workout plans',
    size: 'medium',
    demos: [
      {description: '' },

    ],
  },
  {
    id: 5,
    title: 'Cloud classification',
    description: 'Classify clouds',
    size: 'medium',
    demos: [
      {description: '' },

    ],
  },

  
];

export const additionalProjects = [

 
  {
    id: 7,
    title: 'Recipe Finder',
    description: 'Discover recipes based on ingredients',
    size: 'square',
    demos: [
      { icon: '🍳', title: 'Recipe Search', description: 'Find recipes by ingredients' },
    ],
  },
  
];

// Aegis-specific data
export const aegisTechStack = [
  'React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion',
  'FastAPI', 'Python', 'PostgreSQL', 'Supabase', 'pgvector',
  'OpenAI Embeddings', 'Claude 3.5 Sonnet', 'WebSocket', '3Dmol.js',
];

export const aegisFeatures = [
  { title: 'RAG Knowledge Base', description: 'PDFs are chunked (800 tokens, 200 overlap), embedded with text-embedding-3-small, and retrieved via cosine similarity — scaling to hundreds of papers at constant cost.' },
  { title: 'PubMed Discovery', description: 'Claude generates optimized virology, pathogenesis, and epidemiology queries against NCBI E-utilities, ranks results by relevance, and imports open-access PDFs in one click.' },
  { title: 'Iterative Simulation', description: 'Candidates evolve across iterations with parent-child lineage. The loop runs until max iterations or convergence (< 1% score variance over 3 rounds).' },
  { title: 'Real-Time Graph', description: 'Every scored candidate renders as a node — x-axis is iteration, y-axis is rank, edges show evolution. Click any node for full mechanism and score breakdown.' },
  { title: 'Structural Validation', description: 'In vaccine mode, candidates are mapped to PDB entries and benchmarked against approved vaccines (BNT162b2, mRNA-1273) with 3Dmol rendering.' },
  { title: 'Row-Level Security', description: 'Supabase RLS isolates every user\'s papers, simulations, and candidates at the database level. API keys stay server-side only.' },
];

export const aegisScoringDimensions = [
  { name: 'Immunogenicity', weight: '20%' },
  { name: 'Safety', weight: '20%' },
  { name: 'Efficacy', weight: '15%' },
  { name: 'Breadth of Protection', weight: '15%' },
  { name: 'Manufacturability', weight: '10%' },
  { name: 'Stability', weight: '10%' },
  { name: 'Novelty', weight: '10%' },
];

// ADHD-specific results data
export const adhdResults = [
  { model: "EEGNet", dataset: "Masked", accuracy: 0.6115, f1: 0.4641, precision: 0.3739, recall: 0.6115, inference:  0.3206 },
  { model: "ResNet1D", dataset: "Masked", accuracy: 0.7904, f1: 0.7871, precision: 0.7884, recall: 0.7904, inference: 0.3258 },
  { model: "Time series Transformer", dataset: "Masked", accuracy: 0.8046, f1: 0.8057, precision: 0.8079, recall: 0.8046, inference: 0.3301 },
  {},
  { model: "EEGNet", dataset: "Raw (preprocessed)", accuracy: 0.7814, f1: 0.7695, precision: 0.7904, recall: 0.7814, inference: 0.3694 },
];

