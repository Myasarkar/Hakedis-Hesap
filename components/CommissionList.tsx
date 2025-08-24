
import React from 'react';
import type { CommissionRecord } from '../types';
import { TrashIcon } from './Icons';

interface CommissionListProps {
    records: CommissionRecord[];
    onDeleteRecord: (id: string) => void;
}

const CommissionList: React.FC<CommissionListProps> = ({ records, onDeleteRecord }) => {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
             <h2 className="text-xl font-bold mb-4 text-slate-600">Kayıt Listesi</h2>
             <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plaka</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Firma</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Harcama</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hakediş</th>
                            <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {records.length > 0 ? (
                            records.map(record => (
                                <tr key={record.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(record.date)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.plate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.company}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(record.spending)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-rose-600 text-right">{formatCurrency(record.commission)}</td>
                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-center">
                                        <button 
                                            onClick={() => onDeleteRecord(record.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                            aria-label={`${record.plate} plakalı kaydı sil`}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                                    Filtre kriterlerine uygun kayıt bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                 </table>
             </div>
        </div>
    );
};

export default CommissionList;
