import { useState, useEffect } from 'react';
import FolderIcon from './FolderIcon';

const ProjectBox = ({ project, size = 'medium', showAllProjects = false, staggerDelay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(!showAllProjects);

  // Grid spans based on size
  const getSpans = () => {
    if (showAllProjects) {
      // When showing all projects, everything is square
      return { col: 'col-span-1', row: 'row-span-1' };
    }
    
    // Initial bento grid layout
    switch (size) {
      case 'medium':
        return { col: 'col-span-2', row: 'row-span-2' };
      case 'large':
        return { col: 'col-span-2', row: 'row-span-2' };
      case 'wide':
        return { col: 'col-span-4', row: 'row-span-1' };
      case 'square':
        return { col: 'col-span-1', row: 'row-span-1' };
      default:
        return { col: 'col-span-1', row: 'row-span-1' };
    }
  };

  const spans = getSpans();

  // Animate in when showing all projects
  useEffect(() => {
    if (showAllProjects && !isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, staggerDelay);
      return () => clearTimeout(timer);
    }
  }, [showAllProjects, staggerDelay, isVisible]);

  useEffect(() => {
    let interval;
    if (isHovered && project.demos && project.demos.length > 1) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % project.demos.length);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, project.demos]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentSlide(0);
  };

  return (
    <div
      className={`
        ${spans.col}
        ${spans.row}
        relative
        bg-white
        rounded-2xl
        p-3
        sm:p-4
        lg:p-6
        border
        border-apple-gray-200
        transition-all
        duration-500
        ease-out
        cursor-pointer
        overflow-hidden
        group
        hover:shadow-2xl
        hover:border-apple-gray-300
        hover:-translate-y-2
        ${showAllProjects ? 'aspect-square' : ''}
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Folder Icon */}
      <div
        className={`
          transition-all
          duration-500
          ease-out
          ${isHovered ? 'scale-110' : 'scale-100'}
        `}
      >
        <FolderIcon className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14" />
      </div>

      {/* Project Title */}
      <h3
        className={`
          mt-3
          sm:mt-4
          text-base
          sm:text-lg
          font-semibold
          text-apple-gray-900
          transition-opacity
          duration-300
          ${isHovered ? 'opacity-0' : 'opacity-100'}
        `}
      >
        {project.title}
      </h3>

      {/* Project Description */}
      <p
        className={`
          mt-1.5
          sm:mt-2
          text-xs
          sm:text-sm
          text-apple-gray-600
          transition-opacity
          duration-300
          ${isHovered ? 'opacity-0' : 'opacity-100'}
        `}
      >
        {project.description}
      </p>

      {/* Slideshow Demo Overlay */}
      {isHovered && project.demos && project.demos.length > 0 && (
        <div
          className="
            absolute
            inset-0
            bg-white/95
            backdrop-blur-xl
            rounded-2xl
            p-4
            sm:p-6
            flex
            items-center
            justify-center
            animate-in
            fade-in
            duration-300
          "
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {project.demos.map((demo, index) => (
              <div
                key={index}
                className={`
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  transition-opacity
                  duration-500
                  ${index === currentSlide ? 'opacity-100' : 'opacity-0'}
                `}
              >
                <div className="bg-apple-gray-100 rounded-xl p-4 sm:p-6 lg:p-8 w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{demo.icon || '📱'}</div>
                    <h4 className="text-base sm:text-lg font-semibold text-apple-gray-900 mb-2">
                      {demo.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-apple-gray-600">{demo.description}</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Slide indicators */}
            {project.demos.length > 1 && (
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {project.demos.map((_, index) => (
                  <div
                    key={index}
                    className={`
                      w-2
                      h-2
                      rounded-full
                      transition-all
                      duration-300
                      ${index === currentSlide ? 'bg-apple-gray-900 w-6' : 'bg-apple-gray-300'}
                    `}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBox;
