import React, { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, ShieldAlert, Truck } from 'lucide-react';
import useStore from '../store/useStore';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

const VehicleRegistry = () => {
    const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        plate: '',
        maxCapacity: '',
        odometer: '',
        status: 'Available',
        acquisitionCost: ''
    });

    const handleOpenModal = (vehicle = null) => {
        if (vehicle) {
            setEditingVehicle(vehicle);
            setFormData({
                name: vehicle.name,
                plate: vehicle.plate,
                maxCapacity: vehicle.maxCapacity,
                odometer: vehicle.odometer,
                status: vehicle.status,
                acquisitionCost: vehicle.acquisitionCost || ''
            });
        } else {
            setEditingVehicle(null);
            setFormData({
                name: '',
                plate: '',
                maxCapacity: '',
                odometer: '',
                status: 'Available',
                acquisitionCost: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();

        // Validation
        if (vehicles.some(v => v.plate === formData.plate && v.id !== editingVehicle?.id)) {
            toast.error('License Plate must be unique');
            return;
        }

        if (editingVehicle) {
            updateVehicle(editingVehicle.id, {
                ...formData,
                maxCapacity: Number(formData.maxCapacity),
                odometer: Number(formData.odometer),
                acquisitionCost: Number(formData.acquisitionCost)
            });
            toast.success('Vehicle updated successfully');
        } else {
            addVehicle({
                ...formData,
                maxCapacity: Number(formData.maxCapacity),
                odometer: Number(formData.odometer),
                acquisitionCost: Number(formData.acquisitionCost)
            });
            toast.success('Vehicle added successfully');
        }
        setIsModalOpen(false);
    };

    const filteredVehicles = vehicles.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.plate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            header: 'Vehicle Info',
            render: (v) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                        <Truck size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{v.name}</p>
                        <p className="text-xs text-slate-400 font-mono">{v.plate}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Capacity (KG)',
            render: (v) => <span className="font-mono font-bold text-slate-600">{v.maxCapacity.toLocaleString()}</span>
        },
        {
            header: 'Odometer (KM)',
            render: (v) => <span className="font-mono font-bold text-slate-600">{v.odometer.toLocaleString()}</span>
        },
        {
            header: 'Status',
            render: (v) => {
                const variants = {
                    'Available': 'success',
                    'On Trip': 'info',
                    'In Shop': 'danger',
                    'Retired': 'secondary'
                };
                return <Badge variant={variants[v.status]}>{v.status}</Badge>;
            }
        },
        {
            header: 'Actions',
            render: (v) => (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenModal(v)}
                        className="h-8 w-8 p-0"
                    >
                        <Edit2 size={14} />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this vehicle?')) {
                                deleteVehicle(v.id);
                                toast.success('Vehicle deleted');
                            }
                        }}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <Trash2 size={14} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-20 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Vehicle Registry</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage your fleet inventory and status</p>
                </div>
                <Button onClick={() => handleOpenModal()} icon={Plus}>Add New Vehicle</Button>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or license plate..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" icon={Filter}>Filters</Button>
                        <p className="text-xs text-slate-400 font-bold ml-2">{filteredVehicles.length} Vehicles Total</p>
                    </div>
                </div>

                <Table columns={columns} data={filteredVehicles} />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            >
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Vehicle Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="e.g. Volvo FH16"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">License Plate</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-mono"
                                placeholder="FF-0000"
                                value={formData.plate}
                                onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Max Capacity (KG)</label>
                            <input
                                type="number"
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="20000"
                                value={formData.maxCapacity}
                                onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Current Odometer (KM)</label>
                            <input
                                type="number"
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="100000"
                                value={formData.odometer}
                                onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Acquisition Cost ($)</label>
                            <input
                                type="number"
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="120000"
                                value={formData.acquisitionCost}
                                onChange={(e) => setFormData({ ...formData, acquisitionCost: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Status</label>
                            <select
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Available">Available</option>
                                <option value="On Trip">On Trip</option>
                                <option value="In Shop">In Shop</option>
                                <option value="Retired">Retired</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <Button variant="secondary" className="flex-1" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button className="flex-1" type="submit">Save Vehicle</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default VehicleRegistry;
