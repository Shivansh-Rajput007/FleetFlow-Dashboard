import { create } from 'zustand';

const useStore = create((set, get) => ({
    // --- Auth State ---
    user: null,
    isAuthenticated: false,
    login: (userData) => set({ user: userData, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),

    // --- Vehicles State ---
    vehicles: [
        { id: 1, name: 'Volvo FH16', plate: 'FF-1001', maxCapacity: 25000, odometer: 125400, status: 'Available', acquisitionCost: 150000 },
        { id: 2, name: 'Scania R500', plate: 'FF-1002', maxCapacity: 22000, odometer: 89600, status: 'On Trip', acquisitionCost: 135000 },
        { id: 3, name: 'Mercedes Actros', plate: 'FF-1003', maxCapacity: 24000, odometer: 45200, status: 'In Shop', acquisitionCost: 145000 },
        { id: 4, name: 'MAN TGX', plate: 'FF-1004', maxCapacity: 20000, odometer: 210000, status: 'Available', acquisitionCost: 120000 },
    ],
    addVehicle: (vehicle) => set((state) => ({ vehicles: [...state.vehicles, { ...vehicle, id: Date.now() }] })),
    updateVehicle: (id, updates) => set((state) => ({
        vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...updates } : v)
    })),
    deleteVehicle: (id) => set((state) => ({ vehicles: state.vehicles.filter(v => v.id !== id) })),

    // --- Drivers State ---
    drivers: [
        { id: 1, name: 'John Doe', licenseExpiry: '2026-12-31', safetyScore: 92, status: 'Off Duty', completionRate: 98 },
        { id: 2, name: 'Jane Smith', licenseExpiry: '2025-05-15', safetyScore: 88, status: 'On Duty', completionRate: 95 },
        { id: 3, name: 'Mike Ross', licenseExpiry: '2024-01-10', safetyScore: 75, status: 'Off Duty', completionRate: 85 }, // Expired
        { id: 4, name: 'Harvey Specter', licenseExpiry: '2026-08-20', safetyScore: 95, status: 'Suspended', completionRate: 90 },
    ],
    updateDriver: (id, updates) => set((state) => ({
        drivers: state.drivers.map(d => d.id === id ? { ...d, ...updates } : d)
    })),

    // --- Trips State ---
    trips: [
        { id: 1, vehicleId: 2, driverId: 2, cargoWeight: 15000, status: 'Dispatched', destination: 'Chicago, IL', revenue: 2500 },
        { id: 2, vehicleId: 1, driverId: 1, cargoWeight: 18000, status: 'Draft', destination: 'New York, NY', revenue: 3200 },
    ],
    addTrip: (trip) => set((state) => ({ trips: [...state.trips, { ...trip, id: Date.now(), status: 'Draft' }] })),
    dispatchTrip: (id) => {
        const trip = get().trips.find(t => t.id === id);
        if (!trip) return;
        set((state) => ({
            trips: state.trips.map(t => t.id === id ? { ...t, status: 'Dispatched' } : t),
            vehicles: state.vehicles.map(v => v.id === trip.vehicleId ? { ...v, status: 'On Trip' } : v),
            drivers: state.drivers.map(d => d.id === trip.driverId ? { ...d, status: 'On Duty' } : d),
        }));
    },
    completeTrip: (id, finalOdometer) => {
        const trip = get().trips.find(t => t.id === id);
        if (!trip) return;
        set((state) => ({
            trips: state.trips.map(t => t.id === id ? { ...t, status: 'Completed' } : t),
            vehicles: state.vehicles.map(v => v.id === trip.vehicleId ? { ...v, status: 'Available', odometer: finalOdometer } : v),
            drivers: state.drivers.map(d => d.id === trip.driverId ? { ...d, status: 'Off Duty' } : d),
        }));
    },

    // --- Maintenance State ---
    maintenanceLogs: [],
    addMaintenance: (log) => {
        set((state) => ({
            maintenanceLogs: [...state.maintenanceLogs, { ...log, id: Date.now(), status: 'In Shop' }],
            vehicles: state.vehicles.map(v => v.id === parseInt(log.vehicleId) ? { ...v, status: 'In Shop' } : v),
        }));
    },

    // --- Expenses State ---
    expenses: [],
    addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, { ...expense, id: Date.now() }] })),
}));

export default useStore;
