'use client';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  icon: React.ReactNode;
}

export function ToggleSwitch({ checked, onChange, label, icon }: ToggleSwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`
        relative flex items-center w-full p-3 rounded-xl 
        ${checked ? 'bg-gray-900 flex-row-reverse  text-white' : 'bg-gray-200 text-gray-900'}
        transition-colors duration-200 cursor-pointer
      `}
    >
      <div className={`
        flex items-center gap-3 
        ${checked ? 'order-2' : 'order-1'}
      `}>
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      
      <div className={`
        w-10 h-6 rounded-full p-1
        ${checked ? 'bg-gray-700 order-1' : 'bg-white border border-gray-200 order-2'} 
        transition-colors duration-200 ml-auto
      `}>
        <div className={`
          h-4 w-4 rounded-full 
          ${checked ? 'bg-white translate-x-4' : 'bg-gray-500 translate-x-0'}
          transition-all duration-200
        `} />
      </div>
    </button>
  );
}