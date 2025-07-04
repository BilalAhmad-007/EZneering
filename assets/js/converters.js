// Unit Converters JavaScript - Basic functionality

// Length Conversion Functions
function convertLength() {
    const value = parseFloat(document.getElementById('length-value').value);
    const fromUnit = document.getElementById('length-from').value;
    const toUnit = document.getElementById('length-to').value;

    if (isNaN(value)) {
        displayResult('length-result', '<div class="error-message">Please enter a valid number.</div>');
        return;
    }

    // Convert to meters first (base unit)
    const meters = convertToMeters(value, fromUnit);
    // Convert from meters to target unit
    const result = convertFromMeters(meters, toUnit);

    displayResult('length-result', `
        <div class="success-message">
            <h4>Length Conversion Result</h4>
            <p>${value} ${getUnitDisplayName(fromUnit)} = ${result.toFixed(6)} ${getUnitDisplayName(toUnit)}</p>
        </div>
    `);
}

function convertToMeters(value, unit) {
    const conversions = {
        'meter': 1,
        'kilometer': 1000,
        'centimeter': 0.01,
        'millimeter': 0.001,
        'mile': 1609.344,
        'yard': 0.9144,
        'foot': 0.3048,
        'inch': 0.0254
    };
    return value * conversions[unit];
}

function convertFromMeters(meters, unit) {
    const conversions = {
        'meter': 1,
        'kilometer': 1000,
        'centimeter': 0.01,
        'millimeter': 0.001,
        'mile': 1609.344,
        'yard': 0.9144,
        'foot': 0.3048,
        'inch': 0.0254
    };
    return meters / conversions[unit];
}

// Weight Conversion Functions
function convertWeight() {
    const value = parseFloat(document.getElementById('weight-value').value);
    const fromUnit = document.getElementById('weight-from').value;
    const toUnit = document.getElementById('weight-to').value;

    if (isNaN(value)) {
        displayResult('weight-result', '<div class="error-message">Please enter a valid number.</div>');
        return;
    }

    // Convert to kilograms first (base unit)
    const kilograms = convertToKilograms(value, fromUnit);
    // Convert from kilograms to target unit
    const result = convertFromKilograms(kilograms, toUnit);

    displayResult('weight-result', `
        <div class="success-message">
            <h4>Weight Conversion Result</h4>
            <p>${value} ${getUnitDisplayName(fromUnit)} = ${result.toFixed(6)} ${getUnitDisplayName(toUnit)}</p>
        </div>
    `);
}

function convertToKilograms(value, unit) {
    const conversions = {
        'kilogram': 1,
        'gram': 0.001,
        'milligram': 0.000001,
        'pound': 0.45359237,
        'ounce': 0.028349523125,
        'ton': 1000
    };
    return value * conversions[unit];
}

function convertFromKilograms(kilograms, unit) {
    const conversions = {
        'kilogram': 1,
        'gram': 0.001,
        'milligram': 0.000001,
        'pound': 0.45359237,
        'ounce': 0.028349523125,
        'ton': 1000
    };
    return kilograms / conversions[unit];
}

// Temperature Conversion Functions
function convertTemperature() {
    const value = parseFloat(document.getElementById('temp-value').value);
    const fromUnit = document.getElementById('temp-from').value;
    const toUnit = document.getElementById('temp-to').value;

    if (isNaN(value)) {
        displayResult('temp-result', '<div class="error-message">Please enter a valid number.</div>');
        return;
    }

    // Convert to Celsius first (base unit)
    const celsius = convertToCelsius(value, fromUnit);
    // Convert from Celsius to target unit
    const result = convertFromCelsius(celsius, toUnit);

    displayResult('temp-result', `
        <div class="success-message">
            <h4>Temperature Conversion Result</h4>
            <p>${value} ${getUnitDisplayName(fromUnit)} = ${result.toFixed(2)} ${getUnitDisplayName(toUnit)}</p>
        </div>
    `);
}

function convertToCelsius(value, unit) {
    switch (unit) {
        case 'celsius':
            return value;
        case 'fahrenheit':
            return (value - 32) * 5/9;
        case 'kelvin':
            return value - 273.15;
        default:
            return value;
    }
}

function convertFromCelsius(celsius, unit) {
    switch (unit) {
        case 'celsius':
            return celsius;
        case 'fahrenheit':
            return celsius * 9/5 + 32;
        case 'kelvin':
            return celsius + 273.15;
        default:
            return celsius;
    }
}

// Area Conversion Functions
function convertArea() {
    const value = parseFloat(document.getElementById('area-value').value);
    const fromUnit = document.getElementById('area-from').value;
    const toUnit = document.getElementById('area-to').value;

    if (isNaN(value)) {
        displayResult('area-result', '<div class="error-message">Please enter a valid number.</div>');
        return;
    }

    // Convert to square meters first (base unit)
    const squareMeters = convertToSquareMeters(value, fromUnit);
    // Convert from square meters to target unit
    const result = convertFromSquareMeters(squareMeters, toUnit);

    displayResult('area-result', `
        <div class="success-message">
            <h4>Area Conversion Result</h4>
            <p>${value} ${getUnitDisplayName(fromUnit)} = ${result.toFixed(6)} ${getUnitDisplayName(toUnit)}</p>
        </div>
    `);
}

function convertToSquareMeters(value, unit) {
    const conversions = {
        'square-meter': 1,
        'square-kilometer': 1000000,
        'square-centimeter': 0.0001,
        'square-foot': 0.09290304,
        'square-inch': 0.00064516,
        'acre': 4046.8564224,
        'hectare': 10000
    };
    return value * conversions[unit];
}

function convertFromSquareMeters(squareMeters, unit) {
    const conversions = {
        'square-meter': 1,
        'square-kilometer': 1000000,
        'square-centimeter': 0.0001,
        'square-foot': 0.09290304,
        'square-inch': 0.00064516,
        'acre': 4046.8564224,
        'hectare': 10000
    };
    return squareMeters / conversions[unit];
}

// Volume Conversion Functions
function convertVolume() {
    const value = parseFloat(document.getElementById('volume-value').value);
    const fromUnit = document.getElementById('volume-from').value;
    const toUnit = document.getElementById('volume-to').value;

    if (isNaN(value)) {
        displayResult('volume-result', '<div class="error-message">Please enter a valid number.</div>');
        return;
    }

    // Convert to liters first (base unit)
    const liters = convertToLiters(value, fromUnit);
    // Convert from liters to target unit
    const result = convertFromLiters(liters, toUnit);

    displayResult('volume-result', `
        <div class="success-message">
            <h4>Volume Conversion Result</h4>
            <p>${value} ${getUnitDisplayName(fromUnit)} = ${result.toFixed(6)} ${getUnitDisplayName(toUnit)}</p>
        </div>
    `);
}

function convertToLiters(value, unit) {
    const conversions = {
        'liter': 1,
        'milliliter': 0.001,
        'cubic-meter': 1000,
        'gallon': 3.785411784,
        'quart': 0.946352946,
        'pint': 0.473176473,
        'cup': 0.236588236
    };
    return value * conversions[unit];
}

function convertFromLiters(liters, unit) {
    const conversions = {
        'liter': 1,
        'milliliter': 0.001,
        'cubic-meter': 1000,
        'gallon': 3.785411784,
        'quart': 0.946352946,
        'pint': 0.473176473,
        'cup': 0.236588236
    };
    return liters / conversions[unit];
}

// Speed Conversion Functions
function convertSpeed() {
    const value = parseFloat(document.getElementById('speed-value').value);
    const fromUnit = document.getElementById('speed-from').value;
    const toUnit = document.getElementById('speed-to').value;

    if (isNaN(value)) {
        displayResult('speed-result', '<div class="error-message">Please enter a valid number.</div>');
        return;
    }

    // Convert to meters per second first (base unit)
    const mps = convertToMetersPerSecond(value, fromUnit);
    // Convert from meters per second to target unit
    const result = convertFromMetersPerSecond(mps, toUnit);

    displayResult('speed-result', `
        <div class="success-message">
            <h4>Speed Conversion Result</h4>
            <p>${value} ${getUnitDisplayName(fromUnit)} = ${result.toFixed(6)} ${getUnitDisplayName(toUnit)}</p>
        </div>
    `);
}

function convertToMetersPerSecond(value, unit) {
    const conversions = {
        'kmh': 0.277777778, // km/h to m/s
        'mph': 0.44704,     // mph to m/s
        'ms': 1,            // m/s to m/s
        'knot': 0.514444444, // knot to m/s
        'fps': 0.3048       // ft/s to m/s
    };
    return value * conversions[unit];
}

function convertFromMetersPerSecond(mps, unit) {
    const conversions = {
        'kmh': 0.277777778, // km/h to m/s
        'mph': 0.44704,     // mph to m/s
        'ms': 1,            // m/s to m/s
        'knot': 0.514444444, // knot to m/s
        'fps': 0.3048       // ft/s to m/s
    };
    return mps / conversions[unit];
}

// Power Conversion Functions
function convertPower() {
    const value = parseFloat(document.getElementById('power-value').value);
    const fromUnit = document.getElementById('power-from').value;
    const toUnit = document.getElementById('power-to').value;
    if (isNaN(value)) {
        displayResult('power-result', '<div class="error-message">Please enter a valid number.</div>');
        return;
    }
    // Convert to watts first (base unit)
    const watts = convertToWatts(value, fromUnit);
    // Convert from watts to target unit
    const result = convertFromWatts(watts, toUnit);
    displayResult('power-result', `
        <div class="success-message">
            <h4>Power Conversion Result</h4>
            <p>${value} ${getUnitDisplayName(fromUnit)} = ${result.toFixed(6)} ${getUnitDisplayName(toUnit)}</p>
        </div>
    `);
}

function convertToWatts(value, unit) {
    const conversions = {
        'watt': 1,
        'kilowatt': 1000,
        'megawatt': 1000000,
        'horsepower': 745.699872
    };
    return value * conversions[unit];
}

function convertFromWatts(watts, unit) {
    const conversions = {
        'watt': 1,
        'kilowatt': 1000,
        'megawatt': 1000000,
        'horsepower': 745.699872
    };
    return watts / conversions[unit];
}

// Energy Conversion Functions
function convertEnergy() {
    const value = parseFloat(document.getElementById('energy-value').value);
    const fromUnit = document.getElementById('energy-from').value;
    const toUnit = document.getElementById('energy-to').value;
    if (isNaN(value)) {
        displayResult('energy-result', '<div class="error-message">Please enter a valid number.</div>');
        return;
    }
    // Convert to joules first (base unit)
    const joules = convertToJoules(value, fromUnit);
    // Convert from joules to target unit
    const result = convertFromJoules(joules, toUnit);
    displayResult('energy-result', `
        <div class="success-message">
            <h4>Energy Conversion Result</h4>
            <p>${value} ${getUnitDisplayName(fromUnit)} = ${result.toFixed(6)} ${getUnitDisplayName(toUnit)}</p>
        </div>
    `);
}

function convertToJoules(value, unit) {
    const conversions = {
        'joule': 1,
        'kilojoule': 1000,
        'calorie': 4.184,
        'kilocalorie': 4184,
        'watt-hour': 3600,
        'kilowatt-hour': 3600000
    };
    return value * conversions[unit];
}

function convertFromJoules(joules, unit) {
    const conversions = {
        'joule': 1,
        'kilojoule': 1000,
        'calorie': 4.184,
        'kilocalorie': 4184,
        'watt-hour': 3600,
        'kilowatt-hour': 3600000
    };
    return joules / conversions[unit];
}

// Angle Conversion Functions
function convertAngle() {
    const value = parseFloat(document.getElementById('angle-value').value);
    const fromUnit = document.getElementById('angle-from').value;
    const toUnit = document.getElementById('angle-to').value;
    if (isNaN(value)) {
        displayResult('angle-result', '<div class="error-message">Please enter a valid number.</div>');
        return;
    }
    const degrees = convertToDegrees(value, fromUnit);
    const result = convertFromDegrees(degrees, toUnit);
    displayResult('angle-result', `<div class="success-message"><h4>Angle Conversion Result</h4><p>${value} ${getUnitDisplayName(fromUnit)} = ${result.toFixed(6)} ${getUnitDisplayName(toUnit)}</p></div>`);
}

function convertToDegrees(value, unit) {
    const conversions = {
        'degree': 1,
        'radian': 180/Math.PI,
        'gradian': 0.9,
        'minute': 1/60,
        'second': 1/3600
    };
    return value * conversions[unit];
}

function convertFromDegrees(degrees, unit) {
    const conversions = {
        'degree': 1,
        'radian': 180/Math.PI,
        'gradian': 0.9,
        'minute': 1/60,
        'second': 1/3600
    };
    return degrees / conversions[unit];
}

// Pressure Conversion Functions
function convertPressure() {
    const value = parseFloat(document.getElementById('pressure-value').value);
    const fromUnit = document.getElementById('pressure-from').value;
    const toUnit = document.getElementById('pressure-to').value;
    if (isNaN(value)) {
        displayResult('pressure-result', '<div class="error-message">Please enter a valid number.</div>');
        return;
    }
    const pascals = convertToPascals(value, fromUnit);
    const result = convertFromPascals(pascals, toUnit);
    displayResult('pressure-result', `<div class="success-message"><h4>Pressure Conversion Result</h4><p>${value} ${getUnitDisplayName(fromUnit)} = ${result.toFixed(6)} ${getUnitDisplayName(toUnit)}</p></div>`);
}

function convertToPascals(value, unit) {
    const conversions = {
        'pascal': 1,
        'bar': 100000,
        'atm': 101325,
        'mmhg': 133.322368,
        'psi': 6894.757293
    };
    return value * conversions[unit];
}

function convertFromPascals(pascals, unit) {
    const conversions = {
        'pascal': 1,
        'bar': 100000,
        'atm': 101325,
        'mmhg': 133.322368,
        'psi': 6894.757293
    };
    return pascals / conversions[unit];
}

// Force Conversion Functions
function convertForce() {
    const value = parseFloat(document.getElementById('force-value').value);
    const fromUnit = document.getElementById('force-from').value;
    const toUnit = document.getElementById('force-to').value;
    if (isNaN(value)) {
        displayResult('force-result', '<div class="error-message">Please enter a valid number.</div>');
        return;
    }
    const newtons = convertToNewtons(value, fromUnit);
    const result = convertFromNewtons(newtons, toUnit);
    displayResult('force-result', `<div class="success-message"><h4>Force Conversion Result</h4><p>${value} ${getUnitDisplayName(fromUnit)} = ${result.toFixed(6)} ${getUnitDisplayName(toUnit)}</p></div>`);
}

function convertToNewtons(value, unit) {
    const conversions = {
        'newton': 1,
        'kilonewton': 1000,
        'dyne': 0.00001,
        'pound-force': 4.4482216152605
    };
    return value * conversions[unit];
}

function convertFromNewtons(newtons, unit) {
    const conversions = {
        'newton': 1,
        'kilonewton': 1000,
        'dyne': 0.00001,
        'pound-force': 4.4482216152605
    };
    return newtons / conversions[unit];
}

// Density Conversion Functions
function convertDensity() {
    const value = parseFloat(document.getElementById('density-value').value);
    const fromUnit = document.getElementById('density-from').value;
    const toUnit = document.getElementById('density-to').value;
    if (isNaN(value)) {
        displayResult('density-result', '<div class="error-message">Please enter a valid number.</div>');
        return;
    }
    const kgm3 = convertToKgm3(value, fromUnit);
    const result = convertFromKgm3(kgm3, toUnit);
    displayResult('density-result', `<div class="success-message"><h4>Density Conversion Result</h4><p>${value} ${getUnitDisplayName(fromUnit)} = ${result.toFixed(6)} ${getUnitDisplayName(toUnit)}</p></div>`);
}

function convertToKgm3(value, unit) {
    const conversions = {
        'kgm3': 1,
        'gcm3': 1000,
        'lbft3': 16.018463,
        'lbgal': 119.8264 // US gallon
    };
    return value * conversions[unit];
}

function convertFromKgm3(kgm3, unit) {
    const conversions = {
        'kgm3': 1,
        'gcm3': 1000,
        'lbft3': 16.018463,
        'lbgal': 119.8264
    };
    return kgm3 / conversions[unit];
}

// Base Converter Function
function convertBase() {
    const value = document.getElementById('base-value').value.trim();
    const fromBase = parseInt(document.getElementById('base-from').value);
    const toBase = parseInt(document.getElementById('base-to').value);
    let decimalValue;
    try {
        if (value === '') throw new Error('Please enter a value.');
        // Parse input value in the fromBase
        decimalValue = parseInt(value, fromBase);
        if (isNaN(decimalValue)) throw new Error('Invalid input for the selected base.');
        let result = decimalValue.toString(toBase).toUpperCase();
        displayResult('base-result', `<div class="success-message"><h4>Base Conversion Result</h4><p>${value} (Base ${fromBase}) = ${result} (Base ${toBase})</p></div>`);
    } catch (e) {
        displayResult('base-result', `<div class="error-message">${e.message}</div>`);
    }
}

// Utility Functions
function displayResult(elementId, content) {
    document.getElementById(elementId).innerHTML = content;
}

function getUnitDisplayName(unit) {
    const displayNames = {
        // Length units
        'meter': 'Meter (m)',
        'kilometer': 'Kilometer (km)',
        'centimeter': 'Centimeter (cm)',
        'millimeter': 'Millimeter (mm)',
        'mile': 'Mile (mi)',
        'yard': 'Yard (yd)',
        'foot': 'Foot (ft)',
        'inch': 'Inch (in)',
        
        // Weight units
        'kilogram': 'Kilogram (kg)',
        'gram': 'Gram (g)',
        'milligram': 'Milligram (mg)',
        'pound': 'Pound (lb)',
        'ounce': 'Ounce (oz)',
        'ton': 'Ton (t)',
        
        // Temperature units
        'celsius': 'Celsius (°C)',
        'fahrenheit': 'Fahrenheit (°F)',
        'kelvin': 'Kelvin (K)',
        
        // Area units
        'square-meter': 'Square Meter (m²)',
        'square-kilometer': 'Square Kilometer (km²)',
        'square-centimeter': 'Square Centimeter (cm²)',
        'square-foot': 'Square Foot (ft²)',
        'square-inch': 'Square Inch (in²)',
        'acre': 'Acre (ac)',
        'hectare': 'Hectare (ha)',
        
        // Volume units
        'liter': 'Liter (L)',
        'milliliter': 'Milliliter (mL)',
        'cubic-meter': 'Cubic Meter (m³)',
        'gallon': 'Gallon (gal)',
        'quart': 'Quart (qt)',
        'pint': 'Pint (pt)',
        'cup': 'Cup (cup)',
        
        // Speed units
        'kmh': 'Kilometers per Hour (km/h)',
        'mph': 'Miles per Hour (mph)',
        'ms': 'Meters per Second (m/s)',
        'knot': 'Knot (kn)',
        'fps': 'Feet per Second (ft/s)',
        
        // Power units
        'watt': 'Watt (W)',
        'kilowatt': 'Kilowatt (kW)',
        'megawatt': 'Megawatt (MW)',
        'horsepower': 'Horsepower (hp)',
        
        // Energy units
        'joule': 'Joule (J)',
        'kilojoule': 'Kilojoule (kJ)',
        'calorie': 'Calorie (cal)',
        'kilocalorie': 'Kilocalorie (kcal)',
        'watt-hour': 'Watt-hour (Wh)',
        'kilowatt-hour': 'Kilowatt-hour (kWh)',
        
        // Density units
        'kgm3': 'Kilogram per Cubic Meter (kg/m³)',
        'gcm3': 'Gram per Cubic Centimeter (g/cm³)',
        'lbft3': 'Pound per Cubic Foot (lb/ft³)',
        'lbgal': 'Pound per Gallon (US) (lb/gal)'
    };
    
    return displayNames[unit] || unit;
}

function setDefaultLengthTab() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    const lengthBtn = document.querySelector('.tab-btn[data-tab="length"]');
    const lengthContent = document.getElementById('length');
    if (lengthBtn && lengthContent) {
        lengthBtn.classList.add('active');
        lengthContent.classList.add('active');
    }
    // Remove any hash from the URL
    if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setDefaultLengthTab();
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            const selectedContent = document.getElementById(targetTab);
            if (selectedContent) {
                selectedContent.classList.add('active');
            }
        });
    });
});
window.addEventListener('pageshow', setDefaultLengthTab); 