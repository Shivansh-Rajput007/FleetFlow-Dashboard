import React, { useState } from 'react';
import { Wrench, Plus, History, Truck, AlertTriangle, Calendar, Search, WrenchIcon } from 'lucide-react';
import useStore from '../store/useStore';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

const Maintenance = () => {
    const { vehicles, maintenanceLogs, addMaintenance } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        vehicleId: '',
        serviceType: 'Routine Inspection',
        description: '',
        date: new Date().toISOString().split('T')[0],
        cost: '',
    });

    const handleSave = (e) => {
        e.preventDefault();
        addMaintenance({
            ...formData,
            cost: Number(formData.cost)
        });
        toast.success('Service log recorded. Vehicle status updated.');
        setIsModalOpen(false);
        setFormData({
            vehicleId: '',
            serviceType: 'Routine Inspection',
            description: '',
            date: new Date().toISOString().split('T')[0],
            cost: '',
        });
    };

    const inShopCount = vehicles.filter(v => v.status === 'In Shop').length;

    const columns = [
        {
            header: 'Vehicle',
            render: (log) => {
                const vehicle = vehicles.find(v => v.id === parseInt(log.vehicleId));
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs italic">FF</div>
                        <span className="font-bold text-slate-800">{vehicle?.name || `Vehicle #${log.vehicleId}`}</span>
                    </div>
                );
            }
        },
        {
            header: 'Service Type',
            render: (log) => <Badge variant="info">{log.serviceType}</Badge>
        },
        {
            header: 'Description',
            accessor: 'description',
            render: (log) => <span className="text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] block">{log.description}</span>
        },
        {
            header: 'Logged Date',
            render: (log) => <span className="font-mono text-xs font-bold text-slate-400">{log.date}</span>
        },
        {
            header: 'Cost',
            render: (log) => <span className="font-black text-slate-900">${log.cost.toLocaleString()}</span>
        }
    ];

    return (
        <div className="space-y-20 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Maintenance & Service</h1>
                    <p className="text-slate-500 text-sm font-medium">Lifecycle management and repair tracking</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} icon={Plus}>Log New Service</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-0 overflow-hidden" title="Service History">
                    <Table
                        columns={columns}
                        data={maintenanceLogs}
                        emptyTitle="No logs found"
                        emptyDescription="Keep your fleet running smoothly by logging every service event."
                    />
                </Card>

                <div className="space-y-6">
                    <Card title="Vehicles In Shop" className="border-l-4 border-l-danger">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-4xl font-black text-slate-800">{inShopCount}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Currently undergoing repair</p>
                            </div>
                            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                                <AlertTriangle size={24} />
                            </div>
                        </div>
                    </Card>

                    <Card title="Recurring Tasks" subtitle="Upcoming scheduled maintenance">
                        <div className="space-y-4 mt-4">
                            {[
                                { task: 'Oil Change', vehicle: 'Volvo FF-1001', due: 'In 2 days' },
                                { task: 'Brake Check', vehicle: 'MAN FF-1004', due: 'Overdue' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{item.task}</p>
                                        <p className="text-[10px] font-medium text-slate-500">{item.vehicle}</p>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-tighter ${item.due === 'Overdue' ? 'text-red-500' : 'text-orange-500'}`}>
                                        {item.due}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Service">
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Vehicle</label>
                            <select
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none appearance-none font-medium"
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
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Service Type</label>
                            <select
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none appearance-none font-medium"
                                value={formData.serviceType}
                                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                            >
                                <option value="Routine Inspection">Routine Inspection</option>
                                <option value="Brake Service">Brake Service</option>
                                <option value="Engine Repair">Engine Repair</option>
                                <option value="Oil Change">Oil Change</option>
                                <option value="Tire Replacement">Tire Replacement</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Service Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Cost ($)</label>
                            <input
                                type="number"
                                required
                                placeholder="0.00"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Service Description</label>
                            <textarea
                                rows="3"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium resize-none"
                                placeholder="Describe the work performed..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="secondary" className="flex-1" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button className="flex-1" type="submit">Log Service</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Maintenance;
