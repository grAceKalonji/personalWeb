import { useState, useEffect, useRef } from 'react';
import ProjectBox from './components/ProjectBox';
import ScrollIndicator from './components/ScrollIndicator';
import ContactPage from './components/ContactPage';
import FolderIcon from './components/FolderIcon';
import GestureControl from './components/GestureControl';
import pipelineImage from './assets/Images/Adhd/pipeline.png';

// Main featured projects (5) - clustered in center
const mainProjects = [
  {
    id: 1,
    title: 'ADHD Classification',
    description: 'Built a lightweight, two-staged model that uses EEG signals to help diagnose ADHD',
    size: 'large',
    details: 
    <>
      <b>Problem:</b>
      <br />
      Over the past two decades, rates of ADHD diagnosis have risen significantly. Despite this rise, <u>ADHD screening methods remain almost entirely clinical, this increases diagnostic burden and creates a need for more objective, data driven tools. </u> While research has been done on utilizing physiological data to diagnose patients, there still remains much room for improvement.
      <br />
      <br />
      <b>Approach:</b>
      <br />
      Using a dataset of preprocessed EEG-derived feature vectors from Kaggle, I implemented a lightweight, teacher–student deep learning pipeline for 3 different models: 
      <br /> 
      - A small 1D ResNet model 
      <br /> 
      - A transformer model 
      <br /> 
      - A eegnet model. <br /> 
      All these were trained as a “teacher” to identify discriminative EEG features using gradient-based saliency. These saliency maps were then used to filter low-importance features, and the resulting masked data was evaluated using EEGNet, a compact architecture designed for EEG classification. They all shared the same student architecture (EEGNet). Performance was compared against the masked data and the unfiltered data.
    </>,
    demos: [
      { icon: '🧠', title: 'EEG Signal Processing', description: 'Advanced signal processing and feature extraction from EEG data' },
      { icon: '🤖', title: 'ML Model Training', description: 'Training and optimization of classification models' },
      { icon: '📊', title: 'Results Visualization', description: 'Interactive dashboards for viewing diagnostic results' },
    ],
  },
  {
    id: 2,
    title: 'Revise',
    description: 'Mobile app Meant to help anyone learn through constant repetition',
    size: 'medium',
    demos: [
      { icon: '✅', title: 'Task Board', description: 'Kanban-style task organization' },
      { icon: '👥', title: 'Team Collaboration', description: 'Real-time team updates' },
    ],
  },
  {
    id: 3,
    title: 'Social Media Analytics',
    description: 'Comprehensive social media insights and reporting',
    size: 'wide',
    demos: [
      { icon: '📈', title: 'Analytics Overview', description: '' },
      { icon: '📱', title: 'Platform Insights', description: 'Multi-platform analytics' },
      { icon: '📊', title: 'Engagement Reports', description: 'Detailed engagement metrics' },
    ],
  },
  {
    id: 4,
    title: 'Tracker',
    description: 'Personal fitness tracking with workout plans',
    size: 'medium',
    demos: [
      { icon: '🏃', title: 'Workout Tracking', description: '' },
      { icon: '📉', title: 'Progress Charts', description: 'Visualize your progress' },
    ],
  },
  {
    id: 5,
    title: 'Cloud classification model',
    description: 'Modern music player with playlist management',
    size: 'medium',
    demos: [
      { icon: '🎵', title: 'Now Playing', description: '' },
      { icon: '📋', title: 'Playlists', description: 'Create and manage playlists' },
    ],
  },
];

// Additional projects (shown when "View More" is clicked)
const additionalProjects = [
  {
    id: 6,
    title: 'Privacy Lens',
    description: 'Determines how safe sites are.',
    size: 'square',
    demos: [
      { icon: '🌤️', title: 'Weather Forecast', description: '7-day weather predictions' },
    ],
  },
  {
    id: 7,
    title: 'Recipe Finder',
    description: 'Discover recipes based on ingredients',
    size: 'square',
    demos: [
      { icon: '🍳', title: 'Recipe Search', description: 'Find recipes by ingredients' },
    ],
  },
  {
    id: 8,
    title: 'Portfolio Website',
    description: 'Personal portfolio with project showcase',
    size: 'square',
    demos: [
      { icon: '💼', title: 'Project Gallery', description: 'Showcase your work' },
    ],
  },
];

function App() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showTechStack, setShowTechStack] = useState(false);
  const [isGestureActive, setIsGestureActive] = useState(false);
  const [expandedProject, setExpandedProject] = useState(null);
  const videoContainerRef = useRef(null);

  // Show tech stack after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTechStack(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Tech stack logos
  const techStack = [
    { name: 'Model Development', icon: '' },
    { name: 'React', icon: '' },
    { name: 'Python', icon: '' },
    { name: 'JavaScript', icon: '' },
    { name: 'Node.js', icon: '' },
    { name: 'TensorFlow', icon: '' },
    { name: 'PyTorch', icon: '' },
    { name: 'MLOps', icon: '' },
    { name: 'Data Processing', icon: '' },
  ];

  const internships = [
    { name: 'Incoming', icon: '🧠' },
    { name: 'Incoming', icon: '🔥' },
    { name: 'Incoming', icon: '📦' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-24">
        <div className={`max-w-7xl w-full transition-all duration-1000 ease-out ${showTechStack ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12' : 'flex flex-col items-center justify-center'}`}>
          {/* Left Side - Text and Tech Stack */}
          <div className={`w-full transition-all duration-1000 ease-out ${showTechStack ? 'text-left' : 'text-center'}`}>
            <div className={`transition-all duration-1000 ease-out ${showTechStack ? 'max-w-full' : 'max-w-4xl mx-auto'}`}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-apple-gray-900 mb-4 sm:mb-6 leading-tight">
                Mars Kal
                <br />
                <span className="text-apple-gray-600">Projects</span>
              </h1>
              <p className="text-lg sm:text-xl text-apple-gray-600 mb-4 sm:mb-6 leading-relaxed">
                A collection of projects showcasing my work in AI engineering, ML and software development.
              </p>
              <p className="text-sm sm:text-base text-apple-gray-600 mb-8 sm:mb-12 leading-relaxed">
                Undergraduate in Computer Science at the University of Southern Maine
              </p>
            </div>

            {/* Tech Stack Logos */}
            <div 
              className={`
                mt-8
                sm:mt-12
                transition-all
                duration-1000
                ease-out
                ${showTechStack ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
              `}
            >
              <h2 className="text-sm font-medium text-apple-gray-500 mb-4 uppercase tracking-wide mb-3">
                Internships with: 
              </h2>
              <div className="flex flex-wrap gap-4 sm:gap-6 mb-8">  
                {internships.map((internship, index) => (
                  <div
                    key={internship.name}
                    className={`flex items-center gap-2 px-4 py-2 bg-apple-gray-50 rounded-xl border border-apple-gray-200 transition-all duration-500 hover:bg-white hover:shadow-lg hover:border-apple-gray-300 hover:-translate-y-1`}
                    style={{
                      transitionDelay: showTechStack ? `${index * 50}ms` : '0ms',
                    }}
                  >

                    <span className="text-2xl">{internship.icon}</span>
                    <span className="text-sm font-medium text-apple-gray-700">{internship.name}</span>
                  </div>
                ))}
              </div>


              <h2 className="text-sm font-medium text-apple-gray-500 mb-4 uppercase tracking-wide">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
                {techStack.map((tech, index) => (
                  <div
                    key={tech.name}
                    className={`
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2
                      bg-apple-gray-50
                      rounded-xl
                      border
                      border-apple-gray-200
                      transition-all
                      duration-500
                      hover:bg-white
                      hover:shadow-lg
                      hover:border-apple-gray-300
                      hover:-translate-y-1
                      ${showTechStack ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                    `}
                    style={{
                      transitionDelay: showTechStack ? `${index * 50}ms` : '0ms',
                    }}
                  >
                    <span className="text-2xl">{tech.icon}</span>
                    <span className="text-sm font-medium text-apple-gray-700">{tech.name}</span>

                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Split into two halves */}
          {showTechStack && (
            <div 
              className={`
                w-full 
                flex 
                flex-col 
                gap-4 
                sm:gap-6 
                h-full
                transition-all
                duration-1000
                ease-out
                ${showTechStack ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{
                transitionDelay: '200ms',
              }}
            >
              {/* top half - image of myself */}
              <div className="flex-1 flex items-center justify-center">
              <div
                className="bg-apple-gray-50 rounded-xl border border-apple-gray-200 flex items-center justify-center overflow-hidden transition-all duration-300 hover:bg-white hover:shadow-lg"
                style={{ width: '290px', height: '290px', minWidth: '290px', minHeight: '290px', maxWidth: '290px', maxHeight: '290px' }}
              >
                    {/* Image of myself */}
              <div className="text-apple-gray-400 text-sm">Image of myself</div>
              </div>
              </div>


              {/* Bottom Half - Gesture Control */}
              <div className="flex-1 flex items-center justify-center group cursor-pointer">
                <div className="w-full h-full rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 flex gap-3 sm:gap-4">
                  {/* Left Side - Video Feed Container */}
                  <div 
                    ref={videoContainerRef}
                    className="flex-1 bg-apple-gray-50 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300"
                  >
                    {!isGestureActive && (
                      <div className="text-apple-gray-400 text-sm">Image</div>
                    )}
                  </div>
                  
                  {/* Right Side - Gesture Control Button */}
                  <div className="flex-1">
                    <div className="flex flex-col items-center justify-center h-full">
                      {/* Potential space for text above the button */}
                      <div className="mb-4 text-center text-apple-gray-700 font-semibold transition-all duration-300 hover:text-apple-gray-900">
                        You can also control the cursor on this page with your hand gestures <br/>   
                      </div> 
                      <div className="mb-4 text-center text-apple-gray-700 font transition-all duration-300 hover:text-apple-gray-900">
                        Constantly hold index+thumb to move the cursor <br/> add your middle to and return it to click and your ring to right click <br/>  
                      </div> 
                      <button
                        onClick={() => setIsGestureActive(!isGestureActive)}
                        className={`
                          rounded-xl
                          border
                          border-apple-gray-200
                          bg-white
                          shadow-lg
                          transition-all
                          duration-300
                          hover:shadow-xl
                          hover:scale-[1.02]
                          flex
                          items-center
                          justify-center
                          px-8
                          py-4
                          ${isGestureActive ? 'bg-apple-gray-900 text-black border-apple-gray-900' : 'text-apple-gray-900'}
                        `}
                        aria-label={isGestureActive ? 'Disable gesture control' : 'Enable gesture control'}
                        style={{ minWidth: '180px' }}
                      >
                        <span className="text-sm sm:text-base font-medium">
                          {isGestureActive ? ' Stop Gestures' : ' Start Gestures'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* Bento Grid Section */}
      <section id="projects" className="h-screen px-2 sm:px-3 md:px-4 flex items-center justify-center overflow-hidden relative">
        <div 
          className={`
            grid transition-all duration-700 ease-out
            ${showAllProjects 
              ? 'grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 w-full max-w-6xl mx-auto' 
              : 'grid-cols-4 w-auto h-auto'
            }
            gap-x-2 sm:gap-x-3 md:gap-x-4
          `}
          style={{ 
            gridTemplateRows: showAllProjects 
              ? 'repeat(auto-fit, minmax(180px, auto))' 
              : 'repeat(3, 1fr)',
            rowGap: showAllProjects ? '1.5rem' : '0.5rem',
            height: showAllProjects ? 'auto' : 'auto',
            maxHeight: showAllProjects ? '70vh' : 'none',
            paddingTop: showAllProjects ? '3rem' : '0',
            paddingBottom: showAllProjects ? '3rem' : '0',
          }}
        >
          {(showAllProjects ? [...mainProjects, ...additionalProjects] : mainProjects).map((project, index) => (
            <ProjectBox
              key={project.id}
              project={project}
              size={showAllProjects ? 'square' : project.size}
              showAllProjects={showAllProjects}
              staggerDelay={showAllProjects ? index * 50 : 0}
              onExpand={() => setExpandedProject(project)}
            />
          ))}
        </div>

        {/* View More / Collapse Folder Card - Bottom Right */}
        <button
          onClick={() => setShowAllProjects(!showAllProjects)}
          className="
            absolute
            bottom-8
            right-8
            w-20
            h-20
            sm:w-24
            sm:h-24
            bg-white
            rounded-2xl
            border
            border-apple-gray-200
            flex
            flex-col
            items-center
            justify-center
            gap-2
            transition-all
            duration-300
            hover:shadow-2xl
            hover:border-apple-gray-300
            hover:scale-105
            group
            z-20
          "
          aria-label={showAllProjects ? "Collapse projects" : "View all projects"}
        >
          <FolderIcon className="w-10 h-10 sm:w-12 sm:h-12 text-apple-gray-700 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-xs sm:text-sm font-medium text-apple-gray-600 group-hover:text-apple-gray-900">
            {showAllProjects ? 'Less' : 'More'}
          </span>
        </button>
      </section>

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* Gesture Control */}
      <GestureControl 
        isActive={isGestureActive} 
        onToggle={() => setIsGestureActive(!isGestureActive)}
        videoContainerElement={videoContainerRef.current}
      />

      {/* Contact Page */}
      <ContactPage />

      {/* Expanded Project View */}
      {expandedProject && (
        <div
          className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-[60px]"
          onClick={() => setExpandedProject(null)}
        >
          <div
            className="
              w-full
              h-full
              bg-white
              rounded-3xl
              border
              border-apple-gray-200
              shadow-2xl
              overflow-hidden
              flex
              flex-col
              relative
              animate-fade-in-scale
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setExpandedProject(null)}
              className="
                absolute
                top-6
                right-6
                z-10
                w-10
                h-10
                rounded-full
                bg-apple-gray-100
                hover:bg-apple-gray-200
                border
                border-apple-gray-200
                flex
                items-center
                justify-center
                transition-all
                duration-200
                hover:scale-110
                group
              "
              aria-label="Close project view"
            >
              <svg
                className="w-5 h-5 text-apple-gray-700 group-hover:text-apple-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <div className="p-8 sm:p-12 border-b border-apple-gray-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <FolderIcon className="w-12 h-12 sm:w-16 sm:h-16 text-apple-gray-700" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl sm:text-4xl font-semibold text-apple-gray-900 mb-3">
                    {expandedProject.title}
                  </h2>
                  <p className="text-lg text-apple-gray-600">
                    {expandedProject.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-12">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Project Details Section */}
                <div>
                  <h3 className="text-2xl font-semibold text-apple-gray-900 mb-4">
                    Project Overview
                  </h3>
                  <div className="bg-apple-gray-50 rounded-2xl p-6 border border-apple-gray-200">
                    <p className="text-apple-gray-700 leading-relaxed">
                      {expandedProject.details || 'Project details coming soon...'}
                    </p>
                  </div>
                </div>

                {/* Features/Demos Section */}
                {expandedProject.demos && expandedProject.demos.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold text-apple-gray-900 mb-4">
                      Pipeline
                    </h3>
                    
                    {/* Pipeline Image */}
                    {expandedProject.id === 1 && (
                      <div className="mb-6 rounded-xl overflow-hidden border border-apple-gray-200 bg-apple-gray-50">
                        <img
                          src={pipelineImage}
                          alt="ADHD Classification Pipeline"
                          className="w-full h-full"
                        />
                      </div>
                    )}
                    <h3 className="text-2xl font-semibold text-apple-gray-900 mb-4">
                      Results
                    </h3>
                    <div>
                      <p className="text-apple-gray-600"> The best results came from the transformer-Teacher, EEgnet-Student pipeline with an accuracy of 81% </p>

                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {expandedProject.demos.map((demo, index) => (
                        <div
                          key={index}
                          className="
                            bg-apple-gray-50
                            rounded-xl
                            p-6
                            border
                            border-apple-gray-200
                            transition-all
                            duration-300
                            hover:bg-white
                            hover:shadow-lg
                            hover:border-apple-gray-300
                            hover:-translate-y-1
                          "
                        >
                          <div className="text-4xl mb-3">{demo.icon}</div>
                          <h4 className="text-lg font-semibold text-apple-gray-900 mb-2">
                            {demo.title}
                          </h4>
                          {demo.description && (
                            <p className="text-sm text-apple-gray-600">
                              {demo.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div>
                  <h3 className="text-2xl font-semibold text-apple-gray-900 mb-4">
                    Additional Information
                  </h3>
                  <div className="bg-apple-gray-50 rounded-2xl p-6 border border-apple-gray-200">
                    <p className="text-apple-gray-600">
                      More project information will be displayed here.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
