
import React from 'react';

interface FilterControlsProps {
    filters: {
        startDate: string;
        endDate: string;
        plate: string;
        company: string;
    };
    onFilterChange: React.Dispatch<React.SetStateAction<{
        startDate: string;
        endDate: string;
        plate: string;
        company: string;
    }>>;
    totalCommission: number;
    companyNames: string[];
}

const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFilterChange, totalCommission, companyNames }) => {
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onFilterChange(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Bitiş Tarihi</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="plate" className="block text-sm font-medium text-gray-700">Plaka Ara</label>
                    <input
                        type="text"
                        id="plate"
                        name="plate"
                        placeholder="Plaka girin..."
                        value={filters.plate}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">Firma Seç</label>
                    <select
                        id="company"
                        name="company"
                        value={filters.company}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    >
                        <option value="">Tüm Firmalar</option>
                        {companyNames.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex justify-between items-center">
                <span className="font-semibold text-lg text-rose-800">Toplam Hakediş:</span>
                <span className="font-bold text-2xl text-rose-600">{formatCurrency(totalCommission)}</span>
            </div>
        </div>
    );
};

export default FilterControls;
