import React from 'react';
import {
    Truck,
    Wrench,
    TrendingUp,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Calendar,
    MapPin,
    BarChart3
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import ReactApexChart from 'react-apexcharts';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import useStore from '../store/useStore';

const Dashboard = () => {
    const { vehicles, trips } = useStore();

    const activeFleet = vehicles.filter(v => v.status === 'On Trip').length;
    const maintenanceAlerts = vehicles.filter(v => v.status === 'In Shop').length;
    const pendingCargo = trips.filter(t => t.status === 'Draft').length;
    const utilizationRate = ((activeFleet / vehicles.length) * 100).toFixed(1);

    // Data for Recharts (Trip Distribution)
    const tripData = [
        { name: 'Mon', count: 12 },
        { name: 'Tue', count: 19 },
        { name: 'Wed', count: 15 },
        { name: 'Thu', count: 22 },
        { name: 'Fri', count: 30 },
        { name: 'Sat', count: 10 },
        { name: 'Sun', count: 8 },
    ];

    // Data for ApexCharts (Vehicle Status)
    const statusCounts = vehicles.reduce((acc, v) => {
        acc[v.status] = (acc[v.status] || 0) + 1;
        return acc;
    }, {});

    const pieOptions = {
        labels: Object.keys(statusCounts),
        colors: ['#16a34a', '#0284c7', '#dc2626', '#64748b'],
        legend: { position: 'bottom' },
        dataLabels: { enabled: false },
        plotOptions: {
            pie: {
                donut: { size: '65%' }
            }
        }
    };

    const pieSeries = Object.values(statusCounts);

    const stats = [
        { title: 'Active Fleet', value: activeFleet, icon: Truck, trend: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Maintenance', value: maintenanceAlerts, icon: Wrench, trend: '2 Critical', color: 'text-red-600', bg: 'bg-red-50' },
        { title: 'Utilization', value: `${utilizationRate}%`, icon: TrendingUp, trend: '+5.4%', color: 'text-green-600', bg: 'bg-green-50' },
        { title: 'Pending Cargo', value: pendingCargo, icon: Package, trend: '3 High Priority', color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-20 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Command Center</h1>
                    <p className="text-slate-500 text-sm font-medium">Real-time overview of your fleet operations</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600">
                        <Calendar size={18} />
                        <span>Feb 21, 2026</span>
                    </div>
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98]">
                        <Filter size={18} />
                        Filters
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.title} className="group hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</p>
                                <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5">
                            <span className={`flex items-center text-xs font-bold ${stat.color}`}>
                                <ArrowUpRight size={14} />
                                {stat.trend}
                            </span>
                            <span className="text-slate-400 text-xs font-medium">vs last month</span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card title="Trip Distribution" subtitle="Daily trip volume for the current week" className="lg:col-span-2">
                    <div className="h-80 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tripData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                    {tripData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 4 ? '#1e40af' : '#dbeafe'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Fleet Status" subtitle="Vehicle distribution by current state">
                    <div className="h-80 w-full flex items-center justify-center">
                        <ReactApexChart
                            options={pieOptions}
                            series={pieSeries}
                            type="donut"
                            width="100%"
                        />
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Recent Activity" subtitle="Latest status updates across the fleet">
                    <div className="space-y-6 mt-4">
                        {[
                            { type: 'trip', title: 'Trip COMPLETED', desc: 'Volvo FH16 (FF-1001) finished route to Chicago', time: '12m ago', status: 'success' },
                            { type: 'maintenance', title: 'Maintenance ALERT', desc: 'Mercedes Actros requires urgent brake service', time: '45m ago', status: 'danger' },
                            { type: 'dispatch', title: 'New Trip DRAFT', desc: 'Cargo assigned to MAN TGX for New York dispatch', time: '1h ago', status: 'warning' },
                        ].map((activity, i) => (
                            <div key={i} className="flex gap-4">
                                <div className={`shrink-0 w-2 h-2 rounded-full mt-2 bg-${activity.status === 'success' ? 'green' : activity.status === 'danger' ? 'red' : 'orange'}-500 shadow-lg shadow-current/50`}></div>
                                <div className="flex-1 border-b border-slate-50 pb-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-bold text-slate-800">{activity.title}</h4>
                                        <span className="text-xs text-slate-400 font-medium">{activity.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{activity.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Quick Actions" subtitle="Frequently used management tools">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <button className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-primary-50 hover:border-primary-100 transition-all text-left group">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary-600 mb-3 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                <Truck size={20} />
                            </div>
                            <p className="text-sm font-bold text-slate-800">Add Vehicle</p>
                            <p className="text-xs text-slate-500 mt-0.5">Register new fleet unit</p>
                        </button>
                        <button className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-100 transition-all text-left group">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <MapPin size={20} />
                            </div>
                            <p className="text-sm font-bold text-slate-800">New Trip</p>
                            <p className="text-xs text-slate-500 mt-0.5">Create dispatch order</p>
                        </button>
                        <button className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-orange-50 hover:border-orange-100 transition-all text-left group">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-orange-600 mb-3 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                <Wrench size={20} />
                            </div>
                            <p className="text-sm font-bold text-slate-800">Log Service</p>
                            <p className="text-xs text-slate-500 mt-0.5">Add maintenance record</p>
                        </button>
                        <button className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-purple-50 hover:border-purple-100 transition-all text-left group">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-purple-600 mb-3 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                <BarChart3 size={20} />
                            </div>
                            <p className="text-sm font-bold text-slate-800">Export Report</p>
                            <p className="text-xs text-slate-500 mt-0.5">Download analytics data</p>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
