import { useState, useEffect } from 'react';
import FolderIcon from './FolderIcon';

const ProjectBox = ({ project, size = 'medium', showAllProjects = false, staggerDelay = 0, onExpand }) => {
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


  const handleClick = (e) => {
    e.stopPropagation();
    if (onExpand) {
      onExpand();
    }
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
        duration-300
        ease-out
        cursor-pointer
        overflow-hidden
        group
        hover:shadow-2xl
        hover:border-apple-gray-300
        hover:scale-95
        ${showAllProjects ? 'aspect-square' : ''}
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
      `}
      onClick={handleClick}
    >
      {/* Folder Icon */}
      <div>
        <FolderIcon className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14" />
      </div>

      {/* Project Title */}
      <h3
        className="
          mt-3
          sm:mt-4
          text-base
          sm:text-lg
          font-semibold
          text-apple-gray-900
        "
      >
        {project.title}
      </h3>

      {/* Project Description */}
      <p
        className="
          mt-1.5
          sm:mt-2
          text-xs
          sm:text-sm
          text-apple-gray-600
        "
      >
        {project.description}
      </p>
    </div>
  );
};

export default ProjectBox;
