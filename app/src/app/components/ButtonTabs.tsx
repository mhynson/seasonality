interface IButtonTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: { label: string; key: string }[];
}

const buttonClasses = "p-4 rounded-l ";
const buttonColor = "bg-indigo-600";
const buttonColorActive = "bg-indigo-800";

export const ButtonTabs = (props: IButtonTabsProps) => {
  const { activeTab, setActiveTab, tabs } = props;
  return (
    <div className="text-white">
      {tabs.map(({ label, key }) => (
        <button
          key={key}
          className={`${buttonClasses} ${
            activeTab === key ? buttonColorActive : buttonColor
          }`}
          onClick={() => setActiveTab(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
