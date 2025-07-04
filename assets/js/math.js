// Math Tools JavaScript - Basic functionality

// Calculator Variables
let calculatorExpression = '0';
let calculatorResult = '0';

// Coefficient Sign Management
function initializeSignButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('sign-btn')) {
            const targetId = e.target.dataset.target;
            const sign = e.target.dataset.sign;
            const container = e.target.closest('.coefficient-input');
            
            // Remove active class from all sign buttons in this container
            container.querySelectorAll('.sign-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            e.target.classList.add('active');
        }
    });
}

// Get coefficient value with sign
function getCoefficientValue(inputId) {
    const input = document.getElementById(inputId);
    const container = input.closest('.coefficient-input');
    const activeSignBtn = container.querySelector('.sign-btn.active');
    const sign = activeSignBtn.dataset.sign;
    const value = parseFloat(input.value) || 0;
    
    return sign === '-' ? -value : value;
}

// Scientific Calculator Functions
function addToExpression(value) {
    const exprInput = document.getElementById('calc-expression');
    if (exprInput) {
        let current = exprInput.value;
        if (current === '0' && value !== '.') {
            exprInput.value = value;
        } else {
            exprInput.value += value;
        }
    }
    calculatorExpression = document.getElementById('calc-expression').value;
    updateCalculatorDisplay(false);
}

function calculatorFunction(func) {
    switch (func) {
        case 'sin':
            addToExpression('Math.sin(');
            break;
        case 'cos':
            addToExpression('Math.cos(');
            break;
        case 'tan':
            addToExpression('Math.tan(');
            break;
        case 'asin':
            addToExpression('Math.asin(');
            break;
        case 'acos':
            addToExpression('Math.acos(');
            break;
        case 'atan':
            addToExpression('Math.atan(');
            break;
        case 'log':
            addToExpression('Math.log10(');
            break;
        case 'ln':
            addToExpression('Math.log(');
            break;
        case 'sqrt':
            addToExpression('Math.sqrt(');
            break;
        case 'pow':
            addToExpression('pow(');
            break;
        case 'fact':
            addToExpression('factorial(');
            break;
        case 'pi':
            addToExpression('Math.PI');
            break;
        case 'e':
            addToExpression('Math.E');
            break;
        case 'mod':
            addToExpression('%');
            break;
        case 'abs':
            addToExpression('Math.abs(');
            break;
        case 'exp':
            addToExpression('Math.exp(');
            break;
        case 'inv':
            addToExpression('1/(');
            break;
        case 'square':
            addToExpression('**2');
            break;
    }
    updateCalculatorDisplay();
}

function preprocessExpression(expr) {
    expr = expr.replace(/\s+/g, '');
    // Replace a%b with (a/100)*b for percent-of functionality
    expr = expr.replace(/(\d+(?:\.\d+)?|\([^()]+\))%(\d+(?:\.\d+)?|\([^()]+\))/g, '($1/100)*$2');
    // Replace number% or (expr)% with (number/100) or (expr/100) (standalone percent)
    expr = expr.replace(/(\d+(?:\.\d+)?|\([^()]+\))%/g, '($1/100)');
    // Iteratively replace the rightmost a^b with Math.pow(a,b), supporting negative numbers, decimals, and parentheses
    let powerPattern = /((?:-?\d+(?:\.\d+)?|\([^()]+\)))\^((?:-?\d+(?:\.\d+)?|\([^()]+\)))/g;
    while (powerPattern.test(expr)) {
        expr = expr.replace(powerPattern, 'Math.pow($1,$2)');
    }
    return expr
        // Convert powers
        .replace(/([\d.]+)²/g, 'Math.pow($1,2)')
        // Factorial
        .replace(/fact\(([^)]+)\)/g, 'factorial($1)')
        // Trig functions (convert degrees to radians)
        .replace(/sin\(([^)]+)\)/g, 'Math.sin(($1)*Math.PI/180)')
        .replace(/cos\(([^)]+)\)/g, 'Math.cos(($1)*Math.PI/180)')
        .replace(/tan\(([^)]+)\)/g, 'Math.tan(($1)*Math.PI/180)')
        // Inverse trig (convert result from radians to degrees)
        .replace(/sin⁻¹\(([^)]+)\)/g, '(Math.asin($1)*180/Math.PI)')
        .replace(/cos⁻¹\(([^)]+)\)/g, '(Math.acos($1)*180/Math.PI)')
        .replace(/tan⁻¹\(([^)]+)\)/g, '(Math.atan($1)*180/Math.PI)')
        // Logarithms
        .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
        .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
        // Square root
        .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
        // pow(x,y)
        .replace(/pow\(([^,]+),([^\)]+)\)/g, 'Math.pow($1,$2)')
        // pi and e
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        // abs
        .replace(/abs\(([^)]+)\)/g, 'Math.abs($1)')
        // exp
        .replace(/exp\(([^)]+)\)/g, 'Math.exp($1)');
}

function calculate() {
    try {
        const exprInput = document.getElementById('calc-expression');
        let displayExpr = exprInput ? exprInput.value : '';
        let expression = preprocessExpression(displayExpr);
        calculatorResult = eval(expression);
        if (Number.isInteger(calculatorResult)) {
            calculatorResult = calculatorResult.toString();
        } else {
            calculatorResult = calculatorResult.toFixed(8).replace(/\.?0+$/, '');
        }
        updateCalculatorDisplay(true);
    } catch (error) {
        updateCalculatorDisplay(true);
    }
}

function clearCalculator() {
    const exprInput = document.getElementById('calc-expression');
    const resultElement = document.getElementById('calc-result');
    if (exprInput) exprInput.value = '0';
    if (resultElement) resultElement.textContent = '0';
    calculatorExpression = '0';
    calculatorResult = '0';
    updateCalculatorDisplay(false);
}

function backspace() {
    const exprInput = document.getElementById('calc-expression');
    if (exprInput) {
        let current = exprInput.value;
        if (current.length > 1) {
            exprInput.value = current.slice(0, -1);
        } else {
            exprInput.value = '0';
        }
    }
    calculatorExpression = document.getElementById('calc-expression').value;
    updateCalculatorDisplay(false);
}

function updateCalculatorDisplay(showResult = true) {
    const exprInput = document.getElementById('calc-expression');
    const resultElement = document.getElementById('calc-result');
    if (exprInput) {
        let displayExpr = exprInput.value
            .replace(/Math\.sin\(/g, 'sin(')
            .replace(/Math\.cos\(/g, 'cos(')
            .replace(/Math\.tan\(/g, 'tan(')
            .replace(/Math\.asin\(/g, 'sin⁻¹(')
            .replace(/Math\.acos\(/g, 'cos⁻¹(')
            .replace(/Math\.atan\(/g, 'tan⁻¹(')
            .replace(/Math\.log10\(/g, 'log(')
            .replace(/Math\.log\(/g, 'ln(')
            .replace(/Math\.sqrt\(/g, '√(')
            // Show ^ for powers
            .replace(/Math\.pow\(([^,]+),([^\)]+)\)/g, '$1^$2')
            .replace(/factorial\(/g, 'fact(')
            .replace(/Math\.PI/g, 'π')
            .replace(/Math\.E/g, 'e')
            .replace(/Math\.abs\(/g, 'abs(')
            .replace(/Math\.exp\(/g, 'exp(')
            .replace(/\*\*2/g, '²');
        exprInput.value = displayExpr;
    }
    if (resultElement && showResult) resultElement.textContent = calculatorResult;
}

// Utility Functions
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Equation Solver Functions
function solveEquation() {
    const equationType = document.querySelector('input[name="equation-type"]:checked').value;
    let result = '';

    switch (equationType) {
        case 'linear':
            result = solveLinearEquation();
            break;
        case 'quadratic':
            result = solveQuadraticEquation();
            break;
        case 'cubic':
            result = solveCubicEquation();
            break;
        case 'system':
            result = solveSystemOfEquations();
            break;
    }

    displayResult('equation-result', result);
}

function solveLinearEquation() {
    const a = getCoefficientValue('linear-a');
    const b = getCoefficientValue('linear-b');

    if (isNaN(a) || isNaN(b)) {
        return '<div class="error-message">Please enter valid coefficients.</div>';
    }

    if (a === 0) {
        return '<div class="error-message">Coefficient a cannot be zero for a linear equation.</div>';
    }

    const x = -b / a;
    const aDisplay = a >= 0 ? a : `(${a})`;
    const bDisplay = b >= 0 ? b : `(${b})`;
    
    return `
        <div class="success-message">
            <h4>Linear Equation Solution</h4>
            <p>Equation: ${aDisplay}x + ${bDisplay} = 0</p>
            <p>Solution: x = ${x.toFixed(6)}</p>
        </div>
    `;
}

function solveQuadraticEquation() {
    const a = getCoefficientValue('quad-a');
    const b = getCoefficientValue('quad-b');
    const c = getCoefficientValue('quad-c');

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        return '<div class="error-message">Please enter valid coefficients.</div>';
    }

    if (a === 0) {
        return '<div class="error-message">Coefficient a cannot be zero for a quadratic equation.</div>';
    }

    const discriminant = b * b - 4 * a * c;
    let solutions = [];

    if (discriminant > 0) {
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        solutions = [x1, x2];
    } else if (discriminant === 0) {
        const x = -b / (2 * a);
        solutions = [x];
    } else {
        const realPart = -b / (2 * a);
        const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
        solutions = [`${realPart.toFixed(6)} + ${imaginaryPart.toFixed(6)}i`, 
                     `${realPart.toFixed(6)} - ${imaginaryPart.toFixed(6)}i`];
    }

    const aDisplay = a >= 0 ? a : `(${a})`;
    const bDisplay = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const cDisplay = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;

    return `
        <div class="success-message">
            <h4>Quadratic Equation Solution</h4>
            <p>Equation: ${aDisplay}x² ${bDisplay}x ${cDisplay} = 0</p>
            <p>Discriminant: ${discriminant.toFixed(6)}</p>
            <p>Solutions: ${solutions.map(s => `x = ${s}`).join(', ')}</p>
        </div>
    `;
}

function solveCubicEquation() {
    const a = getCoefficientValue('cubic-a');
    const b = getCoefficientValue('cubic-b');
    const c = getCoefficientValue('cubic-c');
    const d = getCoefficientValue('cubic-d');

    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
        return '<div class="error-message">Please enter valid coefficients.</div>';
    }

    if (a === 0) {
        return '<div class="error-message">Coefficient a cannot be zero for a cubic equation.</div>';
    }

    // Simplified cubic solver
    const solutions = solveCubic(a, b, c, d);

    const aDisplay = a >= 0 ? a : `(${a})`;
    const bDisplay = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const cDisplay = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
    const dDisplay = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`;

    return `
        <div class="success-message">
            <h4>Cubic Equation Solution</h4>
            <p>Equation: ${aDisplay}x³ ${bDisplay}x² ${cDisplay}x ${dDisplay} = 0</p>
            <p>Solutions: ${solutions.map(s => `x = ${s}`).join(', ')}</p>
        </div>
    `;
}

function solveCubic(a, b, c, d) {
    // Simplified cubic solver using Cardano's formula
    const p = (3 * a * c - b * b) / (3 * a * a);
    const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
    
    const discriminant = q * q / 4 + p * p * p / 27;
    
    if (Math.abs(discriminant) < 1e-10) {
        const u = Math.cbrt(-q / 2);
        const x = 2 * u - b / (3 * a);
        return [x.toFixed(6)];
    } else if (discriminant > 0) {
        const u = Math.cbrt(-q / 2 + Math.sqrt(discriminant));
        const v = Math.cbrt(-q / 2 - Math.sqrt(discriminant));
        const x = u + v - b / (3 * a);
        return [x.toFixed(6)];
    } else {
        const phi = Math.acos(-q / (2 * Math.sqrt(-p * p * p / 27)));
        const r = 2 * Math.sqrt(-p / 3);
        const x1 = r * Math.cos(phi / 3) - b / (3 * a);
        const x2 = r * Math.cos((phi + 2 * Math.PI) / 3) - b / (3 * a);
        const x3 = r * Math.cos((phi + 4 * Math.PI) / 3) - b / (3 * a);
        return [x1.toFixed(6), x2.toFixed(6), x3.toFixed(6)];
    }
}

function updateSystemVariableCount() {
    const varCount = parseInt(document.getElementById('system-var-count').value);
    const rows = document.getElementById('system-equations-rows');
    // Remove or add rows to match varCount
    while (rows.children.length > varCount) rows.removeChild(rows.lastElementChild);
    while (rows.children.length < varCount) {
        const i = rows.children.length + 1;
        const row = document.createElement('div');
        row.className = 'equation-row';
        row.innerHTML += `<div class="coefficient-input">
            <button type="button" class="sign-btn active" data-target="sys-a-${i}" data-sign="+">+</button>
            <button type="button" class="sign-btn" data-target="sys-a-${i}" data-sign="-">-</button>
            <input type="number" class="sys-a coeff-input" id="sys-a-${i}" placeholder="a${i}" step="any" min="0">
        </div>`;
        row.innerHTML += `<span class="var-label">x +</span>`;
        row.innerHTML += `<div class="coefficient-input">
            <button type="button" class="sign-btn active" data-target="sys-b-${i}" data-sign="+">+</button>
            <button type="button" class="sign-btn" data-target="sys-b-${i}" data-sign="-">-</button>
            <input type="number" class="sys-b coeff-input" id="sys-b-${i}" placeholder="b${i}" step="any" min="0">
        </div>`;
        if (varCount === 3) {
            row.innerHTML += `<span class="var-label">y +</span>`;
            row.innerHTML += `<div class="coefficient-input">
                <button type="button" class="sign-btn active" data-target="sys-c-${i}" data-sign="+">+</button>
                <button type="button" class="sign-btn" data-target="sys-c-${i}" data-sign="-">-</button>
                <input type="number" class="sys-c coeff-input" id="sys-c-${i}" placeholder="c${i}" step="any" min="0">
            </div>`;
            row.innerHTML += `<span class="var-label">z =</span>`;
            row.innerHTML += `<div class="coefficient-input">
                <button type="button" class="sign-btn active" data-target="sys-d-${i}" data-sign="+">+</button>
                <button type="button" class="sign-btn" data-target="sys-d-${i}" data-sign="-">-</button>
                <input type="number" class="sys-d coeff-input" id="sys-d-${i}" placeholder="d${i}" step="any" min="0">
            </div>`;
        } else {
            row.innerHTML += `<span class="var-label">y =</span>`;
            row.innerHTML += `<div class="coefficient-input">
                <button type="button" class="sign-btn active" data-target="sys-c-${i}" data-sign="+">+</button>
                <button type="button" class="sign-btn" data-target="sys-c-${i}" data-sign="-">-</button>
                <input type="number" class="sys-c coeff-input" id="sys-c-${i}" placeholder="c${i}" step="any" min="0">
            </div>`;
        }
        rows.appendChild(row);
    }
    // Update all rows to match the variable count (for label/field sync)
    Array.from(rows.children).forEach((row, i) => {
        row.innerHTML = '';
        row.innerHTML += `<div class="coefficient-input">
            <button type="button" class="sign-btn active" data-target="sys-a-${i+1}" data-sign="+">+</button>
            <button type="button" class="sign-btn" data-target="sys-a-${i+1}" data-sign="-">-</button>
            <input type="number" class="sys-a coeff-input" id="sys-a-${i+1}" placeholder="a${i+1}" step="any" min="0">
        </div>`;
        row.innerHTML += `<span class="var-label">x +</span>`;
        row.innerHTML += `<div class="coefficient-input">
            <button type="button" class="sign-btn active" data-target="sys-b-${i+1}" data-sign="+">+</button>
            <button type="button" class="sign-btn" data-target="sys-b-${i+1}" data-sign="-">-</button>
            <input type="number" class="sys-b coeff-input" id="sys-b-${i+1}" placeholder="b${i+1}" step="any" min="0">
        </div>`;
        if (varCount === 3) {
            row.innerHTML += `<span class="var-label">y +</span>`;
            row.innerHTML += `<div class="coefficient-input">
                <button type="button" class="sign-btn active" data-target="sys-c-${i+1}" data-sign="+">+</button>
                <button type="button" class="sign-btn" data-target="sys-c-${i+1}" data-sign="-">-</button>
                <input type="number" class="sys-c coeff-input" id="sys-c-${i+1}" placeholder="c${i+1}" step="any" min="0">
            </div>`;
            row.innerHTML += `<span class="var-label">z =</span>`;
            row.innerHTML += `<div class="coefficient-input">
                <button type="button" class="sign-btn active" data-target="sys-d-${i+1}" data-sign="+">+</button>
                <button type="button" class="sign-btn" data-target="sys-d-${i+1}" data-sign="-">-</button>
                <input type="number" class="sys-d coeff-input" id="sys-d-${i+1}" placeholder="d${i+1}" step="any" min="0">
            </div>`;
        } else {
            row.innerHTML += `<span class="var-label">y =</span>`;
            row.innerHTML += `<div class="coefficient-input">
                <button type="button" class="sign-btn active" data-target="sys-c-${i+1}" data-sign="+">+</button>
                <button type="button" class="sign-btn" data-target="sys-c-${i+1}" data-sign="-">-</button>
                <input type="number" class="sys-c coeff-input" id="sys-c-${i+1}" placeholder="c${i+1}" step="any" min="0">
            </div>`;
        }
    });
}

function solveSystemOfEquations() {
    const rows = document.querySelectorAll('#system-equations-rows .equation-row');
    const n = rows.length;
    const varCount = parseInt(document.getElementById('system-var-count').value);
    let A = [], B = [];
    for (let i = 0; i < n; i++) {
        let rowCoeffs = [];
        rowCoeffs.push(getCoefficientValue(`sys-a-${i+1}`));
        rowCoeffs.push(getCoefficientValue(`sys-b-${i+1}`));
        if (varCount === 3) {
            rowCoeffs.push(getCoefficientValue(`sys-c-${i+1}`));
            B.push(getCoefficientValue(`sys-d-${i+1}`));
        } else {
            B.push(getCoefficientValue(`sys-c-${i+1}`));
        }
        if (rowCoeffs.some(isNaN) || isNaN(B[B.length-1])) {
            return '<div class="error-message">Please enter valid coefficients.</div>';
        }
        A.push(rowCoeffs);
    }
    if (A.length !== varCount) {
        return `<div class='error-message'>Number of equations must match number of variables (${varCount}).</div>`;
    }
    // Solve Ax = B using Gaussian elimination
    function gaussianElimination(A, B) {
        const n = A.length;
        // Augment A with B
        let M = A.map((row, i) => row.concat([B[i]]));
        for (let i = 0; i < n; i++) {
            // Partial pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
            }
            [M[i], M[maxRow]] = [M[maxRow], M[i]];
            if (Math.abs(M[i][i]) < 1e-12) return null; // Singular
            // Eliminate below
            for (let k = i + 1; k < n; k++) {
                let c = M[k][i] / M[i][i];
                for (let j = i; j <= n; j++) {
                    M[k][j] -= c * M[i][j];
                }
            }
        }
        // Back substitution
        let x = Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            x[i] = M[i][n] / M[i][i];
            for (let k = i - 1; k >= 0; k--) {
                M[k][n] -= M[k][i] * x[i];
            }
        }
        return x;
    }
    const solution = gaussianElimination(A, B);
    if (!solution) {
        return '<div class="error-message">The system has no unique solution (singular or dependent equations).</div>';
    }
    const varNames = varCount === 3 ? ['x', 'y', 'z'] : ['x', 'y'];
    return `
        <div class="success-message">
            <h4>System of Equations Solution</h4>
            <p>Equations:</p>
            ${A.map((row, i) => `<p>${row.map((c, j) => `${c}${varNames[j]}`).join(' + ')} = ${B[i]}</p>`).join('')}
            <p>Solutions:</p>
            ${solution.map((val, i) => `<p>${varNames[i]} = ${val.toFixed(6)}</p>`).join('')}
        </div>
    `;
}

// Matrix Calculator Functions
function calculateMatrix() {
    const operation = document.getElementById('matrix-operation').value;
    const size = parseInt(document.getElementById('matrix-size').value);
    const matrixA = getMatrixData('matrix-a', size);
    const matrixB = (operation === 'add' || operation === 'multiply') ? getMatrixData('matrix-b', size) : null;
    if (!matrixA || ((operation === 'add' || operation === 'multiply') && !matrixB)) {
        displayResult('matrix-result', '<div class="error-message">Please enter valid matrix data.</div>');
        return;
    }
    let result = '';
    switch (operation) {
        case 'add':
            result = matrixAddition(matrixA, matrixB);
            break;
        case 'multiply':
            result = matrixMultiplication(matrixA, matrixB);
            break;
        case 'determinant':
            result = matrixDeterminant(matrixA);
            break;
        case 'inverse':
            result = matrixInverse(matrixA);
            break;
        case 'transpose':
            result = matrixTranspose(matrixA);
            break;
        default:
            result = '<div class="error-message">Operation not implemented yet.</div>';
    }
    displayResult('matrix-result', result);
    // Show/hide Matrix B input
    const matrixBContainer = document.getElementById('matrix-b-container');
    if (matrixBContainer) {
        if (operation === 'add' || operation === 'multiply') {
            matrixBContainer.style.display = '';
        } else {
            matrixBContainer.style.display = 'none';
        }
    }
}

function getMatrixData(matrixId, size) {
    const matrix = [];
    for (let i = 0; i < size; i++) {
        matrix[i] = [];
        for (let j = 0; j < size; j++) {
            const value = parseFloat(document.getElementById(`${matrixId}-${i}-${j}`).value);
            if (isNaN(value)) return null;
            matrix[i][j] = value;
        }
    }
    return matrix;
}

function matrixDeterminant(matrix) {
    const det = calculateDeterminant(matrix);
    return `
        <div class="success-message">
            <h4>Matrix Determinant</h4>
            <p>det(A) = ${det.toFixed(6)}</p>
        </div>
    `;
}

function calculateDeterminant(matrix) {
    const size = matrix.length;
    if (size === 1) return matrix[0][0];
    if (size === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let j = 0; j < size; j++) {
        const minor = [];
        for (let i = 1; i < size; i++) {
            minor[i - 1] = [];
            for (let k = 0; k < size; k++) {
                if (k !== j) {
                    minor[i - 1].push(matrix[i][k]);
                }
            }
        }
        det += matrix[0][j] * Math.pow(-1, j) * calculateDeterminant(minor);
    }
    return det;
}

function matrixTranspose(matrix) {
    const size = matrix.length;
    const result = [];
    
    for (let i = 0; i < size; i++) {
        result[i] = [];
        for (let j = 0; j < size; j++) {
            result[i][j] = matrix[j][i];
        }
    }
    
    return `
        <div class="success-message">
            <h4>Matrix Transpose</h4>
            <div class="matrix-result">${formatMatrix(result)}</div>
        </div>
    `;
}

function formatMatrix(matrix) {
    let html = '<table class="matrix-table">';
    for (let i = 0; i < matrix.length; i++) {
        html += '<tr>';
        for (let j = 0; j < matrix[i].length; j++) {
            html += `<td>${matrix[i][j].toFixed(6)}</td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    return html;
}

function matrixAddition(A, B) {
    const size = A.length;
    let result = [];
    for (let i = 0; i < size; i++) {
        result[i] = [];
        for (let j = 0; j < size; j++) {
            result[i][j] = A[i][j] + B[i][j];
        }
    }
    return `<div class="success-message"><h4>Matrix Addition</h4><div class="matrix-result">${formatMatrix(result)}</div></div>`;
}

function matrixMultiplication(A, B) {
    const size = A.length;
    let result = [];
    for (let i = 0; i < size; i++) {
        result[i] = [];
        for (let j = 0; j < size; j++) {
            let sum = 0;
            for (let k = 0; k < size; k++) {
                sum += A[i][k] * B[k][j];
            }
            result[i][j] = sum;
        }
    }
    return `<div class="success-message"><h4>Matrix Multiplication</h4><div class="matrix-result">${formatMatrix(result)}</div></div>`;
}

function matrixInverse(A) {
    const size = A.length;
    // Create augmented matrix [A | I]
    let M = A.map((row, i) => row.concat(Array(size).fill(0).map((_, j) => (i === j ? 1 : 0))));
    // Forward elimination
    for (let i = 0; i < size; i++) {
        // Find pivot
        let maxRow = i;
        for (let k = i + 1; k < size; k++) {
            if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
        }
        [M[i], M[maxRow]] = [M[maxRow], M[i]];
        if (Math.abs(M[i][i]) < 1e-12) return '<div class="error-message">Matrix is singular and cannot be inverted.</div>';
        // Normalize row
        let div = M[i][i];
        for (let j = 0; j < 2 * size; j++) M[i][j] /= div;
        // Eliminate other rows
        for (let k = 0; k < size; k++) {
            if (k !== i) {
                let c = M[k][i];
                for (let j = 0; j < 2 * size; j++) M[k][j] -= c * M[i][j];
            }
        }
    }
    // Extract inverse
    let inv = [];
    for (let i = 0; i < size; i++) {
        inv[i] = M[i].slice(size, 2 * size);
    }
    return `<div class="success-message"><h4>Matrix Inverse</h4><div class="matrix-result">${formatMatrix(inv)}</div></div>`;
}

// Statistics Functions
function calculateStatistics() {
    const dataInput = document.getElementById('statistics-data').value;
    const dataType = document.getElementById('data-type').value;
    
    if (!dataInput.trim()) {
        displayResult('statistics-result', '<div class="error-message">Please enter data.</div>');
        return;
    }
    
    const data = dataInput.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
    
    if (data.length === 0) {
        displayResult('statistics-result', '<div class="error-message">Please enter valid numeric data.</div>');
        return;
    }
    
    const stats = calculateAllStatistics(data, dataType);
    displayStatisticsResult(stats);
}

function calculateAllStatistics(data, dataType) {
    const sortedData = [...data].sort((a, b) => a - b);
    const n = data.length;
    
    const stats = {
        count: n,
        mean: data.reduce((sum, x) => sum + x, 0) / n,
        median: n % 2 === 0 ? (sortedData[n/2 - 1] + sortedData[n/2]) / 2 : sortedData[Math.floor(n/2)],
        mode: findMode(data),
        variance: calculateVariance(data, dataType),
        stdDev: Math.sqrt(calculateVariance(data, dataType)),
        range: sortedData[n - 1] - sortedData[0],
        min: sortedData[0],
        max: sortedData[n - 1]
    };
    
    return stats;
}

function findMode(data) {
    const frequency = {};
    data.forEach(x => frequency[x] = (frequency[x] || 0) + 1);
    
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency).filter(x => frequency[x] === maxFreq);
    
    return modes.length === data.length ? 'No mode' : modes.join(', ');
}

function calculateVariance(data, dataType) {
    const mean = data.reduce((sum, x) => sum + x, 0) / data.length;
    const squaredDiffs = data.map(x => Math.pow(x - mean, 2));
    const sumSquaredDiffs = squaredDiffs.reduce((sum, x) => sum + x, 0);
    
    return dataType === 'population' ? sumSquaredDiffs / data.length : sumSquaredDiffs / (data.length - 1);
}

function displayStatisticsResult(stats) {
    let html = '<div class="success-message"><h4>Statistical Analysis Results</h4>';
    
    if (document.getElementById('calc-mean')) {
        html += `<p><strong>Mean:</strong> ${stats.mean.toFixed(6)}</p>`;
    }
    if (document.getElementById('calc-median')) {
        html += `<p><strong>Median:</strong> ${stats.median.toFixed(6)}</p>`;
    }
    if (document.getElementById('calc-mode')) {
        html += `<p><strong>Mode:</strong> ${stats.mode}</p>`;
    }
    if (document.getElementById('calc-variance')) {
        html += `<p><strong>Variance:</strong> ${stats.variance.toFixed(6)}</p>`;
    }
    if (document.getElementById('calc-stddev')) {
        html += `<p><strong>Standard Deviation:</strong> ${stats.stdDev.toFixed(6)}</p>`;
    }
    if (document.getElementById('calc-range')) {
        html += `<p><strong>Range:</strong> ${stats.range.toFixed(6)}</p>`;
    }
    
    html += '</div>';
    displayResult('statistics-result', html);
}

// Geometry Functions
function calculateGeometry() {
    const shape = document.getElementById('geometry-shape').value;
    let result = '';
    
    switch (shape) {
        case 'circle':
            result = calculateCircle();
            break;
        case 'rectangle':
            result = calculateRectangle();
            break;
        case 'triangle':
            result = calculateTriangle();
            break;
        case 'square':
            result = calculateSquare();
            break;
        case 'parallelogram':
            result = calculateParallelogram();
            break;
        case 'trapezoid':
            result = calculateTrapezoid();
            break;
        case 'sphere':
            result = calculateSphere();
            break;
        case 'cube':
            result = calculateCube();
            break;
        case 'cylinder':
            result = calculateCylinder();
            break;
        case 'cone':
            result = calculateCone();
            break;
    }
    
    displayResult('geometry-result', result);
}

function calculateCircle() {
    const radius = parseFloat(document.getElementById('circle-radius').value);
    if (isNaN(radius) || radius <= 0) {
        return '<div class="error-message">Please enter a valid positive radius.</div>';
    }
    
    const area = Math.PI * radius * radius;
    const circumference = 2 * Math.PI * radius;
    
    return `
        <div class="success-message">
            <h4>Circle Calculations</h4>
            <p><strong>Radius:</strong> ${radius}</p>
            <p><strong>Area:</strong> ${area.toFixed(6)}</p>
            <p><strong>Circumference:</strong> ${circumference.toFixed(6)}</p>
        </div>
    `;
}

function calculateRectangle() {
    const length = parseFloat(document.getElementById('rect-length').value);
    const width = parseFloat(document.getElementById('rect-width').value);
    
    if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
        return '<div class="error-message">Please enter valid positive dimensions.</div>';
    }
    
    const area = length * width;
    const perimeter = 2 * (length + width);
    
    return `
        <div class="success-message">
            <h4>Rectangle Calculations</h4>
            <p><strong>Length:</strong> ${length}</p>
            <p><strong>Width:</strong> ${width}</p>
            <p><strong>Area:</strong> ${area.toFixed(6)}</p>
            <p><strong>Perimeter:</strong> ${perimeter.toFixed(6)}</p>
        </div>
    `;
}

function updateTriangleInputs() {
    const method = document.getElementById('triangle-method').value;
    document.getElementById('triangle-base-height-inputs').style.display = (method === 'base-height') ? '' : 'none';
    document.getElementById('triangle-three-sides-inputs').style.display = (method === 'three-sides') ? '' : 'none';
}

function calculateTriangle() {
    const method = document.getElementById('triangle-method') ? document.getElementById('triangle-method').value : 'base-height';
    if (method === 'base-height') {
        const base = parseFloat(document.getElementById('tri-base').value);
        const height = parseFloat(document.getElementById('tri-height').value);
        if (isNaN(base) || isNaN(height) || base <= 0 || height <= 0) {
            return '<div class="error-message">Please enter valid positive base and height.</div>';
        }
        const area = 0.5 * base * height;
        return `
            <div class="success-message">
                <h4>Triangle Calculations (Base & Height)</h4>
                <p><strong>Base:</strong> ${base}</p>
                <p><strong>Height:</strong> ${height}</p>
                <p><strong>Area:</strong> ${area.toFixed(6)}</p>
            </div>
        `;
    } else if (method === 'three-sides') {
        const a = parseFloat(document.getElementById('tri-side1').value);
        const b = parseFloat(document.getElementById('tri-side2').value);
        const c = parseFloat(document.getElementById('tri-side3').value);
        if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) {
            return '<div class="error-message">Please enter valid positive values for all three sides.</div>';
        }
        // Check triangle inequality
        if (a + b <= c || a + c <= b || b + c <= a) {
            return '<div class="error-message">The side lengths do not form a valid triangle.</div>';
        }
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        return `
            <div class="success-message">
                <h4>Triangle Calculations (3 Sides)</h4>
                <p><strong>Side 1:</strong> ${a}</p>
                <p><strong>Side 2:</strong> ${b}</p>
                <p><strong>Side 3:</strong> ${c}</p>
                <p><strong>Area:</strong> ${area.toFixed(6)}</p>
            </div>
        `;
    }
    return '<div class="error-message">Invalid triangle calculation method.</div>';
}

function calculateSphere() {
    const radius = parseFloat(document.getElementById('sphere-radius').value);
    if (isNaN(radius) || radius <= 0) {
        return '<div class="error-message">Please enter a valid positive radius.</div>';
    }
    
    const volume = (4/3) * Math.PI * Math.pow(radius, 3);
    const surfaceArea = 4 * Math.PI * Math.pow(radius, 2);
    
    return `
        <div class="success-message">
            <h4>Sphere Calculations</h4>
            <p><strong>Radius:</strong> ${radius}</p>
            <p><strong>Volume:</strong> ${volume.toFixed(6)}</p>
            <p><strong>Surface Area:</strong> ${surfaceArea.toFixed(6)}</p>
        </div>
    `;
}

function calculateCube() {
    const side = parseFloat(document.getElementById('cube-side').value);
    if (isNaN(side) || side <= 0) {
        return '<div class="error-message">Please enter a valid positive side length.</div>';
    }
    
    const volume = Math.pow(side, 3);
    const surfaceArea = 6 * Math.pow(side, 2);
    
    return `
        <div class="success-message">
            <h4>Cube Calculations</h4>
            <p><strong>Side Length:</strong> ${side}</p>
            <p><strong>Volume:</strong> ${volume.toFixed(6)}</p>
            <p><strong>Surface Area:</strong> ${surfaceArea.toFixed(6)}</p>
        </div>
    `;
}

function calculateCylinder() {
    const radius = parseFloat(document.getElementById('cylinder-radius').value);
    const height = parseFloat(document.getElementById('cylinder-height').value);
    
    if (isNaN(radius) || isNaN(height) || radius <= 0 || height <= 0) {
        return '<div class="error-message">Please enter valid positive dimensions.</div>';
    }
    
    const volume = Math.PI * Math.pow(radius, 2) * height;
    const surfaceArea = 2 * Math.PI * radius * (radius + height);
    
    return `
        <div class="success-message">
            <h4>Cylinder Calculations</h4>
            <p><strong>Radius:</strong> ${radius}</p>
            <p><strong>Height:</strong> ${height}</p>
            <p><strong>Volume:</strong> ${volume.toFixed(6)}</p>
            <p><strong>Surface Area:</strong> ${surfaceArea.toFixed(6)}</p>
        </div>
    `;
}

function calculateCone() {
    const radius = parseFloat(document.getElementById('cone-radius').value);
    const height = parseFloat(document.getElementById('cone-height').value);
    
    if (isNaN(radius) || isNaN(height) || radius <= 0 || height <= 0) {
        return '<div class="error-message">Please enter valid positive dimensions.</div>';
    }
    
    const volume = (1/3) * Math.PI * Math.pow(radius, 2) * height;
    const slantHeight = Math.sqrt(Math.pow(radius, 2) + Math.pow(height, 2));
    const surfaceArea = Math.PI * radius * (radius + slantHeight);
    
    return `
        <div class="success-message">
            <h4>Cone Calculations</h4>
            <p><strong>Radius:</strong> ${radius}</p>
            <p><strong>Height:</strong> ${height}</p>
            <p><strong>Volume:</strong> ${volume.toFixed(6)}</p>
            <p><strong>Surface Area:</strong> ${surfaceArea.toFixed(6)}</p>
        </div>
    `;
}

function calculateSquare() {
    const side = parseFloat(document.getElementById('square-side').value);
    if (isNaN(side) || side <= 0) {
        return '<div class="error-message">Please enter a valid positive side length.</div>';
    }
    const area = side * side;
    const perimeter = 4 * side;
    return `
        <div class="success-message">
            <h4>Square Calculations</h4>
            <p><strong>Side:</strong> ${side}</p>
            <p><strong>Area:</strong> ${area.toFixed(6)}</p>
            <p><strong>Perimeter:</strong> ${perimeter.toFixed(6)}</p>
        </div>
    `;
}

function calculateParallelogram() {
    const base = parseFloat(document.getElementById('parallelogram-base').value);
    const height = parseFloat(document.getElementById('parallelogram-height').value);
    const side = parseFloat(document.getElementById('parallelogram-side').value);
    if (isNaN(base) || isNaN(height) || isNaN(side) || base <= 0 || height <= 0 || side <= 0) {
        return '<div class="error-message">Please enter valid positive values for base, height, and side.</div>';
    }
    const area = base * height;
    const perimeter = 2 * (base + side);
    return `
        <div class="success-message">
            <h4>Parallelogram Calculations</h4>
            <p><strong>Base:</strong> ${base}</p>
            <p><strong>Height:</strong> ${height}</p>
            <p><strong>Side:</strong> ${side}</p>
            <p><strong>Area:</strong> ${area.toFixed(6)}</p>
            <p><strong>Perimeter:</strong> ${perimeter.toFixed(6)}</p>
        </div>
    `;
}

function calculateTrapezoid() {
    const base1 = parseFloat(document.getElementById('trapezoid-base1').value);
    const base2 = parseFloat(document.getElementById('trapezoid-base2').value);
    const height = parseFloat(document.getElementById('trapezoid-height').value);
    const side1 = parseFloat(document.getElementById('trapezoid-side1').value);
    const side2 = parseFloat(document.getElementById('trapezoid-side2').value);
    if (isNaN(base1) || isNaN(base2) || isNaN(height) || isNaN(side1) || isNaN(side2) || base1 <= 0 || base2 <= 0 || height <= 0 || side1 <= 0 || side2 <= 0) {
        return '<div class="error-message">Please enter valid positive values for all fields.</div>';
    }
    const area = 0.5 * (base1 + base2) * height;
    const perimeter = base1 + base2 + side1 + side2;
    return `
        <div class="success-message">
            <h4>Trapezoid Calculations</h4>
            <p><strong>Base 1:</strong> ${base1}</p>
            <p><strong>Base 2:</strong> ${base2}</p>
            <p><strong>Height:</strong> ${height}</p>
            <p><strong>Side 1:</strong> ${side1}</p>
            <p><strong>Side 2:</strong> ${side2}</p>
            <p><strong>Area:</strong> ${area.toFixed(6)}</p>
            <p><strong>Perimeter:</strong> ${perimeter.toFixed(6)}</p>
        </div>
    `;
}

// Utility Functions
function displayResult(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = content;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Equation type change handlers
    const equationTypes = document.querySelectorAll('input[name="equation-type"]');
    const inputSections = document.querySelectorAll('.equation-input-section');
    
    equationTypes.forEach(type => {
        type.addEventListener('change', function() {
            inputSections.forEach(section => section.style.display = 'none');
            const targetSection = document.getElementById(`${this.value}-inputs`);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        });
    });
    
    // Matrix size change handler
    const matrixSize = document.getElementById('matrix-size');
    if (matrixSize) {
        matrixSize.addEventListener('change', function() {
            createMatrixInputs('matrix-a', parseInt(this.value));
            createMatrixInputs('matrix-b', parseInt(this.value));
        });
    }
    
    // Geometry shape change handler
    const geometryShape = document.getElementById('geometry-shape');
    if (geometryShape) {
        geometryShape.addEventListener('change', function() {
            const inputSections = document.querySelectorAll('.shape-input-section');
            inputSections.forEach(section => section.style.display = 'none');
            const targetSection = document.getElementById(`${this.value}-inputs`);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        });
    }
    
    // Initialize matrix inputs
    if (matrixSize) {
        createMatrixInputs('matrix-a', parseInt(matrixSize.value));
        createMatrixInputs('matrix-b', parseInt(matrixSize.value));
    }
    
    if (document.getElementById('triangle-method')) {
        updateTriangleInputs();
        document.getElementById('triangle-method').addEventListener('change', updateTriangleInputs);
    }
    
    // Initialize sign buttons for equation solver
    initializeSignButtons();
});

function createMatrixInputs(matrixId, size) {
    const container = document.getElementById(matrixId);
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.id = `${matrixId}-${i}-${j}`;
            input.placeholder = '0';
            input.style.width = '60px';
            input.style.margin = '2px';
            container.appendChild(input);
        }
        container.appendChild(document.createElement('br'));
    }
}

function calculateBinary() {
    const num1 = document.getElementById('binary-num1').value.trim();
    const num2 = document.getElementById('binary-num2').value.trim();
    const operation = document.getElementById('binary-operation').value;
    let resultBin = '', resultDec = '';
    // Validate input
    if (!/^[01]+$/.test(num1)) {
        displayResult('binary-result', '<div class="error-message">Please enter a valid binary number for Number 1.</div>');
        return;
    }
    if (['and','or','xor','add','subtract','multiply','divide'].includes(operation) && !/^[01]+$/.test(num2)) {
        displayResult('binary-result', '<div class="error-message">Please enter a valid binary number for Number 2.</div>');
        return;
    }
    const a = parseInt(num1, 2);
    const b = /^[01]+$/.test(num2) ? parseInt(num2, 2) : 0;
    switch (operation) {
        case 'and':
            resultBin = (a & b).toString(2);
            resultDec = (a & b).toString(10);
            break;
        case 'or':
            resultBin = (a | b).toString(2);
            resultDec = (a | b).toString(10);
            break;
        case 'xor':
            resultBin = (a ^ b).toString(2);
            resultDec = (a ^ b).toString(10);
            break;
        case 'not':
            // For NOT, use 32 bits for display, but trim leading 1's for negative numbers
            let notVal = (~a >>> 0).toString(2);
            resultBin = notVal.replace(/^1+(?=0)/, '');
            resultDec = (~a >>> 0).toString(10);
            break;
        case 'add':
            resultBin = (a + b).toString(2);
            resultDec = (a + b).toString(10);
            break;
        case 'subtract':
            resultBin = (a - b).toString(2);
            resultDec = (a - b).toString(10);
            break;
        case 'multiply':
            resultBin = (a * b).toString(2);
            resultDec = (a * b).toString(10);
            break;
        case 'divide':
            if (b === 0) {
                displayResult('binary-result', '<div class="error-message">Cannot divide by zero.</div>');
                return;
            }
            resultBin = Math.floor(a / b).toString(2);
            resultDec = Math.floor(a / b).toString(10);
            break;
        default:
            displayResult('binary-result', '<div class="error-message">Invalid operation.</div>');
            return;
    }
    displayResult('binary-result', `<div class="success-message"><h4>Binary Calculation Result</h4><p>Binary: <strong>${resultBin}</strong></p><p>Decimal: <strong>${resultDec}</strong></p></div>`);
}
