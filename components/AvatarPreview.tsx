
import React from 'react';

interface AvatarPreviewProps {
  svg: string;
}

const AvatarPreview: React.FC<AvatarPreviewProps> = ({ svg }) => {
  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-2xl flex items-center justify-center aspect-square">
      {svg ? (
        <div
          className="w-full h-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-brand-subtle">
          Loading Avatar...
        </div>
      )}
    </div>
  );
};

export default AvatarPreview;
