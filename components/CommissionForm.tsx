
import React, { useState } from 'react';
import type { CommissionRecord } from '../types';
import { PlusCircleIcon, Cog6ToothIcon } from './Icons';

interface CommissionFormProps {
    onSubmit: (record: Omit<CommissionRecord, 'id'>) => void;
    companyNames: string[];
    onManageCompanies: () => void;
    viewMode: 'mobile' | 'desktop';
}

const CommissionForm: React.FC<CommissionFormProps> = ({ onSubmit, companyNames, onManageCompanies, viewMode }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [plate, setPlate] = useState('');
    const [company, setCompany] = useState('');
    const [spending, setSpending] = useState('');
    const [commission, setCommission] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !plate || !company || !spending || !commission) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }

        onSubmit({
            date,
            plate: plate.toUpperCase().trim(),
            company: company.trim(),
            spending: parseFloat(spending),
            commission: parseFloat(commission),
        });

        // Reset form
        setPlate('');
        setCompany('');
        setSpending('');
        setCommission('');
    };
    
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className={
            viewMode === 'desktop'
                ? "bg-white p-6 rounded-lg shadow-lg sticky top-4"
                : "bg-white p-6 rounded-lg shadow-lg"
        }>
            <h2 className="text-xl font-bold mb-4 text-slate-600 flex items-center gap-2">
                <PlusCircleIcon className="h-6 w-6"/>
                Yeni Kayıt Ekle
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Tarih</label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        max={today}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="plate" className="block text-sm font-medium text-gray-700">Plaka</label>
                    <input
                        id="plate"
                        type="text"
                        placeholder="Örn: 34 ABC 123"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Firma Adı</label>
                        <button
                            type="button"
                            onClick={onManageCompanies}
                            className="text-xs font-medium text-rose-600 hover:text-rose-800 flex items-center gap-1 p-1 rounded-md hover:bg-rose-50 transition-colors"
                            aria-label="Firma listesini yönet"
                        >
                            <Cog6ToothIcon className="h-4 w-4" />
                            Yönet
                        </button>
                    </div>
                    <input
                        id="company"
                        type="text"
                        list="company-names"
                        placeholder="Turizm firması"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                        required
                    />
                    <datalist id="company-names">
                        {companyNames.map((name, index) => <option key={index} value={name} />)}
                    </datalist>
                </div>
                <div>
                    <label htmlFor="spending" className="block text-sm font-medium text-gray-700">Yapılan Harcama (₺)</label>
                    <input
                        id="spending"
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={spending}
                        onChange={(e) => setSpending(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="commission" className="block text-sm font-medium text-gray-700">Hakediş Tutarı (₺)</label>
                    <input
                        id="commission"
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={commission}
                        onChange={(e) => setCommission(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
                >
                    Kaydı Ekle
                </button>
            </form>
        </div>
    );
};

export default CommissionForm;
