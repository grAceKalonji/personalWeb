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
    title: 'Privacy Lens',
    description: "Gives clarity on data collection and whether a sites actions match what it claims",
    size: 'medium',
      details: 'A Chrome extension that helps you understand where your data actually goes when you visit a website. Instead of assuming all data collection is bad, PrivacyLens gives you clarity on what data is being collected, why its being collected, and whether a sites actions match what it claims.',
    demos: [
      { description: 'Determines how safe sites are.' },
    ],
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

// ADHD-specific results data
export const adhdResults = [
  { model: "EEGNet", dataset: "Masked", accuracy: 0.6115, f1: 0.4641, precision: 0.3739, recall: 0.6115, inference:  0.3206 },
  { model: "ResNet1D", dataset: "Masked", accuracy: 0.7904, f1: 0.7871, precision: 0.7884, recall: 0.7904, inference: 0.3258 },
  { model: "Time series Transformer", dataset: "Masked", accuracy: 0.8046, f1: 0.8057, precision: 0.8079, recall: 0.8046, inference: 0.3301 },
  {},
  { model: "EEGNet", dataset: "Raw (preprocessed)", accuracy: 0.7814, f1: 0.7695, precision: 0.7904, recall: 0.7814, inference: 0.3694 },
];

