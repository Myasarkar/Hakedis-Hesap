
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { CommissionRecord } from './types';
import CommissionForm from './components/CommissionForm';
import CommissionList from './components/CommissionList';
import FilterControls from './components/FilterControls';
import ActionButtons from './components/ActionButtons';
import CompanyManager from './components/CompanyManager';
import ViewModeToggle from './components/ViewModeToggle';
import { GiftIcon } from './components/Icons';

const App: React.FC = () => {
    const [records, setRecords] = useState<CommissionRecord[]>([]);
    const [companyNames, setCompanyNames] = useState<string[]>([]);
    const [isCompanyManagerOpen, setCompanyManagerOpen] = useState(false);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        plate: '',
        company: '',
    });
    const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        try {
            const savedRecords = localStorage.getItem('commissionRecords');
            if (savedRecords) {
                const parsedRecords: CommissionRecord[] = JSON.parse(savedRecords);
                setRecords(parsedRecords);

                const savedCompanies = localStorage.getItem('companyNames');
                if (savedCompanies) {
                    setCompanyNames(JSON.parse(savedCompanies));
                } else {
                    const derivedCompanies = Array.from(new Set(parsedRecords.map(r => r.company))).sort();
                    setCompanyNames(derivedCompanies);
                }
            }
        } catch (error) {
            console.error("Yerel depolamadan veriler yüklenirken hata oluştu:", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('commissionRecords', JSON.stringify(records));
        } catch (error) {
            console.error("Kayıtlar yerel depolamaya kaydedilirken hata oluştu:", error);
        }
    }, [records]);
    
    useEffect(() => {
        try {
            // Firma listesindeki değişikliklerin (silme dahil) kalıcı olması için her zaman kaydet.
            localStorage.setItem('companyNames', JSON.stringify(companyNames));
        } catch (error) {
            console.error("Firma adları yerel depolamaya kaydedilirken hata oluştu:", error);
        }
    }, [companyNames]);

    const addRecord = useCallback((newRecord: Omit<CommissionRecord, 'id'>) => {
        const recordWithId: CommissionRecord = { ...newRecord, id: new Date().toISOString() + Math.random() };
        setRecords(prevRecords => [recordWithId, ...prevRecords]);
        
        const newCompany = newRecord.company.trim();
        if (newCompany && !companyNames.some(c => c.toLowerCase() === newCompany.toLowerCase())) {
            setCompanyNames(prev => [...prev, newCompany].sort());
        }
    }, [companyNames]);

    const deleteRecord = useCallback((id: string) => {
        if (window.confirm('Bu kaydı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
        }
    }, []);
    
    const handleAddCompany = useCallback((name: string) => {
        // Doğrulama artık CompanyManager bileşeni içinde yapılıyor.
        const trimmedName = name.trim();
        if (trimmedName && !companyNames.some(c => c.toLowerCase() === trimmedName.toLowerCase())) {
            setCompanyNames(prev => [...prev, trimmedName].sort());
        }
    }, [companyNames]);

    const handleDeleteCompany = useCallback((nameToDelete: string) => {
        // Onaylama işlemi artık CompanyManager bileşeni içinde yapılıyor.
        setCompanyNames(prev => prev.filter(c => c !== nameToDelete));
    }, []);
    
    const filteredRecords = useMemo(() => {
        const normalizePlate = (plate: string) => plate.replace(/\s/g, '').toLowerCase();

        return records.filter(record => {
            const recordDate = new Date(record.date);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;

            if (startDate && recordDate < startDate) return false;
            if (endDate && recordDate > endDate) return false;
            if (filters.plate && !normalizePlate(record.plate).includes(normalizePlate(filters.plate))) return false;
            if (filters.company && record.company !== filters.company) return false;
            
            return true;
        });
    }, [records, filters]);
    
    const totalCommission = useMemo(() => {
        return filteredRecords.reduce((sum, record) => sum + record.commission, 0);
    }, [filteredRecords]);

    const handleDownload = useCallback(() => {
        const dataStr = JSON.stringify({records, companyNames}, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'hakedis-verileri.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }, [records, companyNames]);

    const handleUploadClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    const data = JSON.parse(text);
                    const recordsToLoad = Array.isArray(data) ? data : data.records;
                    const companiesToLoad = data.companyNames || [];

                    if (Array.isArray(recordsToLoad) && recordsToLoad.every(item => 'id' in item && 'date' in item && 'plate' in item)) {
                        setRecords(recordsToLoad);
                        if (Array.isArray(companiesToLoad) && companiesToLoad.length > 0) {
                            setCompanyNames(companiesToLoad);
                        } else {
                             const derivedCompanies = Array.from(new Set(recordsToLoad.map(r => r.company))).sort();
                             setCompanyNames(derivedCompanies);
                        }
                        alert('Veri başarıyla yüklendi!');
                    } else {
                        throw new Error('Geçersiz dosya formatı.');
                    }
                }
            } catch (error) {
                console.error('Dosya okunurken veya parse edilirken hata:', error);
                alert('Hata: Yüklenen dosya geçerli bir JSON formatında değil veya beklenen yapıda değil.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }, []);


    return (
        <div className="min-h-screen text-slate-800">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <GiftIcon className="h-8 w-8 text-rose-500" />
                        <h1 className="text-2xl font-bold text-slate-700">Hakediş Takip Sistemi</h1>
                    </div>
                    <ActionButtons onDownload={handleDownload} onUpload={handleUploadClick} />
                </div>
            </header>
            <main className="container mx-auto p-4">
                <div className={
                    viewMode === 'mobile'
                        ? "grid grid-cols-1 gap-8"
                        : "grid grid-cols-1 lg:grid-cols-3 gap-8"
                }>
                    <div className="lg:col-span-1">
                        <CommissionForm 
                            onSubmit={addRecord} 
                            companyNames={companyNames} 
                            onManageCompanies={() => setCompanyManagerOpen(true)}
                            viewMode={viewMode}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <FilterControls 
                            filters={filters} 
                            onFilterChange={setFilters} 
                            totalCommission={totalCommission}
                            companyNames={companyNames}
                        />
                        <CommissionList records={filteredRecords} onDeleteRecord={deleteRecord} />
                    </div>
                </div>
            </main>
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
            />
            <CompanyManager
                isOpen={isCompanyManagerOpen}
                onClose={() => setCompanyManagerOpen(false)}
                companies={companyNames}
                onAdd={handleAddCompany}
                onDelete={handleDeleteCompany}
            />
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
    );
};

export default App;
