import React, { useState, useEffect } from 'react';
import DeepDiveModal from './DeepDiveModal';

interface HeroIntelModalProps {
  intelFeedSelector?: string;
  intelFeedContent?: string;
  intelUrl?: string | { url?: string; name?: string; target?: string };
  // Modal header configuration
  modalTitle?: string;
  modalSubtitle?: string;
  technicalReportVersion?: string;
  author?: string;
  speaker?: string;
  date?: string;
  node?: string;
  refId?: string;
  classifiedLabel?: string;
}

const HeroIntelModal: React.FC<HeroIntelModalProps> = ({ 
  intelFeedSelector, 
  intelFeedContent,
  intelUrl,
  modalTitle,
  modalSubtitle,
  technicalReportVersion,
  author,
  speaker,
  date,
  node,
  refId,
  classifiedLabel
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Find the intel feed element by ID (most reliable)
    const intelFeed = document.getElementById('intel-feed-trigger') || 
                      (intelFeedSelector ? document.querySelector(intelFeedSelector) : null);
    
    if (!intelFeed) {
      // Fallback: try to find by class or text content
      const fallback = document.querySelector('[class*="group/intel"]') ||
                       document.querySelector('[class*="intel"]');
      if (!fallback) return;
      
      const handleClick = () => {
        setIsModalOpen(true);
      };
      
      fallback.addEventListener('click', handleClick);
      return () => {
        fallback.removeEventListener('click', handleClick);
      };
    }

    const handleClick = () => {
      setIsModalOpen(true);
    };

    intelFeed.addEventListener('click', handleClick);

    return () => {
      intelFeed?.removeEventListener('click', handleClick);
    };
  }, [intelFeedSelector]);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleJoin = () => {
    // Use the URL from Umbraco if provided
    if (intelUrl) {
      const url = typeof intelUrl === 'string' ? intelUrl : intelUrl.url;
      if (url) {
        const target = typeof intelUrl === 'object' && intelUrl.target ? intelUrl.target : '_self';
        if (target === '_blank') {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = url;
        }
        setIsModalOpen(false);
        return;
      }
    }
    
    // Fallback: Scroll to join section or open join modal
    const joinSection = document.querySelector('[id*="join"]') || document.querySelector('[id*="contact"]');
    if (joinSection) {
      joinSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsModalOpen(false);
  };

  // Extract button text from URL picker
  const buttonText = intelUrl 
    ? (typeof intelUrl === 'string' ? 'JOIN_SESSION' : (intelUrl.name || 'JOIN_SESSION'))
    : '';

  return (
    <DeepDiveModal 
      isOpen={isModalOpen} 
      onClose={handleClose} 
      onJoin={handleJoin}
      content={intelFeedContent}
      joinButtonText={buttonText}
      modalTitle={modalTitle}
      modalSubtitle={modalSubtitle}
      technicalReportVersion={technicalReportVersion}
      author={author}
      speaker={speaker}
      date={date}
      node={node}
      refId={refId}
      classifiedLabel={classifiedLabel}
    />
  );
};

export default HeroIntelModal;

