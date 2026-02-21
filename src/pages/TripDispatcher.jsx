import React, { useState } from 'react';
import { Plus, MapPin, Truck, User, Package, Calendar, Search, Filter, AlertCircle, CheckCircle2, Navigation2, FileCheck } from 'lucide-react';
import useStore from '../store/useStore';
import { validateCargoCapacity, validateDriverEligibility, validateVehicleAvailability } from '../utils/rules';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

const TripDispatcher = () => {
    const { trips, vehicles, drivers, addTrip, dispatchTrip, completeTrip } = useStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);

    const [formData, setFormData] = useState({
        vehicleId: '',
        driverId: '',
        cargoWeight: '',
        destination: '',
        revenue: '',
    });

    const [completeData, setCompleteData] = useState({
        odometer: '',
    });

    const handleCreateTrip = (e) => {
        e.preventDefault();

        const vehicle = vehicles.find(v => v.id === parseInt(formData.vehicleId));
        const driver = drivers.find(d => d.id === parseInt(formData.driverId));

        // 1. Validate Capacity
        const capacityCheck = validateCargoCapacity(vehicle, Number(formData.cargoWeight));
        if (!capacityCheck.isValid) {
            toast.error(capacityCheck.message);
            return;
        }

        // 2. Validate Vehicle Availability
        const vehicleCheck = validateVehicleAvailability(vehicle);
        if (!vehicleCheck.isValid) {
            toast.error(vehicleCheck.message);
            return;
        }

        // 3. Validate Driver Eligibility
        const driverCheck = validateDriverEligibility(driver);
        if (!driverCheck.isValid) {
            toast.error(driverCheck.message);
            return;
        }

        addTrip({
            ...formData,
            vehicleId: parseInt(formData.vehicleId),
            driverId: parseInt(formData.driverId),
            cargoWeight: Number(formData.cargoWeight),
            revenue: Number(formData.revenue),
        });

        toast.success('Trip draft created successfully');
        setIsCreateModalOpen(false);
        setFormData({ vehicleId: '', driverId: '', cargoWeight: '', destination: '', revenue: '' });
    };

    const handleDispatch = (id) => {
        dispatchTrip(id);
        toast.success('Trip dispatched! Vehicle and Driver status updated.');
    };

    const handleOpenCompleteModal = (trip) => {
        setSelectedTrip(trip);
        const vehicle = vehicles.find(v => v.id === trip.vehicleId);
        setCompleteData({ odometer: vehicle.odometer + 500 }); // Suggesting a default increase
        setIsCompleteModalOpen(true);
    };

    const handleComplete = (e) => {
        e.preventDefault();
        completeTrip(selectedTrip.id, Number(completeData.odometer));
        toast.success('Trip marked as COMPLETED. Revenue logged and fleet updated.');
        setIsCompleteModalOpen(false);
    };

    const columns = [
        {
            header: 'Destination',
            render: (t) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <MapPin size={16} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{t.destination}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Priority Route</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Fleet Assigned',
            render: (t) => {
                const v = vehicles.find(v => v.id === t.vehicleId);
                const d = drivers.find(d => d.id === t.driverId);
                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <Truck size={14} className="text-slate-400" /> {v?.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <User size={14} className="text-slate-400" /> {d?.name}
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Cargo Weight',
            render: (t) => (
                <div className="flex items-center gap-2">
                    <Package size={14} className="text-slate-400" />
                    <span className="font-mono font-bold text-slate-600">{t.cargoWeight.toLocaleString()} KG</span>
                </div>
            )
        },
        {
            header: 'Status',
            render: (t) => {
                const variants = {
                    'Draft': 'warning',
                    'Dispatched': 'info',
                    'Completed': 'success'
                };
                return <Badge variant={variants[t.status]}>{t.status}</Badge>;
            }
        },
        {
            header: 'Revenue',
            render: (t) => <span className="font-black text-slate-900">${t.revenue.toLocaleString()}</span>
        },
        {
            header: 'Actions',
            render: (t) => (
                <div className="flex items-center gap-2">
                    {t.status === 'Draft' && (
                        <Button variant="primary" size="sm" onClick={() => handleDispatch(t.id)}>Dispatch</Button>
                    )}
                    {t.status === 'Dispatched' && (
                        <Button variant="outline" size="sm" onClick={() => handleOpenCompleteModal(t)}>Complete</Button>
                    )}
                    {t.status === 'Completed' && (
                        <CheckCircle2 size={20} className="text-green-500 ml-4" />
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-20 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Trip Dispatcher</h1>
                    <p className="text-slate-500 text-sm font-medium">Coordinate logistics and monitor active shipments</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} icon={Plus}>Create New Trip</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Active Trips', value: trips.filter(t => t.status === 'Dispatched').length, icon: Navigation2, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Drafts', value: trips.filter(t => t.status === 'Draft').length, icon: FileCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Avg Weight', value: '16.5T', icon: Package, color: 'text-slate-600', bg: 'bg-slate-50' },
                    { label: 'Fleet Ready', value: vehicles.filter(v => v.status === 'Available').length, icon: Truck, color: 'text-green-600', bg: 'bg-green-50' },
                ].map((stat, i) => (
                    <Card key={i} className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-0 overflow-hidden" title="Dispatch Board">
                <Table columns={columns} data={trips} />
            </Card>

            {/* Create Trip Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Trip Draft">
                <form onSubmit={handleCreateTrip} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Destination</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="City, State / ZIP"
                                    value={formData.destination}
                                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Vehicle</label>
                            <select
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
                                value={formData.vehicleId}
                                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                            >
                                <option value="">Select vehicle...</option>
                                {vehicles.map(v => (
                                    <option key={v.id} value={v.id}>{v.name} ({v.plate})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Driver</label>
                            <select
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
                                value={formData.driverId}
                                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                            >
                                <option value="">Select driver...</option>
                                {drivers.map(d => (
                                    <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Cargo Weight (KG)</label>
                            <input
                                type="number"
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="e.g. 15000"
                                value={formData.cargoWeight}
                                onChange={(e) => setFormData({ ...formData, cargoWeight: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Est. Revenue ($)</label>
                            <input
                                type="number"
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="e.g. 3500"
                                value={formData.revenue}
                                onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="secondary" className="flex-1" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button className="flex-1" type="submit">Create Draft</Button>
                    </div>
                </form>
            </Modal>

            {/* Complete Trip Modal */}
            <Modal isOpen={isCompleteModalOpen} onClose={() => setIsCompleteModalOpen(false)} title="Complete Trip & Log Data">
                <form onSubmit={handleComplete} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Final Odometer Reading (KM)</label>
                        <input
                            type="number"
                            required
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                            value={completeData.odometer}
                            onChange={(e) => setCompleteData({ ...completeData, odometer: e.target.value })}
                        />
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Current odometer: {vehicles.find(v => v.id === selectedTrip?.vehicleId)?.odometer} KM</p>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="secondary" className="flex-1" type="button" onClick={() => setIsCompleteModalOpen(false)}>Back</Button>
                        <Button className="flex-1" type="submit">Finalize Trip</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TripDispatcher;
