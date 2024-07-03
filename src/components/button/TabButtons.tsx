import { Dispatch, SetStateAction } from 'react';

interface TabButtonsProps {
  activeTab: 'followers' | 'following';
  setActiveTab: Dispatch<SetStateAction<'followers' | 'following'>>;
  tabs: { id: string; label: string }[];
}

const TabButtons: React.FC<TabButtonsProps> = ({
  activeTab,
  setActiveTab,
  tabs,
}) => {
  return (
    <div className="flex justify-between rounded-lg pb-10 font-godob">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as 'followers' | 'following')}
          className={`flex-1 py-3 rounded-t-lg ${
            activeTab === tab.id
              ? 'bg-primary text-white'
              : 'bg-white text-primary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabButtons;
