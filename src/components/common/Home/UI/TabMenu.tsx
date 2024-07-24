import React from 'react';

interface TabMenuProps {
  activeTab: 'details' | 'reviews';
  setActiveTab: (tab: 'details' | 'reviews') => void;
}

const TabMenu: React.FC<TabMenuProps> = ({ activeTab, setActiveTab }) => (
  <div className="flex justify-center mb-4 relative">
    <div className="flex">
      <button
        className={`mx-2 pb-2 relative z-10 ${
          activeTab === 'details'
            ? 'font-godob text-primary border-b-2 border-primary'
            : 'font-godob text-card-foreground'
        }`}
        onClick={() => setActiveTab('details')}
      >
        상세 정보
      </button>
      <button
        className={`mx-2 pb-2 relative z-10 ${
          activeTab === 'reviews'
            ? 'font-godob text-primary border-b-2 border-primary'
            : 'font-godob text-card-foreground'
        }`}
        onClick={() => setActiveTab('reviews')}
      >
        후기
      </button>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-[0.1px] bg-popover-foreground"></div>
  </div>
);

export default TabMenu;
