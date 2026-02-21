import React, { useState } from 'react';
import { DollarSign, Fuel, TrendingUp, Plus, Calendar, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import useStore from '../store/useStore';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { calculateFuelEfficiency } from '../utils/rules';
import toast from 'react-hot-toast';

const Expenses = () => {
    const { expenses, vehicles, addExpense } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        vehicleId: '',
        type: 'Fuel',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        liters: '',
        odometer: '',
    });

    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const fuelExpenses = expenses.filter(e => e.type === 'Fuel').reduce((sum, e) => sum + Number(e.amount), 0);

    const handleSave = (e) => {
        e.preventDefault();
        addExpense({
            ...formData,
            amount: Number(formData.amount),
            liters: formData.type === 'Fuel' ? Number(formData.liters) : null,
            odometer: Number(formData.odometer)
        });
        toast.success('Expense logged successfully');
        setIsModalOpen(false);
        setFormData({
            vehicleId: '',
            type: 'Fuel',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            liters: '',
            odometer: '',
        });
    };

    const columns = [
        {
            header: 'Date',
            render: (e) => <span className="font-mono text-slate-500 font-bold">{e.date}</span>
        },
        {
            header: 'Vehicle',
            render: (e) => {
                const v = vehicles.find(v => v.id === parseInt(e.vehicleId));
                return <span className="font-bold text-slate-800">{v?.name || `Vehicle #${e.vehicleId}`}</span>;
            }
        },
        {
            header: 'Type',
            render: (e) => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${e.type === 'Fuel' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                    <span className="font-bold text-slate-600">{e.type}</span>
                </div>
            )
        },
        {
            header: 'Efficiency',
            render: (e) => {
                if (e.type !== 'Fuel' || !e.liters) return <span className="text-slate-300">-</span>;
                // Historical mock logic
                const efficiency = (e.amount / e.liters).toFixed(2);
                return <span className="font-mono text-xs font-bold text-slate-500">${efficiency}/L</span>;
            }
        },
        {
            header: 'Amount',
            render: (e) => <span className="font-black text-slate-900">${e.amount.toLocaleString()}</span>
        }
    ];

    return (
        <div className="space-y-20 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Financial Operations</h1>
                    <p className="text-slate-500 text-sm font-medium">Tracking fuel efficiency and operational costs</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} icon={Plus}>Log New Expense</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary-600">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Expenditure</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-900">${totalExpenses.toLocaleString()}</span>
                        <span className="text-xs font-bold text-red-500 flex items-center">
                            <ArrowUpRight size={14} /> 8.4%
                        </span>
                    </div>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Fuel Costs</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-900">${fuelExpenses.toLocaleString()}</span>
                        <span className="text-xs font-bold text-green-500 flex items-center">
                            <ArrowDownRight size={14} /> 2.1%
                        </span>
                    </div>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Efficiency Avg</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-900">32.4</span>
                        <span className="text-xs font-bold text-slate-500 ml-1">L/100km</span>
                    </div>
                </Card>
            </div>

            <Card className="p-0 overflow-hidden" title="Expense Logs">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm font-medium"
                        />
                    </div>
                </div>
                <Table columns={columns} data={expenses} emptyTitle="No expenses logged" emptyDescription="Start tracking your fleet costs by adding your first expense record." />
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Expense">
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Vehicle</label>
                            <select
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
                                value={formData.vehicleId}
                                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                            >
                                <option value="">Select a vehicle...</option>
                                {vehicles.map(v => (
                                    <option key={v.id} value={v.id}>{v.name} ({v.plate})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Expense Type</label>
                            <select
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Fuel">Fuel</option>
                                <option value="Repair">Repair</option>
                                <option value="Toll">Toll</option>
                                <option value="Fine">Fine/Ticket</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Amount ($)</label>
                            <input
                                type="number"
                                required
                                placeholder="0.00"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Current KM</label>
                            <input
                                type="number"
                                required
                                placeholder="124000"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                value={formData.odometer}
                                onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                            />
                        </div>
                        {formData.type === 'Fuel' && (
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Liters (for efficiency calculation)</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="400"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={formData.liters}
                                    onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="secondary" className="flex-1" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button className="flex-1" type="submit">Log Expense</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Expenses;
