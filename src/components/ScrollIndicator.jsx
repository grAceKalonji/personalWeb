import { useState, useEffect, useRef } from 'react';

const ScrollIndicator = () => {
  const [currentSection, setCurrentSection] = useState('hero');
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const isLockedRef = useRef(false);

  const sections = ['hero', 'projects', 'contact'];

  // Detect which section is currently in view - optimized for responsiveness
  useEffect(() => {
    let ticking = false;

    const detectSection = () => {
      if (isScrolling || isLockedRef.current) {
        ticking = false;
        return;
      }

      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const heroSection = document.getElementById('hero');
      const projectsSection = document.getElementById('projects');
      const contactSection = document.getElementById('contact');

      if (!heroSection || !projectsSection || !contactSection) {
        ticking = false;
        return;
      }

      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      const projectsBottom = projectsSection.offsetTop + projectsSection.offsetHeight;

      let newSection = 'hero';
      if (scrollPosition < heroBottom) {
        newSection = 'hero';
      } else if (scrollPosition < projectsBottom) {
        newSection = 'projects';
      } else {
        newSection = 'contact';
      }

      // Only update if section changed
      setCurrentSection((prev) => {
        if (prev !== newSection) {
          return newSection;
        }
        return prev;
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(detectSection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    detectSection(); // Initial detection

    return () => window.removeEventListener('scroll', onScroll);
  }, [isScrolling]);

  // Lock scroll to current section after clicking indicator - optimized
  useEffect(() => {
    if (!isLockedRef.current) return;

    let scrollTimeout;
    const currentElement = document.getElementById(currentSection);
    if (!currentElement) return;

    const lockToSection = () => {
      const elementTop = currentElement.offsetTop;
      const scrollTop = window.scrollY;
      const threshold = 50; // Allow small deviations

      // If scrolled away from the section, snap back
      if (Math.abs(scrollTop - elementTop) > threshold) {
        window.scrollTo({ 
          top: elementTop, 
          behavior: 'smooth' 
        });
      }
    };

    // Check less frequently but still responsive (reduced from 100ms to 150ms)
    scrollTimeout = setInterval(lockToSection, 150);

    // Unlock after a shorter delay (reduced from 2000ms to 1200ms)
    const unlockTimeout = setTimeout(() => {
      isLockedRef.current = false;
      clearInterval(scrollTimeout);
    }, 1200);

    return () => {
      clearInterval(scrollTimeout);
      clearTimeout(unlockTimeout);
    };
  }, [currentSection, isLockedRef]);

  const handleScrollDown = () => {
    if (isScrolling) return;

    const currentIndex = sections.indexOf(currentSection);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= sections.length) return; // Already at last section

    const nextSection = sections[nextIndex];
    const nextElement = document.getElementById(nextSection);

    if (!nextElement) return;

    // Immediately update section and disable button
    setIsScrolling(true);
    isLockedRef.current = true;
    setCurrentSection(nextSection);

    // Scroll to next section
    nextElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });

    // Re-enable after scroll animation completes
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
      
      // Unlock scroll after a shorter delay
      setTimeout(() => {
        isLockedRef.current = false;
      }, 300);
    }, 600);
  };

  const handleScrollUp = () => {
    if (isScrolling) return;

    const currentIndex = sections.indexOf(currentSection);
    const prevIndex = currentIndex - 1;

    if (prevIndex < 0) return; // Already at first section

    const prevSection = sections[prevIndex];
    const prevElement = document.getElementById(prevSection);

    if (!prevElement) return;

    // Immediately update section and disable button
    setIsScrolling(true);
    isLockedRef.current = true;
    setCurrentSection(prevSection);

    // Scroll to previous section
    prevElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });

    // Re-enable after scroll animation completes
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
      
      // Unlock scroll after a shorter delay
      setTimeout(() => {
        isLockedRef.current = false;
      }, 300);
    }, 600);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const isFirstSection = currentSection === 'hero';
  const isLastSection = currentSection === 'contact';

  // Show up arrow when not on first section, down arrow when not on last section
  return (
    <>
      {/* Down Arrow - Show when not on last section */}
      {!isLastSection && (
        <button
          onClick={handleScrollDown}
          className="
            fixed
            bottom-8
            left-1/2
            transform
            -translate-x-1/2
            z-50
            group
            transition-all
            duration-500
            ease-out
            hover:translate-y-[-8px]
            focus:outline-none
            focus:ring-2
            focus:ring-apple-gray-300
            focus:ring-offset-2
            rounded-full
            px-7
            py-5
            disabled:opacity-50
            disabled:cursor-not-allowed
            shadow-sm
            min-w-[64px]
            min-h-[56px]
            flex
            items-center
            justify-center
          "
          disabled={isScrolling}
          aria-label={`Scroll to ${sections[sections.indexOf(currentSection) + 1] || 'next'} section`}
        >
          <div className="relative">
            {/* Transparent background with blur */}
            <div
              className="
                absolute
                inset-0
                bg-white/30
                backdrop-blur-md
                rounded-full
                border
                border-white/50
                transition-all
                duration-300
                group-hover:bg-white/50
              "
            />
            {/* Down Arrow icon */}
            <svg
              className="
                relative
                w-6
                h-6
                text-apple-gray-700
                transition-transform
                duration-500
                group-hover:translate-y-[-4px]
                animate-bounce
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </button>
      )}

      {/* Up Arrow - Show when not on first section */}
      {!isFirstSection && (
        <button
          onClick={handleScrollUp}
          className="
            fixed
            top-8
            left-1/2
            transform
            -translate-x-1/2
            z-50
            group
            transition-all
            duration-500
            ease-out
            hover:translate-y-[8px]
            focus:outline-none
            focus:ring-2
            focus:ring-apple-gray-300
            focus:ring-offset-2
            rounded-full
            px-7
            py-5
            disabled:opacity-70
            disabled:cursor-not-allowed
            shadow-sm
            min-w-[64px]
            min-h-[56px]
            flex
            items-center
            justify-center
          "
          disabled={isScrolling}
          aria-label={`Scroll to ${sections[sections.indexOf(currentSection) - 1] || 'previous'} section`}
        >
          <div className="relative">
            {/* Transparent background with blur */}
            <div
              className="
                absolute
                inset-0
                bg-white/30
                backdrop-blur-md
                rounded-full
                border
                border-white/50
                transition-all
                duration-300
                group-hover:bg-white/50
              "
            />
            {/* Up Arrow icon */}
            <svg
              className="
                relative
                w-6
                h-6
                text-apple-gray-700
                transition-transform
                duration-500
                group-hover:translate-y-[4px]
                animate-bounce
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
        </button>
      )}
    </>
  );
};

export default ScrollIndicator;
