import { useState, useEffect } from 'react';
import ProjectBox from './components/ProjectBox';
import ScrollIndicator from './components/ScrollIndicator';
import ContactPage from './components/ContactPage';
import FolderIcon from './components/FolderIcon';
import GestureControl from './components/GestureControl';

// Main featured projects (5) - clustered in center
const mainProjects = [
  {
    id: 1,
    title: 'ADHD Classificaion model',
    description: 'Lightweight model that uses EEG signals to help diagnose ADHD',
    size: 'large',
    demos: [
      { icon: '🛒', title: 'Shopping Cart', description: 'Seamless checkout experience' },
      { icon: '💳', title: 'Payment Processing', description: 'Secure payment integration' },
      { icon: '📊', title: 'Analytics Dashboard', description: 'Real-time sales analytics' },
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
    title: 'Fitness Tracker',
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
    { name: 'TypeScript', icon: '' },
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
                Grace Kalonji
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
                  {/* Left Side - Image Placeholder */}
                  <div className="flex-1 bg-apple-gray-50 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300">
                    {/* Image will go here */}
                    <div className="text-apple-gray-400 text-sm">Image</div>
                  </div>
                  
                  {/* Right Side - Gesture Control Button */}
                  <div className="flex-1">
                    <div className="flex flex-col items-center justify-center h-full">
                      {/* Potential space for text above the button */}
                      <div className="mb-4 text-center text-apple-gray-700 font-semibold transition-all duration-300 hover:text-apple-gray-900">
                        you can also control the cursor on this page with your hand gestures <br/> Constantly hold index+thumb to move the cursor <br/> add your middle to and return it to click and your ring to right click <br/>  
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
                          ${isGestureActive ? 'bg-apple-gray-900 text-white border-apple-gray-900' : 'text-apple-gray-900'}
                        `}
                        aria-label={isGestureActive ? 'Disable gesture control' : 'Enable gesture control'}
                        style={{ minWidth: '180px' }}
                      >
                        <span className="text-sm sm:text-base font-medium">
                          {isGestureActive ? '🖐️ Stop Gestures' : '👋 Start Gestures'}
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
      <GestureControl isActive={isGestureActive} onToggle={() => setIsGestureActive(!isGestureActive)} />

      {/* Contact Page */}
      <ContactPage />
    </div>
  );
}

export default App;
