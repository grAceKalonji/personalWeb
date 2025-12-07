const FolderIcon = ({ className = "" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Folder body */}
      <path
        d="M8 16C8 12.6863 10.6863 10 14 10H24L28 18H50C53.3137 18 56 20.6863 56 24V48C56 51.3137 53.3137 54 50 54H14C10.6863 54 8 51.3137 8 48V16Z"
        fill="url(#folderGradient)"
        className="transition-all duration-300"
      />
      {/* Folder tab */}
      <path
        d="M24 10H28L30 16H14C12.8954 16 12 16.8954 12 18V20C12 21.1046 12.8954 22 14 22H50C51.1046 22 52 21.1046 52 20V18C52 16.8954 51.1046 16 50 16H30L28 10H24Z"
        fill="url(#folderTabGradient)"
        className="transition-all duration-300"
      />
      <defs>
        <linearGradient id="folderGradient" x1="8" y1="10" x2="56" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4A90E2" />
          <stop offset="100%" stopColor="#357ABD" />
        </linearGradient>
        <linearGradient id="folderTabGradient" x1="12" y1="10" x2="52" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5BA3F5" />
          <stop offset="100%" stopColor="#4A90E2" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default FolderIcon;

