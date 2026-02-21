import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import ReactApexChart from 'react-apexcharts';
import { FileDown, Printer, Share2, TrendingUp, DollarSign, Fuel, Star } from 'lucide-react';
import useStore from '../store/useStore';
import { calculateROI } from '../utils/rules';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import toast from 'react-hot-toast';

const Analytics = () => {
    const { vehicles, expenses, trips, drivers } = useStore();

    // ROI Calculation for entire fleet
    const totalRevenue = trips.reduce((sum, t) => sum + (t.status === 'Completed' ? t.revenue : 0), 0);
    const totalMaintenanceCost = 5400; // Simulated historical data
    const totalFuelCost = expenses.reduce((sum, e) => sum + (e.type === 'Fuel' ? e.amount : 0), 0);
    const totalAcquisition = vehicles.reduce((sum, v) => sum + v.acquisitionCost, 0);

    const fleetROI = calculateROI(totalRevenue, totalMaintenanceCost, totalFuelCost, totalAcquisition).toFixed(2);

    // Data for Fuel Efficiency Line Chart
    const efficiencyData = [
        { month: 'Jan', value: 38.5 },
        { month: 'Feb', value: 36.2 },
        { month: 'Mar', value: 34.8 },
        { month: 'Apr', value: 33.1 },
        { month: 'May', value: 31.5 },
        { month: 'Jun', value: 32.5 },
    ];

    // Data for Expense Bar Chart
    const expenseData = [
        { category: 'Fuel', amount: 12500 },
        { category: 'Maintenance', amount: 8400 },
        { category: 'Insurance', amount: 3200 },
        { category: 'Tolls', amount: 1800 },
        { category: 'Permits', amount: 900 },
    ];

    const radialOptions = {
        chart: { type: 'radialBar', toolbar: { show: false } },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                hollow: { size: '70%' },
                track: { background: '#f1f5f9', strokeWidth: '67%' },
                dataLabels: {
                    name: { show: true, color: '#64748b', fontSize: '13px', fontWeight: 700, offsetY: -10 },
                    value: { offsetY: 5, color: '#1e293b', fontSize: '30px', fontWeight: 900, show: true },
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: { shade: 'dark', type: 'horizontal', gradientToColors: ['#1e40af'], stops: [0, 100] }
        },
        stroke: { lineCap: 'round' },
        labels: ['Fleet ROI'],
    };

    const handleExport = (type) => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: `Generating ${type} report...`,
                success: `${type} report exported successfully!`,
                error: 'Failed to export report.',
            }
        );
    };

    const driverColumns = [
        {
            header: 'Driver',
            render: (d) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                        {d.name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-700">{d.name}</span>
                </div>
            )
        },
        { header: 'Score', render: (d) => <span className="font-mono font-bold text-green-600">{d.safetyScore}%</span> },
        { header: 'Rate', render: (d) => <span className="font-mono font-bold text-blue-600">{d.completionRate}%</span> },
        { header: 'Rank', render: (d, i) => <Badge variant={i === 0 ? 'success' : 'secondary'}>#{i + 1}</Badge> }
    ];

    return (
        <div className="space-y-20 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Advanced Analytics</h1>
                    <p className="text-slate-500 text-sm font-medium">Strategic insights and financial performance</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" icon={FileDown} onClick={() => handleExport('CSV')}>Export CSV</Button>
                    <Button variant="outline" size="sm" icon={FileDown} onClick={() => handleExport('PDF')}>Export PDF</Button>
                    <Button size="sm" icon={Printer}>Print Report</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card title="Return on Investment" subtitle="Overall fleet profitability metric" className="flex flex-col items-center justify-center">
                    <div className="h-64 w-full">
                        <ReactApexChart
                            options={radialOptions}
                            series={[fleetROI > 100 ? 100 : fleetROI]}
                            type="radialBar"
                            height="350"
                        />
                    </div>
                    <div className="text-center -mt-8 mb-4">
                        <p className="text-sm font-bold text-slate-500">Actual ROI: <span className="text-slate-900">{fleetROI}%</span></p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Formula applied: (Rev - Costs) / Acq</p>
                    </div>
                </Card>

                <Card title="Monthly Expenses" subtitle="Operational cost breakdown" className="lg:col-span-2">
                    <div className="h-64 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={expenseData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="category"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    width={100}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="amount" fill="#1e40af" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Fuel Efficiency Trend" subtitle="Average L/100km over time">
                    <div className="h-64 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={efficiencyData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#0284c7"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Top Performing Drivers" subtitle="Based on safety score and completion" className="p-0 overflow-hidden">
                    <Table
                        columns={driverColumns}
                        data={drivers.sort((a, b) => b.safetyScore - a.safetyScore).slice(0, 5)}
                    />
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
