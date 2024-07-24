import React from 'react';

interface StructuredDescriptionProps {
  description: string;
}

const StructuredDescription: React.FC<StructuredDescriptionProps> = ({
  description,
}) => {
  const lines = description
    .split(/\r\n|\r|\n/)
    .filter(line => line.trim() !== '');

  return (
    <div className="p-4 rounded-lg bg-popover-foreground">
      {lines.map((line, index) => (
        <p key={index} className="text-[12px] mb-2 whitespace-pre-wrap">
          {line}
        </p>
      ))}
    </div>
  );
};

export default StructuredDescription;
