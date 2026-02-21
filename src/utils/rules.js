/**
 * FleetFlow Business Rule Engine
 */

/**
 * Validates if cargo weight exceeds vehicle capacity
 * @param {Object} vehicle 
 * @param {number} cargoWeight 
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateCargoCapacity = (vehicle, cargoWeight) => {
    if (!vehicle) return { isValid: false, message: 'Vehicle not found.' };
    if (cargoWeight > vehicle.maxCapacity) {
        return {
            isValid: false,
            message: `Cargo exceeds vehicle capacity. Dispatch blocked. (${cargoWeight}kg > ${vehicle.maxCapacity}kg)`
        };
    }
    return { isValid: true, message: '' };
};

/**
 * Validates if a driver is eligible for a trip
 * @param {Object} driver 
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateDriverEligibility = (driver) => {
    if (!driver) return { isValid: false, message: 'Driver not found.' };

    const today = new Date();
    const expiryDate = new Date(driver.licenseExpiry);

    if (expiryDate < today) {
        return { isValid: false, message: 'Driver license expired.' };
    }

    if (driver.status === 'Suspended') {
        return { isValid: false, message: 'Driver is suspended.' };
    }

    if (driver.status === 'On Duty') {
        return { isValid: false, message: 'Driver is already on duty.' };
    }

    return { isValid: true, message: '' };
};

/**
 * Validates if a vehicle is available for a trip
 * @param {Object} vehicle 
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateVehicleAvailability = (vehicle) => {
    if (!vehicle) return { isValid: false, message: 'Vehicle not found.' };

    if (vehicle.status !== 'Available') {
        return { isValid: false, message: `Vehicle is currently ${vehicle.status}.` };
    }

    return { isValid: true, message: '' };
};

/**
 * Calculates Return on Investment (ROI)
 * Formula: (Revenue − (Maintenance + Fuel)) / Acquisition Cost
 */
export const calculateROI = (revenue, maintenance, fuel, acquisitionCost) => {
    if (!acquisitionCost || acquisitionCost === 0) return 0;
    return ((revenue - (maintenance + fuel)) / acquisitionCost) * 100;
};

/**
 * Calculates Fuel Efficiency (L/100km)
 */
export const calculateFuelEfficiency = (liters, odometerStart, odometerEnd) => {
    const distance = odometerEnd - odometerStart;
    if (!distance || distance === 0) return 0;
    return (liters / distance) * 100;
};
