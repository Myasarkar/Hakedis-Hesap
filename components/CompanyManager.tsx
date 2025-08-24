
import React, { useState, useEffect } from 'react';
import { XMarkIcon, TrashIcon, PlusCircleIcon, BuildingOfficeIcon } from './Icons';

interface CompanyManagerProps {
    isOpen: boolean;
    onClose: () => void;
    companies: string[];
    onAdd: (name: string) => void;
    onDelete: (name: string) => void;
}

const CompanyManager: React.FC<CompanyManagerProps> = ({ isOpen, onClose, companies, onAdd, onDelete }) => {
    const [newCompanyName, setNewCompanyName] = useState('');
    const [error, setError] = useState('');
    const [pendingDelete, setPendingDelete] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setNewCompanyName('');
            setError('');
            setPendingDelete(null);
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleAddCompany = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = newCompanyName.trim();
        if (!trimmedName) {
            setError('Firma adı boş olamaz.');
            return;
        }
        if (companies.some(c => c.toLowerCase() === trimmedName.toLowerCase())) {
            setError('Bu firma zaten listede mevcut.');
            return;
        }
        
        onAdd(trimmedName);
        setNewCompanyName('');
        setError('');
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCompanyName(e.target.value);
        if (error) {
            setError('');
        }
    };

    const handleDelete = (companyName: string) => {
        onDelete(companyName);
        setPendingDelete(null);
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" 
            aria-modal="true" 
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-slate-50 rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all flex flex-col max-h-[90vh]" 
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-4 border-b bg-white rounded-t-lg flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <BuildingOfficeIcon className="h-6 w-6 text-rose-500" />
                        <h2 className="text-lg font-semibold text-slate-700">Firmaları Yönet</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-slate-100 transition-colors"
                        aria-label="Kapat"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </header>
                
                <main className="p-6 flex-grow overflow-y-auto">
                    <form onSubmit={handleAddCompany} className="mb-6">
                        <label htmlFor="new-company-name" className="block text-sm font-medium text-gray-700 mb-1">Yeni Firma Ekle</label>
                        <div className="flex gap-2">
                             <input
                                id="new-company-name"
                                type="text"
                                value={newCompanyName}
                                onChange={handleInputChange}
                                placeholder="Firma adını yazın..."
                                className="flex-grow block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                                aria-label="Yeni firma adı"
                            />
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
                                aria-label="Yeni firma ekle"
                            >
                               <PlusCircleIcon className="h-5 w-5"/>
                               <span className="hidden sm:inline">Ekle</span>
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </form>
                    
                    <div className="max-h-72 overflow-y-auto -mx-1 px-1">
                        <ul className="space-y-2">
                            {companies.length > 0 ? companies.map(company => (
                                <li key={company} className="bg-white p-2 rounded-md shadow-sm border transition-shadow hover:shadow-md">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-800 font-medium">{company}</span>
                                        {pendingDelete !== company && (
                                            <button 
                                                onClick={() => setPendingDelete(company)}
                                                className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                aria-label={`${company} adlı firmayı sil`}
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                    {pendingDelete === company && (
                                        <div className="mt-2 pt-2 border-t border-red-100">
                                            <p className="text-xs text-center text-red-800 mb-2">
                                                Bu firmayı silmek, sadece seçim listesinden kaldırır. Mevcut kayıtlar etkilenmez. <strong>Emin misiniz?</strong>
                                            </p>
                                            <div className="flex justify-end items-center gap-2">
                                                <button
                                                    onClick={() => setPendingDelete(null)}
                                                    className="text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md transition-colors"
                                                >
                                                    İptal
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(company)}
                                                    className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-1 rounded-md transition-colors"
                                                >
                                                    Sil
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            )) : (
                                <div className="text-center text-gray-500 py-8">
                                    <BuildingOfficeIcon className="h-12 w-12 mx-auto text-slate-300" />
                                    <p className="mt-2 font-semibold">Henüz firma eklenmemiş.</p>
                                    <p className="text-sm">Yukarıdaki alandan yeni firma ekleyebilirsiniz.</p>
                                </div>
                            )}
                        </ul>
                    </div>
                </main>

                <footer className="flex justify-end p-4 border-t bg-white rounded-b-lg flex-shrink-0">
                     <button 
                        onClick={onClose} 
                        className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
                    >
                        Kapat
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default CompanyManager;
