
import React from 'react';
import { DownloadIcon, UploadIcon } from './Icons';

interface ActionButtonsProps {
    onDownload: () => void;
    onUpload: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onDownload, onUpload }) => {
    return (
        <div className="flex items-center gap-2">
            <button 
                onClick={onUpload}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
            >
                <UploadIcon className="h-5 w-5"/>
                JSON Yükle
            </button>
            <button 
                onClick={onDownload}
                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
            >
                <DownloadIcon className="h-5 w-5"/>
                JSON İndir
            </button>
        </div>
    );
};

export default ActionButtons;
