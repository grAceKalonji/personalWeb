import FolderIcon from './FolderIcon';
import ADHDProjectContent from './ADHDProjectContent';
import adhdReport from '../assets/documents/Adhd_report.pdf';

const ExpandedProjectView = ({ project, onClose }) => {
  const isADHDProject = project.id === 1;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-[60px]"
      onClick={onClose}
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
          onClick={onClose}
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
        <div className="p-8 sm:p-6 border-b border-apple-gray-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <FolderIcon className="w-12 h-12 sm:w-16 sm:h-16 text-apple-gray-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl font-semibold text-apple-gray-900 mb-3">
                {project.title}
              </h2>
              <p className="text-lg text-apple-gray-600">
                {project.description}
              </p>
              {/* Links - ADHD specific */}
              {isADHDProject && (
                <div className="flex gap-4 mt-4">
                  <a
                    href="https://github.com/grAceKalonji"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-apple-gray-900 font-semibold underline hover:text-apple-gray-700 transition-colors"
                  >
                    [GitHub Repo]
                  </a>
                  <a
                    href={adhdReport}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-apple-gray-900 font-semibold underline hover:text-apple-gray-700 transition-colors"
                  >
                    [Full Report]
                  </a>
                </div>
              )}
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
                <div className="text-apple-gray-700 leading-relaxed">
                  {typeof project.details === 'string' 
                    ? <p>{project.details}</p>
                    : project.details || <p>Project details coming soon...</p>
                  }
                </div>
              </div>
            </div>

            {/* Project-Specific Content */}
            {isADHDProject && (
              <div>
                <h3 className="text-2xl font-semibold text-apple-gray-900 mb-4">
                  Pipeline
                </h3>
                <ADHDProjectContent />
              </div>
            )}

            {/* Features/Demos Section - Generic for all projects */}
            {project.demos && project.demos.length > 0 && !isADHDProject && (
              <div>
                <h3 className="text-2xl font-semibold text-apple-gray-900 mb-4">
                  Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.demos.map((demo, index) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedProjectView;

