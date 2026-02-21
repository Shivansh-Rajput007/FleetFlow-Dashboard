import React from 'react';
import { Users, ShieldCheck, Mail, Phone, Calendar, Star, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const Drivers = () => {
    const { drivers, updateDriver } = useStore();

    const handleStatusToggle = (driver) => {
        const newStatus = driver.status === 'Suspended' ? 'Off Duty' : 'Suspended';
        updateDriver(driver.id, { status: newStatus });
        toast.success(`Driver status updated to ${newStatus}`);
    };

    const isLicenseExpired = (date) => new Date(date) < new Date();

    const columns = [
        {
            header: 'Driver Name',
            render: (d) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                        {d.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{d.name}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                            <Mail size={12} /> driver@fleetflow.com
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'License Expiry',
            render: (d) => {
                const expired = isLicenseExpired(d.licenseExpiry);
                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <Calendar size={14} className="text-slate-400" />
                            {d.licenseExpiry}
                        </div>
                        {expired && (
                            <Badge variant="danger" className="text-[10px] py-0">Expired</Badge>
                        )}
                    </div>
                );
            }
        },
        {
            header: 'Performance',
            render: (d) => (
                <div className="space-y-2 w-48">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter text-slate-400">
                        <span>Safety Score</span>
                        <span className={d.safetyScore > 85 ? 'text-green-600' : 'text-orange-600'}>{d.safetyScore}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${d.safetyScore > 85 ? 'bg-green-500' : 'bg-orange-500'}`}
                            style={{ width: `${d.safetyScore}%` }}
                        ></div>
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            render: (d) => {
                const variants = {
                    'On Duty': 'info',
                    'Off Duty': 'success',
                    'Suspended': 'danger'
                };
                const expired = isLicenseExpired(d.licenseExpiry);
                if (expired) return <Badge variant="danger">License Blocked</Badge>;
                return <Badge variant={variants[d.status]}>{d.status}</Badge>;
            }
        },
        {
            header: 'Actions',
            render: (d) => (
                <Button
                    variant={d.status === 'Suspended' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusToggle(d)}
                >
                    {d.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-20 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Driver Performance</h1>
                    <p className="text-slate-500 text-sm font-medium">Monitor safety metrics and fleet personnel</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex flex-col items-center text-center p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                        <ShieldCheck size={32} className="text-primary-400" />
                    </div>
                    <h3 className="text-lg font-bold">Fleet Safety Index</h3>
                    <p className="text-4xl font-black mt-2 text-primary-400">91.4%</p>
                    <p className="text-xs text-slate-400 mt-2 font-medium">Compliance target met this month</p>
                </Card>

                <Card className="flex flex-col items-center text-center p-8 border-slate-100">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                        <Users size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Total Drivers</h3>
                    <p className="text-4xl font-black mt-2 text-slate-800">{drivers.length}</p>
                    <p className="text-xs text-slate-500 mt-2 font-medium">4 On-Duty | 2 Off-Duty</p>
                </Card>

                <Card className="flex flex-col items-center text-center p-8 border-slate-100">
                    <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Critical Alerts</h3>
                    <p className="text-4xl font-black mt-2 text-orange-600">1</p>
                    <p className="text-xs text-slate-500 mt-2 font-medium font-bold uppercase tracking-tight">License Expired: Mike Ross</p>
                </Card>
            </div>

            <Card className="p-0 overflow-hidden" title="Driver Registry">
                <Table columns={columns} data={drivers} />
            </Card>
        </div>
    );
};

export default Drivers;
