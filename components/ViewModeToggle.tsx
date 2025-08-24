
import React from 'react';
import { ComputerDesktopIcon, DevicePhoneMobileIcon } from './Icons';

type ViewMode = 'mobile' | 'desktop';

interface ViewModeToggleProps {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, setViewMode }) => {
    const isMobileView = viewMode === 'mobile';

    const toggleViewMode = () => {
        setViewMode(isMobileView ? 'desktop' : 'mobile');
    };

    const label = isMobileView ? 'Masaüstü Modu' : 'Mobil Mod';
    const Icon = isMobileView ? ComputerDesktopIcon : DevicePhoneMobileIcon;

    return (
        <button
            onClick={toggleViewMode}
            className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-lg text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-transform hover:scale-105"
            aria-label={`Geçiş yap: ${label}`}
        >
            <Icon className="h-5 w-5" />
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
};

export default ViewModeToggle;
