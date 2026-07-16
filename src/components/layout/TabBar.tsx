interface TabDefinition<T extends string> {
  readonly id: T;
  readonly label: string;
  readonly icon: string;
}

interface TabBarProps<T extends string> {
  readonly tabs: readonly TabDefinition<T>[];
  readonly active: T;
  readonly onChange: (tab: T) => void;
  readonly label: string;
}

export function TabBar<T extends string>({ tabs, active, onChange, label }: TabBarProps<T>) {
  return (
    <nav className="tab-bar" aria-label={label}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={tab.id === active ? 'tab-bar__item tab-bar__item--active' : 'tab-bar__item'}
          type="button"
          aria-current={tab.id === active ? 'page' : undefined}
          onClick={() => onChange(tab.id)}
        >
          <span aria-hidden="true">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
