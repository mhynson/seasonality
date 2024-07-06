interface IButtonTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: { label: string; key: string }[];
}

const buttonColor = "bg-indigo-600";
const buttonColorActive = "bg-indigo-800";

const getTabColor = (isActive: boolean): string =>
  isActive ? buttonColorActive : buttonColor;

const getRoundedClass = (index: number, length: number) => {
  const isFirst = index === 0;
  const isLast = index === length - 1;
  const classNames = [];
  if (isFirst) classNames.push("rounded-l");
  if (isLast) classNames.push("rounded-r");

  return classNames.join(" ");
};

export const ButtonTabs = (props: IButtonTabsProps) => {
  const { activeTab, setActiveTab, tabs } = props;
  return (
    <div className="text-white">
      {tabs.map(({ label, key }, idx) => (
        <button
          key={key}
          className={`p-4 ${getTabColor(activeTab === key)} ${getRoundedClass(
            idx,
            tabs.length
          )}`}
          onClick={() => setActiveTab(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
