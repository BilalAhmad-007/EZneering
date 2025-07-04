// Developer Tools JavaScript - Basic functionality

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                ${type === 'success' ? '✓' : '✕'}
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

// Expression Converter Functions
function initExpressionConverter() {
    const convertBtn = document.getElementById('convert-expression-btn');
    const exampleItems = document.querySelectorAll('#expression-converter .example-item');
    
    console.log('Initializing Expression Converter...');
    console.log('Found convert button:', convertBtn);
    console.log('Found example items:', exampleItems.length);
    
    if (convertBtn) {
        convertBtn.addEventListener('click', convertExpression);
    }
    
    // Add click handlers for example items
    exampleItems.forEach((item, index) => {
        console.log(`Adding event listener to example item ${index + 1}:`, item);
        item.addEventListener('click', () => {
            console.log('Example item clicked:', item);
            const inputType = item.getAttribute('data-input-type');
            const outputType = item.getAttribute('data-output-type');
            const expression = item.getAttribute('data-expression');
            
            console.log('Example data:', { inputType, outputType, expression });
            
            // Set the input and output types
            const inputTypeSelect = document.getElementById('input-expression-type');
            const outputTypeSelect = document.getElementById('output-expression-type');
            const expressionInput = document.getElementById('expression-input');
            
            if (inputTypeSelect && outputTypeSelect && expressionInput) {
                inputTypeSelect.value = inputType;
                outputTypeSelect.value = outputType;
                expressionInput.value = expression;
                
                // Convert immediately
                convertExpression();
                
                // Add visual feedback
                item.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    item.style.transform = '';
                }, 150);
            } else {
                console.error('Could not find required elements:', { inputTypeSelect, outputTypeSelect, expressionInput });
            }
        });
    });
}

function convertExpression() {
    const inputType = document.getElementById('input-expression-type').value;
    const outputType = document.getElementById('output-expression-type').value;
    const expression = document.getElementById('expression-input').value.trim();
    const resultDisplay = document.getElementById('expression-result');
    
    if (!expression) {
        showExpressionError('Please enter an expression.');
        return;
    }
    
    if (inputType === outputType) {
        showExpressionError('Input and output types cannot be the same.');
        return;
    }
    
    try {
        let result;
        
        // Handle different conversion paths
        if (inputType === 'infix' && outputType === 'postfix') {
            result = infixToPostfix(expression);
        } else if (inputType === 'infix' && outputType === 'prefix') {
            result = infixToPrefix(expression);
        } else if (inputType === 'postfix' && outputType === 'infix') {
            result = postfixToInfix(expression);
        } else if (inputType === 'postfix' && outputType === 'prefix') {
            result = postfixToPrefix(expression);
        } else if (inputType === 'prefix' && outputType === 'infix') {
            result = prefixToInfix(expression);
        } else if (inputType === 'prefix' && outputType === 'postfix') {
            result = prefixToPostfix(expression);
        } else {
            showExpressionError('Unsupported conversion type.');
            return;
        }
        
        // Display result
        resultDisplay.innerHTML = `<span class="result-text">${result}</span>`;
        showExpressionSuccess('Expression converted successfully!');
        
    } catch (error) {
        showExpressionError('Invalid expression: ' + error.message);
    }
}

// Update all notification functions
function showExpressionSuccess(message) {
    showSuccess(message);
}

function showExpressionError(message) {
    showError(message);
}

function showBSTSuccess(message) {
    showSuccess(message);
}

function showBSTError(message) {
    showError(message);
}

function showTreeSuccess(message) {
    showSuccess(message);
}

function showTreeError(message) {
    showError(message);
}

// Expression conversion algorithms
function infixToPostfix(infix) {
    const precedence = {
        '+': 1, '-': 1,
        '*': 2, '/': 2,
        '^': 3
    };

    const output = [];
    const stack = [];
    const tokens = infix.replace(/\s+/g, '').split('');

    for (let token of tokens) {
        if (token.match(/[A-Za-z0-9]/)) {
            output.push(token);
        } else if (token === '(') {
            stack.push(token);
        } else if (token === ')') {
            while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                output.push(stack.pop());
            }
            if (stack.length > 0 && stack[stack.length - 1] === '(') {
                stack.pop();
            }
        } else {
            while (stack.length > 0 && 
                   stack[stack.length - 1] !== '(' && 
                   precedence[stack[stack.length - 1]] >= precedence[token]) {
                output.push(stack.pop());
            }
            stack.push(token);
        }
    }

    while (stack.length > 0) {
        output.push(stack.pop());
    }

    return output.join(' ');
}

function infixToPrefix(infix) {
    const reversed = infix.split('').reverse().join('');
    const replaced = reversed.replace(/\(/g, 'temp').replace(/\)/g, '(').replace(/temp/g, ')');
    const postfix = infixToPostfix(replaced);
    return postfix.split('').reverse().join('');
}

function postfixToInfix(postfix) {
    const stack = [];
    const tokens = postfix.split(/\s+/);

    for (let token of tokens) {
        if (token.match(/[A-Za-z0-9]/)) {
            stack.push(token);
        } else {
            const b = stack.pop();
            const a = stack.pop();
            stack.push(`(${a}${token}${b})`);
        }
    }

    return stack[0];
}

// Additional conversion functions
function postfixToPrefix(postfix) {
    const infix = postfixToInfix(postfix);
    return infixToPrefix(infix);
}

function prefixToInfix(prefix) {
    const stack = [];
    const tokens = prefix.split('').reverse();

    for (let token of tokens) {
        if (token.match(/[A-Za-z0-9]/)) {
            stack.push(token);
        } else {
            const a = stack.pop();
            const b = stack.pop();
            stack.push(`(${a}${token}${b})`);
        }
    }

    return stack[0];
}

function prefixToPostfix(prefix) {
    const infix = prefixToInfix(prefix);
    return infixToPostfix(infix);
}

// BST Functions
function initBSTConverter() {
    const createBtn = document.getElementById('create-bst-btn');
    const exampleItems = document.querySelectorAll('#bst-converter .example-item');
    
    if (createBtn) {
        createBtn.addEventListener('click', createBST);
    }
    
    // Add click handlers for example items
    exampleItems.forEach(item => {
        item.addEventListener('click', () => {
            const numbers = item.getAttribute('data-numbers');
            document.getElementById('bst-input').value = numbers;
            createBST();
        });
    });
}

function createBST() {
    const input = document.getElementById('bst-input').value.trim();
    const canvas = document.getElementById('bst-canvas');
    const canvasPlaceholder = document.getElementById('bst-canvas-placeholder');
    
    if (!input) {
        showBSTError('Please enter numbers.');
        if (canvasPlaceholder) canvasPlaceholder.style.display = '';
        if (canvas) { const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height); }
        return;
    }
    
    try {
        const numbers = input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        if (numbers.length === 0) {
            showBSTError('Please enter valid numbers.');
            if (canvasPlaceholder) canvasPlaceholder.style.display = '';
            if (canvas) { const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height); }
            return;
        }
        
        // Build BST
        const root = buildBST(numbers);
        
        // Store current BST and set default zoom
        window.currentBST = root;
        window.bstZoom = 0.7;
        
        // Calculate layout and get width/height
        const nodeRadius = 32;
        const hSpacing = 32;
        const vSpacing = 80;
        let maxX = 0, minX = 0, maxY = 0;
        function layoutBST(node, depth, x) {
            if (!node) return x;
            x = layoutBST(node.left, depth + 1, x);
            node.x = x;
            node.y = depth;
            x++;
            x = layoutBST(node.right, depth + 1, x);
            return x;
        }
        layoutBST(root, 0, 0);
        // Find min/max x/y
        function findMinMax(node) {
            if (!node) return;
            if (node.x < minX) minX = node.x;
            if (node.x > maxX) maxX = node.x;
            if (node.y > maxY) maxY = node.y;
            findMinMax(node.left);
            findMinMax(node.right);
        }
        minX = Infinity; maxX = -Infinity; maxY = 0;
        findMinMax(root);
        // Set canvas size
        const width = (maxX - minX + 1) * (nodeRadius * 2 + hSpacing) + 2 * nodeRadius;
        const height = (maxY + 1) * (nodeRadius * 2 + vSpacing) + 2 * nodeRadius;
        canvas.width = Math.max(width, 800);
        canvas.height = Math.max(height, 400);
        // Center nodes horizontally
        function offsetX(node, dx) {
            if (!node) return;
            node.x += dx;
            offsetX(node.left, dx);
            offsetX(node.right, dx);
        }
        offsetX(root, Math.floor((canvas.width / (nodeRadius * 2 + hSpacing) - (maxX - minX + 1)) / 2));
        // Hide placeholder
        if (canvasPlaceholder) canvasPlaceholder.style.display = 'none';
        // Draw the tree
        drawBST(canvas, root, nodeRadius, hSpacing, vSpacing);
        // Display traversals
        displayTraversals(root);
        displayBSTInfo(root);
        showBSTSuccess('BST created successfully!');
    } catch (error) {
        console.error('BST creation error:', error);
        showBSTError('Error creating BST: ' + error.message);
        if (canvasPlaceholder) canvasPlaceholder.style.display = '';
        if (canvas) { const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height); }
    }
}

function drawBST(canvas, root, nodeRadius = 32, hSpacing = 32, vSpacing = 80) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const zoom = window.bstZoom || 1;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.scale(zoom, zoom);
    // Draw recursively
    function drawNode(node) {
        if (!node) return;
        // Draw left line
        if (node.left) {
            ctx.beginPath();
            ctx.moveTo(node.x * (nodeRadius * 2 + hSpacing) + nodeRadius, node.y * (nodeRadius * 2 + vSpacing) + nodeRadius);
            ctx.lineTo(node.left.x * (nodeRadius * 2 + hSpacing) + nodeRadius, node.left.y * (nodeRadius * 2 + vSpacing) + nodeRadius);
            ctx.strokeStyle = '#6b7280';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        // Draw right line
        if (node.right) {
            ctx.beginPath();
            ctx.moveTo(node.x * (nodeRadius * 2 + hSpacing) + nodeRadius, node.y * (nodeRadius * 2 + vSpacing) + nodeRadius);
            ctx.lineTo(node.right.x * (nodeRadius * 2 + hSpacing) + nodeRadius, node.right.y * (nodeRadius * 2 + vSpacing) + nodeRadius);
            ctx.strokeStyle = '#6b7280';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x * (nodeRadius * 2 + hSpacing) + nodeRadius, node.y * (nodeRadius * 2 + vSpacing) + nodeRadius, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
        ctx.strokeStyle = '#1d4ed8';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Draw value
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.value, node.x * (nodeRadius * 2 + hSpacing) + nodeRadius, node.y * (nodeRadius * 2 + vSpacing) + nodeRadius);
        // Draw children
        drawNode(node.left);
        drawNode(node.right);
    }
    drawNode(root);
    ctx.restore();
}

function resetBSTView() {
    window.bstZoom = 0.7;
    const canvas = document.getElementById('bst-canvas');
    if (window.currentBST && canvas) {
        drawBST(canvas, window.currentBST);
    }
}

// BST Node class
class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
    }
}

function buildBST(numbers) {
    let root = null;
    for (let num of numbers) {
        root = insertBST(root, num);
    }
    return root;
}

function insertBST(root, value) {
    if (!root) {
        return new BSTNode(value);
    }
    
    if (value < root.value) {
        root.left = insertBST(root.left, value);
    } else {
        root.right = insertBST(root.right, value);
    }
    
    return root;
}

// Display tree traversals
function displayTraversals(root) {
    const inorder = [];
    const preorder = [];
    const postorder = [];
    
    inorderTraversal(root, inorder);
    preorderTraversal(root, preorder);
    postorderTraversal(root, postorder);
    
    document.getElementById('inorder-result').textContent = inorder.join(' → ');
    document.getElementById('preorder-result').textContent = preorder.join(' → ');
    document.getElementById('postorder-result').textContent = postorder.join(' → ');
}

function inorderTraversal(node, result) {
    if (node) {
        inorderTraversal(node.left, result);
        result.push(node.value);
        inorderTraversal(node.right, result);
    }
}

function preorderTraversal(node, result) {
    if (node) {
        result.push(node.value);
        preorderTraversal(node.left, result);
        preorderTraversal(node.right, result);
    }
}

function postorderTraversal(node, result) {
    if (node) {
        postorderTraversal(node.left, result);
        postorderTraversal(node.right, result);
        result.push(node.value);
    }
}

// Normalization Functions
function addFD() {
    const fdList = document.getElementById('fd-list');
    const newFD = document.createElement('div');
    newFD.className = 'fd-item';
    newFD.innerHTML = `
        <div class="fd-inputs">
            <div class="fd-left-container">
                <label>Left Side (Determinant)</label>
                <input type="text" class="fd-left" placeholder="A,B">
            </div>
            <div class="fd-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                </svg>
            </div>
            <div class="fd-right-container">
                <label>Right Side (Dependent)</label>
                <input type="text" class="fd-right" placeholder="C">
            </div>
        </div>
        <button class="btn btn-danger remove-fd-btn" onclick="removeFD(this)">
            ✕
        </button>
    `;
    fdList.appendChild(newFD);
    
    // Add animation
    newFD.style.opacity = '0';
    newFD.style.transform = 'translateY(20px)';
    setTimeout(() => {
        newFD.style.transition = 'all 0.3s ease';
        newFD.style.opacity = '1';
        newFD.style.transform = 'translateY(0)';
    }, 10);
}

function removeFD(button) {
    const fdItem = button.parentElement;
    fdItem.style.transition = 'all 0.3s ease';
    fdItem.style.opacity = '0';
    fdItem.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        fdItem.remove();
    }, 300);
}

function checkNormalization() {
    const fdItems = document.querySelectorAll('.fd-item');
    const fds = [];
    const resultDisplay = document.getElementById('normalization-result');
    // Clear previous results
    resultDisplay.innerHTML = '';
    for (let item of fdItems) {
        const left = item.querySelector('.fd-left').value.trim();
        const right = item.querySelector('.fd-right').value.trim();
        if (left && right) {
            fds.push({ 
                left: left.split(',').map(s => s.trim()), 
                right: right.split(',').map(s => s.trim()) 
            });
        }
    }
    if (fds.length === 0) {
        showError('Please add at least one functional dependency.');
        return;
    }
    // Show animated loading state
    resultDisplay.innerHTML = `
        <div class="result-placeholder fade-in">
            <div class="loading-spinner animated-spinner"></div>
            <p>Analyzing normalization...</p>
        </div>
    `;
    // Simulate processing time for better UX
    setTimeout(() => {
        try {
            const result = analyzeNormalization(fds);
            // Fade in the result
            resultDisplay.innerHTML = `<div class='fade-in'>${result}</div>`;
            // Confetti effect if BCNF is achieved
            if (result.includes('🎉') && typeof confetti === 'function') {
                confetti();
            }
            showSuccess('Normalization analysis completed!');
        } catch (error) {
            console.error('Error during analysis:', error);
            resultDisplay.innerHTML = `
                <div class="result-placeholder fade-in">
                    <p>Error during analysis: ${error.message}</p>
                </div>
            `;
            showError('Analysis failed: ' + error.message);
        }
    }, 1000);
}

function analyzeNormalization(fds) {
    let result = '<div class="analysis-result">';
    // Header
    result += '<div class="analysis-header"><h4><span class="result-icon">📊</span> Normalization Analysis Report</h4>';
    result += '<p>Analysis of your database schema based on functional dependencies</p></div>';
    // Functional Dependencies Summary
    result += '<div class="analysis-section"><h5>Functional Dependencies</h5><div class="fd-summary">';
    fds.forEach((fd, index) => {
        result += `<div class="fd-display"><span class="fd-number">${index + 1}</span><span class="fd-left">${fd.left.join(', ')}</span><span class="fd-arrow">→</span><span class="fd-right">${fd.right.join(', ')}</span></div>`;
    });
    result += '</div></div>';
    // Primary Key Analysis
    result += '<div class="analysis-section"><h5>Primary Key Analysis</h5>';
    const primaryKeys = findPrimaryKeys(fds);
    if (primaryKeys.length > 0) {
        result += '<div class="pk-display">';
        result += '<p class="result-key"><span class="result-icon">🔑</span> Candidate Primary Key(s):</p>';
        primaryKeys.forEach((pk, index) => {
            result += `<div class="pk-item"><span class="pk-number">${index + 1}</span><span class="pk-attributes">${pk.join(', ')}</span></div>`;
        });
        result += '</div>';
    } else {
        result += '<p class="pk-placeholder result-warning"><span class="result-icon">⚠️</span> Unable to determine primary key from given functional dependencies.</p>';
    }
    result += '</div>';
    // Normalization Analysis (sequential)
    result += '<div class="analysis-section"><h5>Normalization Status</h5>';
    // 1NF (assume always PASS for this tool)
    result += '<div class="norm-check fade-in"><div class="norm-header"><span class="norm-name">1NF (First Normal Form)</span><span class="norm-status result-success"><span class="result-icon">✅</span>PASS</span></div><p class="norm-description">All attributes contain atomic values</p></div>';
    // 2NF
    const hasPartialDependency = checkPartialDependency(fds);
    let in2NF = !hasPartialDependency;
    result += '<div class="norm-check fade-in"><div class="norm-header"><span class="norm-name">2NF (Second Normal Form)</span>';
    if (in2NF) {
        result += '<span class="norm-status result-success"><span class="result-icon">✅</span>PASS</span></div><p class="norm-description">No partial dependencies found</p>';
    } else {
        result += '<span class="norm-status result-warning"><span class="result-icon">⚠️</span>FAIL</span></div><p class="norm-description">Partial dependencies detected</p>';
    }
    result += '</div>';
    // 3NF
    let in3NF = false;
    let hasTransitiveDependency = false;
    if (in2NF) {
        hasTransitiveDependency = checkTransitiveDependency(fds);
        in3NF = !hasTransitiveDependency;
    }
    result += '<div class="norm-check fade-in"><div class="norm-header"><span class="norm-name">3NF (Third Normal Form)</span>';
    if (!in2NF) {
        result += '<span class="norm-status result-warning"><span class="result-icon">⚠️</span>N/A</span></div><p class="norm-description">Relation must be in 2NF before 3NF can be checked</p>';
    } else if (in3NF) {
        result += '<span class="norm-status result-success"><span class="result-icon">✅</span>PASS</span></div><p class="norm-description">No transitive dependencies found</p>';
    } else {
        result += '<span class="norm-status result-warning"><span class="result-icon">⚠️</span>FAIL</span></div><p class="norm-description">Transitive dependencies detected</p>';
    }
    result += '</div>';
    // BCNF
    let inBCNF = false;
    let hasBCNFViolation = false;
    if (in3NF) {
        hasBCNFViolation = checkBCNFViolation(fds);
        inBCNF = !hasBCNFViolation;
    }
    result += '<div class="norm-check fade-in"><div class="norm-header"><span class="norm-name">BCNF (Boyce-Codd Normal Form)</span>';
    if (!in3NF) {
        result += '<span class="norm-status result-warning"><span class="result-icon">⚠️</span>N/A</span></div><p class="norm-description">Relation must be in 3NF before BCNF can be checked</p>';
    } else if (inBCNF) {
        result += '<span class="norm-status result-success"><span class="result-icon">🎉</span>PASS</span></div><p class="norm-description">All functional dependencies have superkeys as determinants</p>';
    } else {
        result += '<span class="norm-status result-warning"><span class="result-icon">⚠️</span>FAIL</span></div><p class="norm-description">Non-superkey determinants found - consider decomposition</p>';
    }
    result += '</div>';
    result += '</div>';
    // Recommendations & Highest Normal Form
    result += '<div class="analysis-section"><h5>Recommendations</h5><div class="recommendations">';
    let highestNF = '1NF';
    if (in2NF) highestNF = '2NF';
    if (in3NF) highestNF = '3NF';
    if (inBCNF) highestNF = 'BCNF';
    if (!in2NF) {
        result += '<div class="recommendation result-warning fade-in"><span class="rec-icon">💡</span><div class="rec-content"><strong>Consider 2NF:</strong> Remove partial dependencies by creating new relations.</div></div>';
    } else if (!in3NF) {
        result += '<div class="recommendation result-warning fade-in"><span class="rec-icon">💡</span><div class="rec-content"><strong>Consider 3NF:</strong> Remove transitive dependencies by creating separate tables.</div></div>';
    } else if (!inBCNF) {
        result += '<div class="recommendation result-warning fade-in"><span class="rec-icon">💡</span><div class="rec-content"><strong>Consider BCNF:</strong> Decompose to ensure all determinants are superkeys.</div></div>';
    } else {
        result += '<div class="recommendation result-success fade-in"><span class="rec-icon">🎉</span><div class="rec-content"><strong>Excellent!</strong> Your schema is in BCNF. No further normalization needed.</div></div>';
    }
    result += `<div class="result-details">Highest Normal Form Achieved: <span class="result-key">${highestNF}</span></div>`;
    result += '</div></div>';
    result += '</div>';
    return result;
}

function checkPartialDependency(fds) {
    // Get all attributes and find candidate keys
    const allAttributes = new Set();
    fds.forEach(fd => {
        fd.left.forEach(attr => allAttributes.add(attr));
        fd.right.forEach(attr => allAttributes.add(attr));
    });
    
    const candidateKeys = findPrimaryKeys(fds);
    
    // If no candidate keys found, assume no partial dependency
    if (candidateKeys.length === 0) {
        return false;
    }
    
    // Check each functional dependency for partial dependency
    for (let fd of fds) {
        const leftSet = new Set(fd.left);
        const rightSet = new Set(fd.right);
        
        // Check if this FD violates 2NF
        for (let candidateKey of candidateKeys) {
            const candidateKeySet = new Set(candidateKey);
            
            // Check if left side is a proper subset of candidate key
            const isProperSubset = leftSet.size < candidateKeySet.size && 
                                  leftSet.size > 0 &&
                                  Array.from(leftSet).every(attr => candidateKeySet.has(attr));
            
            if (isProperSubset) {
                // Check if right side contains non-key attributes
                const hasNonKeyAttributes = Array.from(rightSet).some(attr => !candidateKeySet.has(attr));
                
                if (hasNonKeyAttributes) {
                    return true; // Partial dependency found
                }
            }
        }
    }
    
    return false; // No partial dependencies found
}

function checkTransitiveDependency(fds) {
    // Get all attributes
    const allAttributes = new Set();
    fds.forEach(fd => {
        fd.left.forEach(attr => allAttributes.add(attr));
        fd.right.forEach(attr => allAttributes.add(attr));
    });
    
    const candidateKeys = findPrimaryKeys(fds);
    
    // If no candidate keys found, assume no transitive dependency
    if (candidateKeys.length === 0) {
        return false;
    }
    
    // Create a map of functional dependencies for easier lookup
    const fdMap = new Map();
    fds.forEach(fd => {
        const leftKey = fd.left.sort().join(',');
        if (!fdMap.has(leftKey)) {
            fdMap.set(leftKey, []);
        }
        fdMap.get(leftKey).push(...fd.right);
    });
    
    // Check for transitive dependencies
    // A transitive dependency exists if A → B and B → C, then A → C
    for (let fd1 of fds) {
        const left1 = fd1.left;
        const right1 = fd1.right;
        
        for (let attr1 of right1) {
            // Check if attr1 determines other attributes
            if (fdMap.has(attr1)) {
                const determinedByAttr1 = fdMap.get(attr1);
                
                for (let attr2 of determinedByAttr1) {
                    // Check if this creates a transitive dependency
                    // left1 → attr1 → attr2, so left1 → attr2 should be transitive
                    
                    // Skip if attr2 is already in left1 or right1
                    if (left1.includes(attr2) || right1.includes(attr2)) {
                        continue;
                    }
                    
                    // Check if this transitive dependency is not already explicitly stated
                    const left1Key = left1.sort().join(',');
                    const explicitDeps = fdMap.get(left1Key) || [];
                    
                    if (!explicitDeps.includes(attr2)) {
                        // This is a potential transitive dependency
                        // But we need to check if it's actually a violation
                        
                        // Check if attr1 is not a candidate key (if it is, it's not a violation)
                        const attr1IsCandidateKey = candidateKeys.some(key => 
                            key.length === 1 && key[0] === attr1
                        );
                        
                        if (!attr1IsCandidateKey) {
                            return true; // Transitive dependency found
                        }
                    }
                }
            }
        }
    }
    
    return false; // No transitive dependencies found
}

function checkBCNFViolation(fds) {
    // Get all attributes and find candidate keys
    const allAttributes = new Set();
    fds.forEach(fd => {
        fd.left.forEach(attr => allAttributes.add(attr));
        fd.right.forEach(attr => allAttributes.add(attr));
    });
    
    const candidateKeys = findPrimaryKeys(fds);
    
    // If no candidate keys found, assume no BCNF violation
    if (candidateKeys.length === 0) {
        return false;
    }
    
    // Check each functional dependency for BCNF violation
    for (let fd of fds) {
        const leftSet = new Set(fd.left);
        const rightSet = new Set(fd.right);
        
        // Check if left side is a superkey (contains a candidate key)
        const isSuperkey = candidateKeys.some(candidateKey => {
            return candidateKey.every(attr => leftSet.has(attr));
        });
        
        // If left side is not a superkey, it's a BCNF violation
        if (!isSuperkey) {
            return true;
        }
    }
    
    return false; // No BCNF violations found
}

function findPrimaryKeys(fds) {
    // Get all attributes from functional dependencies
    const allAttributes = new Set();
    fds.forEach(fd => {
        fd.left.forEach(attr => allAttributes.add(attr));
        fd.right.forEach(attr => allAttributes.add(attr));
    });
    
    const attributes = Array.from(allAttributes);
    const candidateKeys = [];
    
    // Find all possible combinations of attributes that could be candidate keys
    // A candidate key is a minimal set of attributes that can functionally determine all other attributes
    
    // Check single attributes first
    for (let attr of attributes) {
        if (canDetermineAll([attr], fds, allAttributes)) {
            candidateKeys.push([attr]);
        }
    }
    
    // Check combinations of 2 attributes
    if (candidateKeys.length === 0) {
        for (let i = 0; i < attributes.length; i++) {
            for (let j = i + 1; j < attributes.length; j++) {
                const combination = [attributes[i], attributes[j]];
                if (canDetermineAll(combination, fds, allAttributes)) {
                    candidateKeys.push(combination);
                }
            }
        }
    }
    
    // Check combinations of 3 attributes (if needed)
    if (candidateKeys.length === 0 && attributes.length >= 3) {
        for (let i = 0; i < attributes.length; i++) {
            for (let j = i + 1; j < attributes.length; j++) {
                for (let k = j + 1; k < attributes.length; k++) {
                    const combination = [attributes[i], attributes[j], attributes[k]];
                    if (canDetermineAll(combination, fds, allAttributes)) {
                        candidateKeys.push(combination);
                    }
                }
            }
        }
    }
    
    // Remove redundant candidate keys (if a subset is also a candidate key)
    const minimalKeys = candidateKeys.filter(key => {
        return !candidateKeys.some(otherKey => {
            if (otherKey.length >= key.length) return false;
            return otherKey.every(attr => key.includes(attr));
        });
    });
    
    return minimalKeys;
}

function canDetermineAll(keyAttributes, fds, allAttributes) {
    // Check if the given key attributes can functionally determine all other attributes
    const determined = new Set(keyAttributes);
    let changed = true;
    
    // Convert allAttributes to array if it's a Set
    const allAttributesArray = Array.from(allAttributes);
    
    while (changed) {
        changed = false;
        for (let fd of fds) {
            // Check if all left side attributes are determined
            const leftDetermined = fd.left.every(attr => determined.has(attr));
            if (leftDetermined) {
                // Add right side attributes to determined set
                for (let attr of fd.right) {
                    if (!determined.has(attr)) {
                        determined.add(attr);
                        changed = true;
                    }
                }
            }
        }
    }
    
    // Check if all attributes are determined
    return allAttributesArray.every(attr => determined.has(attr));
}

function decomposeToNormalForm() {
    const fdItems = document.querySelectorAll('.fd-item');
    const decompositionResult = document.getElementById('decomposition-result');
    const fds = [];
    let allAttrs = new Set();
    for (let item of fdItems) {
        const left = item.querySelector('.fd-left').value.trim();
        const right = item.querySelector('.fd-right').value.trim();
        if (left && right) {
            const leftArr = left.split(',').map(s => s.trim());
            const rightArr = right.split(',').map(s => s.trim());
            fds.push({ left: leftArr, right: rightArr });
            leftArr.forEach(a => allAttrs.add(a));
            rightArr.forEach(a => allAttrs.add(a));
        }
    }
    if (fds.length === 0) {
        decompositionResult.innerHTML = '<div class="result-placeholder"><p>Please add at least one functional dependency.</p></div>';
        return;
    }
    // Determine which normal form is violated
    const partial = checkPartialDependency(fds);
    const transitive = checkTransitiveDependency(fds);
    const bcnf = checkBCNFViolation(fds);
    let nextNF = null;
    if (partial) nextNF = '2NF';
    else if (transitive) nextNF = '3NF';
    else if (bcnf) nextNF = 'BCNF';
    else nextNF = 'BCNF'; // Already in BCNF

    // Decomposition logic (simplified, educational)
    let html = '<div class="analysis-section">';
    html += `<h5>Decomposition to ${nextNF}</h5>`;
    if (nextNF === '2NF') {
        html += '<p><strong>Step 1:</strong> Remove partial dependencies by creating new relations for each partial FD.</p>';
        // Find FDs with composite left side
        let i = 1;
        fds.forEach(fd => {
            if (fd.left.length > 1) {
                html += `<div class="fd-display"><span class="fd-number">R${i++}</span> <span class="fd-left">[${fd.left.join(', ')}]</span> <span class="fd-arrow">→</span> <span class="fd-right">[${fd.right.join(', ')}]</span></div>`;
            }
        });
        html += '<p><strong>Step 2:</strong> The remaining attributes form another relation.</p>';
        html += `<div class="fd-display"><span class="fd-number">R${i}</span> <span class="fd-left">[All attributes minus those in partial FDs]</span></div>`;
    } else if (nextNF === '3NF') {
        html += '<p><strong>Step 1:</strong> Remove transitive dependencies by creating new relations for each transitive FD.</p>';
        let i = 1;
        fds.forEach(fd => {
            if (fd.left.length === 1 && fd.right.length === 1) {
                html += `<div class="fd-display"><span class="fd-number">R${i++}</span> <span class="fd-left">[${fd.left.join(', ')}]</span> <span class="fd-arrow">→</span> <span class="fd-right">[${fd.right.join(', ')}]</span></div>`;
            }
        });
        html += '<p><strong>Step 2:</strong> The remaining attributes form another relation.</p>';
        html += `<div class="fd-display"><span class="fd-number">R${i}</span> <span class="fd-left">[All attributes minus those in transitive FDs]</span></div>`;
    } else if (nextNF === 'BCNF') {
        if (!bcnf) {
            html += '<p>Your schema is already in BCNF. No further decomposition needed.</p>';
        } else {
            html += '<p><strong>Step 1:</strong> For each FD that violates BCNF (determinant is not a superkey), create a new relation for that FD.</p>';
            let i = 1;
            fds.forEach(fd => {
                if (fd.left.length < allAttrs.size) {
                    html += `<div class="fd-display"><span class="fd-number">R${i++}</span> <span class="fd-left">[${fd.left.join(', ')}]</span> <span class="fd-arrow">→</span> <span class="fd-right">[${fd.right.join(', ')}]</span></div>`;
                }
            });
            html += '<p><strong>Step 2:</strong> The remaining attributes form another relation.</p>';
            html += `<div class="fd-display"><span class="fd-number">R${i}</span> <span class="fd-left">[All attributes minus those in BCNF-violating FDs]</span></div>`;
        }
    }
    html += '</div>';
    decompositionResult.innerHTML = html;
}

// NFA to DFA Functions
function addTransition() {
    const transitionTable = document.getElementById('transition-table');
    const newTransition = document.createElement('div');
    newTransition.className = 'transition-item';
    newTransition.innerHTML = `
        <input type="text" class="transition-from" placeholder="q0" value="">
        <input type="text" class="transition-symbol" placeholder="0" value="">
        <span class="transition-arrow">→</span>
        <input type="text" class="transition-to" placeholder="q1" value="">
        <button class="btn btn-secondary" onclick="removeTransition(this)" title="Remove Transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
            </svg>
        </button>
    `;
    transitionTable.appendChild(newTransition);
}

function removeTransition(button) {
    button.parentElement.remove();
}

function epsilonClosure(stateSet, transitions) {
    // stateSet: array of NFA states
    // transitions: array of {from, symbol, to}
    const closure = new Set(stateSet);
    const stack = [...stateSet];
    while (stack.length > 0) {
        const state = stack.pop();
        transitions.forEach(t => {
            if (t.from === state && (t.symbol === 'ε' || t.symbol === 'e' || t.symbol === 'epsilon')) {
                if (!closure.has(t.to)) {
                    closure.add(t.to);
                    stack.push(t.to);
                }
            }
        });
    }
    return Array.from(closure);
}

function convertNFAToDFA(states, alphabet, startState, finalStates, transitions) {
    const nfaStates = Array.isArray(states) ? states : states.split(',').map(s => s.trim());
    const nfaAlphabet = Array.isArray(alphabet) ? alphabet : alphabet.split(',').map(s => s.trim());
    const nfaFinalStates = Array.isArray(finalStates) ? finalStates : finalStates.split(',').map(s => s.trim());

    // Remove epsilon from alphabet if present
    const symbols = nfaAlphabet.filter(s => s !== 'ε' && s !== 'e' && s !== 'epsilon');

    // Start with the epsilon closure of the start state
    const startClosure = epsilonClosure([startState], transitions);
    const dfaStates = [startClosure.sort().join(',')];
    const dfaTransitions = [];
    const dfaFinalStates = [];
    const processedStates = new Set();
    const stateQueue = [startClosure];

    while (stateQueue.length > 0) {
        const currentSet = stateQueue.shift();
        const currentName = currentSet.sort().join(',');
        if (processedStates.has(currentName)) continue;
        processedStates.add(currentName);

        // If any NFA final state is in the set, this DFA state is final
        if (currentSet.some(s => nfaFinalStates.includes(s)) && !dfaFinalStates.includes(currentName)) {
            dfaFinalStates.push(currentName);
        }

        for (const symbol of symbols) {
            let nextSet = [];
            for (const nfaState of currentSet) {
                // All transitions for this symbol
                transitions.forEach(t => {
                    if (t.from === nfaState && t.symbol === symbol) {
                        nextSet.push(t.to);
                    }
                });
            }
            // Epsilon closure of the result
            nextSet = epsilonClosure(nextSet, transitions);
            const nextName = nextSet.sort().join(',');
            if (nextName && nextSet.length > 0) {
                dfaTransitions.push({ from: currentName, symbol, to: nextName });
                if (!dfaStates.includes(nextName)) {
                    dfaStates.push(nextName);
                    stateQueue.push(nextSet);
                }
            }
        }
    }

    return {
        states: dfaStates,
        alphabet: symbols,
        startState: startClosure.sort().join(','),
        finalStates: dfaFinalStates,
        transitions: dfaTransitions
    };
}

function displayDFAResult(dfa) {
    const result = document.getElementById('dfa-result');
    
    // Create a simplified result display showing only transition table with final states
    let html = `
        <div class="dfa-result-content">
            <div class="dfa-section">
                <h4>📊 DFA Transition Table</h4>
                <div class="transition-matrix">
                    <table>
                        <thead>
                            <tr>
                                <th>State</th>
                                ${dfa.alphabet.map(symbol => `<th>${symbol}</th>`).join('')}
                                <th>Final State</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${dfa.states.map(state => `
                                <tr>
                                    <td><strong>${state}</strong></td>
                                    ${dfa.alphabet.map(symbol => {
                                        const transition = dfa.transitions.find(t => t.from === state && t.symbol === symbol);
                                        return `<td>${transition ? transition.to : '-'}</td>`;
                                    }).join('')}
                                    <td>${dfa.finalStates.includes(state) ? '✅ Yes' : '❌ No'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    result.innerHTML = html;
}

// Expression Tree Generator Functions
function initExpressionTree() {
    const generateBtn = document.getElementById('generate-tree-btn');
    const clearBtn = document.getElementById('clear-tree-btn');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const resetViewBtn = document.getElementById('reset-view-btn');
    const exampleItems = document.querySelectorAll('#expression-tree .example-item');
    
    console.log('Initializing Expression Tree...');
    console.log('Found generate button:', generateBtn);
    console.log('Found example items:', exampleItems.length);
    
    if (generateBtn) {
        generateBtn.addEventListener('click', generateTree);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearTree);
    }
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => zoomTree(1.2));
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => zoomTree(0.8));
    }
    
    if (resetViewBtn) {
        resetViewBtn.addEventListener('click', resetTreeView);
    }
    
    // Add click handlers for example items
    exampleItems.forEach((item, index) => {
        console.log(`Adding event listener to tree example item ${index + 1}:`, item);
        item.addEventListener('click', () => {
            console.log('Tree example item clicked:', item);
            const expression = item.getAttribute('data-expression');
            console.log('Tree example expression:', expression);
            
            const expressionInput = document.getElementById('tree-expression');
            if (expressionInput) {
                expressionInput.value = expression;
                generateTree();
                
                // Add visual feedback
                item.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    item.style.transform = '';
                }, 150);
            }
        });
    });
}

// Expression Tree Node class
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// Build expression tree from infix expression
function buildExpressionTree(expression) {
    // Remove spaces
    expression = expression.replace(/\s+/g, '');
    if (!expression) return null;

    // Helper functions
    function isOperator(c) {
        return ['+', '-', '*', '/', '^'].includes(c);
    }
    function precedence(op) {
        switch (op) {
            case '+':
            case '-': return 1;
            case '*':
            case '/': return 2;
            case '^': return 3;
            default: return 0;
        }
    }

    // Shunting Yard to postfix
    let output = [];
    let ops = [];
    let i = 0;
    while (i < expression.length) {
        let c = expression[i];
        if (/[A-Za-z0-9]/.test(c)) {
            let operand = c;
            while (i + 1 < expression.length && /[A-Za-z0-9]/.test(expression[i + 1])) {
                operand += expression[++i];
            }
            output.push(operand);
        } else if (c === '(') {
            ops.push(c);
        } else if (c === ')') {
            while (ops.length && ops[ops.length - 1] !== '(') {
                output.push(ops.pop());
            }
            ops.pop(); // Remove '('
        } else if (isOperator(c)) {
            while (
                ops.length &&
                isOperator(ops[ops.length - 1]) &&
                ((precedence(c) < precedence(ops[ops.length - 1])) ||
                 (precedence(c) === precedence(ops[ops.length - 1]) && c !== '^'))
            ) {
                output.push(ops.pop());
            }
            ops.push(c);
        }
        i++;
    }
    while (ops.length) {
        output.push(ops.pop());
    }

    // Build tree from postfix
    let stack = [];
    for (let token of output) {
        if (isOperator(token)) {
            let node = new TreeNode(token);
            node.right = stack.pop();
            node.left = stack.pop();
            stack.push(node);
        } else {
            stack.push(new TreeNode(token));
        }
    }
    return stack.length ? stack[0] : null;
}

function generateTree() {
    const expression = document.getElementById('tree-expression').value.trim();
    const canvas = document.getElementById('tree-canvas');
    const canvasPlaceholder = document.getElementById('canvas-placeholder');
    const treeInfo = document.getElementById('tree-info');
    
    if (!expression) {
        showTreeError('Please enter an expression.');
        return;
    }
    
    try {
        // Build the expression tree
        const tree = buildExpressionTree(expression);
        
        if (!tree) {
            showTreeError('Invalid expression. Please check your syntax.');
            return;
        }
        
        // Store current tree for zoom functionality
        window.currentTree = tree;
        window.treeZoom = 0.7;
        
        // Hide placeholder and show canvas
        if (canvasPlaceholder) {
            canvasPlaceholder.style.display = 'none';
        }
        
        // Dynamically resize canvas based on tree size
        resizeCanvasForTree(canvas, tree);
        
        // Draw the tree
        drawTree(canvas, tree);
        
        // Display tree information
        displayTreeInfo(treeInfo, tree, expression);
        
        showTreeSuccess('Expression tree generated successfully!');
        
    } catch (error) {
        showTreeError('Error generating tree: ' + error.message);
    }
}

function resizeCanvasForTree(canvas, tree) {
    // Make nodes and spacing even larger for maximum clarity
    const nodeRadius = 72;
    // Dynamically adjust horizontal spacing based on tree width
    const treeLeafCount = getTreeWidth(tree);
    let hSpacing = 120;
    if (treeLeafCount > 8) hSpacing = 160;
    if (treeLeafCount > 16) hSpacing = 200;
    if (treeLeafCount > 24) hSpacing = 240;
    const vSpacing = 180;
    // Make the canvas width extremely generous for scrolling
    const baseTreeWidth = treeLeafCount * (nodeRadius * 2 + hSpacing);
    const extraPadding = Math.max(2000, nodeRadius * 20, treeLeafCount * 100);
    const treeWidth = baseTreeWidth * 2.5 + extraPadding;
    const treeHeight = getTreeHeight(tree) * (nodeRadius * 2 + vSpacing);
    // Set minimums
    const minWidth = 600;
    const minHeight = 400;
    canvas.width = Math.max(treeWidth, minWidth);
    canvas.height = Math.max(treeHeight, minHeight);

    // Remove auto-zoom: always render at full size
    window.treeZoom = 1;
}

function getTreeWidth(node) {
    if (!node) return 0;
    if (!node.left && !node.right) return 1;
    return getTreeWidth(node.left) + getTreeWidth(node.right);
}

// Draw the tree on canvas with proper centering
function drawTree(canvas, root) {
    if (!root) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Layout the tree to assign x/y positions
    const nodeRadius = 72;
    // Use the same hSpacing logic as resizeCanvasForTree
    const treeLeafCount = getTreeWidth(root);
    let hSpacing = 120;
    if (treeLeafCount > 8) hSpacing = 160;
    if (treeLeafCount > 16) hSpacing = 200;
    if (treeLeafCount > 24) hSpacing = 240;
    const vSpacing = 180;
    const positions = { x: nodeRadius + 10 };
    layoutTree(root, positions, nodeRadius, hSpacing, vSpacing, 1, 0);

    // Remove centering: start at left edge
    const offsetX = 0;
    // Apply zoom
    ctx.save();
    ctx.scale(window.treeZoom || 1, window.treeZoom || 1);
    drawTreeNode(ctx, root, offsetX, nodeRadius + 10, nodeRadius, hSpacing, vSpacing);
    ctx.restore();
}

function layoutTree(node, positions, nodeRadius, hSpacing, vSpacing, depth, xOffset) {
    if (!node) return 0;
    // Left subtree
    const leftWidth = layoutTree(node.left, positions, nodeRadius, hSpacing, vSpacing, depth + 1, xOffset);
    // Node position
    node.x = positions.x + leftWidth * (nodeRadius * 2 + hSpacing);
    node.y = (depth - 1) * (nodeRadius * 2 + vSpacing) + nodeRadius + 10;
    // Move x for right subtree
    positions.x = node.x + nodeRadius + hSpacing / 2;
    // Right subtree
    const rightWidth = layoutTree(node.right, positions, nodeRadius, hSpacing, vSpacing, depth + 1, xOffset + leftWidth + 1);
    // Return total width of this subtree
    return leftWidth + 1 + rightWidth;
}

function drawTreeNode(ctx, node, offsetX, offsetY, nodeRadius, hSpacing, vSpacing) {
    if (!node) return;
    // Draw left child and connecting line
    if (node.left) {
        ctx.beginPath();
        ctx.moveTo(node.x + offsetX, node.y + offsetY);
        ctx.lineTo(node.left.x + offsetX, node.left.y + offsetY);
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 3;
        ctx.stroke();
        drawTreeNode(ctx, node.left, offsetX, offsetY, nodeRadius, hSpacing, vSpacing);
    }
    // Draw right child and connecting line
    if (node.right) {
        ctx.beginPath();
        ctx.moveTo(node.x + offsetX, node.y + offsetY);
        ctx.lineTo(node.right.x + offsetX, node.right.y + offsetY);
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 3;
        ctx.stroke();
        drawTreeNode(ctx, node.right, offsetX, offsetY, nodeRadius, hSpacing, vSpacing);
    }
    // Draw node circle
    ctx.beginPath();
    ctx.arc(node.x + offsetX, node.y + offsetY, nodeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#8b5cf6';
    ctx.fill();
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Draw node value
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.value, node.x + offsetX, node.y + offsetY);
}

// Display tree information
function displayTreeInfo(container, tree, expression) {
    const height = getTreeHeight(tree);
    const nodeCount = getNodeCount(tree);
    const leafCount = getLeafCount(tree);
    const internalCount = nodeCount - leafCount;
    
    container.innerHTML = `
        <div class="tree-info-item">
            <strong>Original Expression:</strong> ${expression}
        </div>
        <div class="tree-info-item">
            <strong>Tree Height:</strong> ${height} levels
        </div>
        <div class="tree-info-item">
            <strong>Total Nodes:</strong> ${nodeCount}
        </div>
        <div class="tree-info-item">
            <strong>Internal Nodes:</strong> ${internalCount} (operators)
        </div>
        <div class="tree-info-item">
            <strong>Leaf Nodes:</strong> ${leafCount} (operands)
        </div>
        <div class="tree-info-item">
            <strong>Postfix Expression:</strong> ${treeToPostfix(tree)}
        </div>
        <div class="tree-info-item">
            <strong>Prefix Expression:</strong> ${treeToPrefix(tree)}
        </div>
    `;
}

// Tree utility functions
function getTreeHeight(node) {
    if (!node) return 0;
    return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
}

function getNodeCount(node) {
    if (!node) return 0;
    return 1 + getNodeCount(node.left) + getNodeCount(node.right);
}

function getLeafCount(node) {
    if (!node) return 0;
    if (!node.left && !node.right) return 1;
    return getLeafCount(node.left) + getLeafCount(node.right);
}

function treeToPostfix(node) {
    if (!node) return '';
    return treeToPostfix(node.left) + ' ' + treeToPostfix(node.right) + ' ' + node.value;
}

function treeToPrefix(node) {
    if (!node) return '';
    return node.value + ' ' + treeToPrefix(node.left) + ' ' + treeToPrefix(node.right);
}

// Initialize Normalization Checker
function initNormalizationChecker() {
    // Add event listeners for normalization functionality
    const addFDBtn = document.querySelector('.add-fd-btn');
    if (addFDBtn) {
        addFDBtn.addEventListener('click', addFD);
    }
    // Add event listeners for remove buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.remove-fd-btn')) {
            removeFD(e.target.closest('.remove-fd-btn'));
        }
    });
    // Add event listener for check normalization button
    const checkBtn = document.querySelector('.check-btn');
    if (checkBtn) {
        checkBtn.addEventListener('click', checkNormalization);
    }
}

// Initialize NFA to DFA Converter
function initNFAtoDFA() {
    // Add example transitions for testing
    const transitionTable = document.getElementById('transition-table');
    if (transitionTable && transitionTable.children.length === 0) {
        // Add example transitions for a simple NFA that accepts strings ending with '1'
        const exampleTransitions = [
            { from: 'q0', symbol: '0', to: 'q0' },
            { from: 'q0', symbol: '1', to: 'q0' },
            { from: 'q0', symbol: '1', to: 'q1' },
            { from: 'q1', symbol: '0', to: 'q2' },
            { from: 'q1', symbol: '1', to: 'q2' }
        ];
        
        exampleTransitions.forEach(transition => {
            const newTransition = document.createElement('div');
            newTransition.className = 'transition-item';
            newTransition.innerHTML = `
                <input type="text" class="transition-from" placeholder="q0" value="${transition.from}">
                <input type="text" class="transition-symbol" placeholder="0" value="${transition.symbol}">
                <span class="transition-arrow">→</span>
                <input type="text" class="transition-to" placeholder="q1" value="${transition.to}">
                <button class="btn btn-secondary" onclick="removeTransition(this)" title="Remove Transition">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                    </svg>
                </button>
            `;
            transitionTable.appendChild(newTransition);
        });
    }
    
    // Add event listeners for NFA to DFA functionality
    const addTransitionBtn = document.querySelector('.automata-container .btn');
    if (addTransitionBtn) {
        addTransitionBtn.addEventListener('click', convertNFAtoDFA);
    }
    
    // Add event listeners for remove transition buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.remove-transition-btn')) {
            removeTransition(e.target.closest('.remove-transition-btn'));
        }
    });
}

// K-map Solver Logic and Initialization
function initKMapSolver() {
    const variablesSelect = document.getElementById('kmap-variables');
    const mintermsInput = document.getElementById('kmap-minterms');
    const dontCaresInput = document.getElementById('kmap-dontcares');
    const solveBtn = document.getElementById('kmap-solve-btn');
    const gridDiv = document.getElementById('kmap-grid');
    const exprDiv = document.getElementById('kmap-expression');

    if (!variablesSelect || !mintermsInput || !solveBtn || !gridDiv || !exprDiv) return;

    function renderKMap() {
        try {
            const numVars = parseInt(variablesSelect.value);
            const minterms = parseInput(mintermsInput.value);
            const dontCares = parseInput(dontCaresInput.value);
            if (!Array.isArray(minterms) || !Array.isArray(dontCares)) {
                showError('Invalid input. Please enter comma-separated numbers.');
                gridDiv.innerHTML = '';
                exprDiv.innerHTML = '';
                return;
            }
            // Validate minterms and don't-cares
            const maxVal = Math.pow(2, numVars) - 1;
            if (minterms.some(m => m < 0 || m > maxVal) || dontCares.some(d => d < 0 || d > maxVal)) {
                showError('Minterms and don\'t-cares must be between 0 and ' + maxVal + '.');
                gridDiv.innerHTML = '';
                exprDiv.innerHTML = '';
                return;
            }
            if (minterms.some(m => dontCares.includes(m))) {
                showError('A value cannot be both a minterm and a don\'t-care.');
                gridDiv.innerHTML = '';
                exprDiv.innerHTML = '';
                return;
            }
            // Generate K-map grid and simplify
            const kmap = generateKMap(numVars, minterms, dontCares);
            gridDiv.innerHTML = kmap.html;
            exprDiv.innerHTML = `<span class="result-text">${kmap.expression || 'No result'}</span>`;
            if (!kmap.expression || kmap.expression === 'Only 2-4 variables supported.') {
                showError('Could not generate a valid result.');
            } else {
                showSuccess('K-map solved!');
            }
        } catch (err) {
            gridDiv.innerHTML = '';
            exprDiv.innerHTML = '';
            showError('An error occurred: ' + (err.message || err));
        }
    }

    function parseInput(str) {
        if (!str || !str.trim()) return [];
        try {
            return str.split(',').map(s => {
                const n = parseInt(s.trim());
                return isNaN(n) ? null : n;
            }).filter(s => s !== null);
        } catch {
            return [];
        }
    }

    solveBtn.addEventListener('click', renderKMap);
}

// Generate K-map grid and simplify expression
function generateKMap(numVars, minterms, dontCares) {
    const size = 1 << numVars;
    const map = Array(size).fill(0);
    minterms.forEach(i => map[i] = 1);
    dontCares.forEach(i => map[i] = 'X');
    // Simplify using Quine-McCluskey (for up to 4 vars)
    const simp = simplifyKMap(numVars, minterms, dontCares);
    // Generate grid HTML with group highlighting
    const html = kmapGridHTML(numVars, map, simp.groups);
    return { html, expression: simp.expression, groups: simp.groups };
}

// Generate K-map grid HTML
function kmapGridHTML(numVars, map, groups=[]) {
    const gray = n => n ^ (n >> 1);
    let rows = 1 << Math.floor(numVars / 2);
    let cols = 1 << Math.ceil(numVars / 2);
    const varNames = ['A', 'B', 'C', 'D'];
    let rowVars = varNames.slice(0, Math.floor(numVars / 2));
    let colVars = varNames.slice(Math.floor(numVars / 2), numVars);
    // Assign a color to each group
    const groupColors = [
        '#fbbf24', // amber
        '#34d399', // green
        '#60a5fa', // blue
        '#f472b6', // pink
        '#a78bfa', // purple
        '#f87171', // red
        '#38bdf8', // sky
        '#facc15', // yellow
    ];
    // Build a map: cell index -> array of group indices
    let cellGroups = {};
    groups.forEach((g, i) => {
        g.minterms.forEach(idx => {
            if (!cellGroups[idx]) cellGroups[idx] = [];
            cellGroups[idx].push(i);
        });
    });
    // Header
    let html = '<table class="kmap-table">';
    html += '<tr><th></th>';
    for (let c = 0; c < cols; ++c) {
        let bin = toBinary(gray(c), colVars.length);
        let label = '';
        for (let i = 0; i < colVars.length; ++i) {
            label += colVars[i] + (bin[i] === '0' ? "'" : '');
            if (colVars.length > 1 && i < colVars.length - 1) label += '';
        }
        html += `<th>${label}</th>`;
    }
    html += '</tr>';
    for (let r = 0; r < rows; ++r) {
        let bin = toBinary(gray(r), rowVars.length);
        let label = '';
        for (let i = 0; i < rowVars.length; ++i) {
            label += rowVars[i] + (bin[i] === '0' ? "'" : '');
            if (rowVars.length > 1 && i < rowVars.length - 1) label += '';
        }
        html += `<tr><th>${label}</th>`;
        for (let c = 0; c < cols; ++c) {
            let idx = (numVars === 2) ? (gray(r) << 1 | gray(c))
                : (numVars === 3) ? (gray(r) << 2 | gray(c))
                : (gray(r) << 2 | gray(c));
            let val = map[idx];
            let groupIdxs = cellGroups[idx] || [];
            let cellStyle = '';
            if (groupIdxs.length > 0) {
                // If multiple groups, use a gradient
                if (groupIdxs.length === 1) {
                    cellStyle = `background: ${groupColors[groupIdxs[0] % groupColors.length]}33; border: 2.5px solid ${groupColors[groupIdxs[0] % groupColors.length]};`;
                } else {
                    let stops = groupIdxs.map((g, i) => `${groupColors[g % groupColors.length]}66 ${(i/groupIdxs.length)*100}% ${(i+1)/groupIdxs.length*100}%`).join(', ');
                    cellStyle = `background: linear-gradient(135deg, ${stops}); border: 2.5px solid #fff;`;
                }
            }
            html += `<td class="kmap-cell" style="${cellStyle}">${val === undefined ? '' : val}</td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    // Add legend
    if (groups.length > 0) {
        html += '<div class="kmap-legend" style="margin-top:1.2rem;display:flex;flex-wrap:wrap;gap:1.2rem;align-items:center;">';
        groups.forEach((g, i) => {
            html += `<span class="kmap-legend-item" style="display:flex;align-items:center;gap:0.5em;"><span style="display:inline-block;width:1.5em;height:1.5em;background:${groupColors[i % groupColors.length]};border-radius:0.4em;border:2px solid #fff;"></span> <span style="font-family:'Fira Mono',Consolas,monospace;font-size:1.1em;">${g.expr}</span></span>`;
        });
        html += '</div>';
    }
    return html;
}
function toBinary(n, width) {
    return n.toString(2).padStart(width, '0');
}

// Quine-McCluskey simplification for up to 4 variables (robust, with group info)
function simplifyKMap(numVars, minterms, dontCares) {
    if (numVars < 2 || numVars > 4) return { expression: 'Only 2-4 variables supported.', groups: [] };
    const size = 1 << numVars;
    const allTerms = Array(size).fill(0).map((_, i) => i);
    const ones = minterms;
    const dc = dontCares;
    const terms = ones.concat(dc);
    // Step 1: Group terms by number of 1s
    let groups = {};
    terms.forEach(t => {
        let onesCount = t.toString(2).split('').filter(x => x === '1').length;
        if (!groups[onesCount]) groups[onesCount] = [];
        groups[onesCount].push({ minterms: [t], mask: 0 });
    });
    // Step 2: Find all prime implicants
    let primeImplicants = [];
    let marked = new Set();
    let changed = true;
    while (changed) {
        changed = false;
        let newGroups = {};
        let used = new Set();
        let groupKeys = Object.keys(groups).map(Number).sort((a,b)=>a-b);
        for (let i = 0; i < groupKeys.length - 1; ++i) {
            let g1 = groups[groupKeys[i]];
            let g2 = groups[groupKeys[i+1]];
            for (let t1 of g1) {
                for (let t2 of g2) {
                    let diff = t1.minterms[0] ^ t2.minterms[0];
                    if (countBits(diff) === 1 && t1.mask === t2.mask) {
                        let merged = Array.from(new Set([...t1.minterms, ...t2.minterms])).sort((a,b)=>a-b);
                        let newMask = t1.mask | diff;
                        let key = merged.join(',') + '|' + newMask;
                        if (!newGroups[groupKeys[i]]) newGroups[groupKeys[i]] = [];
                        // Avoid duplicates
                        if (!newGroups[groupKeys[i]].some(e => e.minterms.join(',') === merged.join(',') && e.mask === newMask)) {
                            newGroups[groupKeys[i]].push({ minterms: merged, mask: newMask });
                        }
                        used.add(t1);
                        used.add(t2);
                        changed = true;
                    }
                }
            }
        }
        // Add unused terms to prime implicants
        for (let g in groups) {
            for (let t of groups[g]) {
                if (!used.has(t) && !marked.has(t)) {
                    primeImplicants.push(t);
                    marked.add(t);
                }
            }
        }
        groups = newGroups;
    }
    // Step 3: Prime implicant chart
    let chart = {};
    for (let m of ones) {
        chart[m] = [];
        for (let pi of primeImplicants) {
            if (pi.minterms.includes(m)) chart[m].push(pi);
        }
    }
    // Step 4: Find essential prime implicants
    let essentials = [];
    let covered = new Set();
    for (let m in chart) {
        if (chart[m].length === 1) {
            let epi = chart[m][0];
            if (!essentials.includes(epi)) essentials.push(epi);
            epi.minterms.forEach(x => covered.add(x));
        }
    }
    // Step 5: Cover remaining minterms (greedy)
    let remaining = ones.filter(m => !covered.has(m));
    let selected = [...essentials];
    while (remaining.length > 0) {
        // Pick the PI that covers the most uncovered minterms
        let bestPI = null, bestCover = [];
        for (let pi of primeImplicants) {
            if (selected.includes(pi)) continue;
            let cover = pi.minterms.filter(m => remaining.includes(m));
            if (cover.length > bestCover.length) {
                bestPI = pi;
                bestCover = cover;
            }
        }
        if (!bestPI) break; // Should not happen
        selected.push(bestPI);
        bestPI.minterms.forEach(m => {
            if (!covered.has(m)) covered.add(m);
        });
        remaining = ones.filter(m => !covered.has(m));
    }
    // Step 6: Build expression and group info
    let groupsOut = selected.map(term => ({
        minterms: term.minterms,
        mask: term.mask,
        expr: termToExprQM(term, numVars)
    }));
    let termsExpr = groupsOut.map(g => g.expr).filter(Boolean);
    let expression = (!termsExpr.length) ? '1' : termsExpr.join(' + ');
    return { expression, groups: groupsOut };
}
// Helper for Quine-McCluskey term to expression
function termToExprQM(term, numVars) {
    let bits = term.minterms[0].toString(2).padStart(numVars, '0').split('');
    let mask = term.mask;
    let expr = '';
    for (let i = 0; i < numVars; ++i) {
        if ((mask & (1 << (numVars - i - 1))) === 0) {
            expr += String.fromCharCode(65 + i) + (bits[i] === '0' ? "'" : '');
        }
    }
    return expr;
}

// Initialize all developer tools
function initDeveloperTools() {
    initExpressionConverter();
    initExpressionTree();
    initBSTConverter();
    initNormalizationChecker();
    initNFAtoDFA();
    initKMapSolver();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initDeveloperTools();
});

// Clear tree visualization
function clearTree() {
    const canvas = document.getElementById('tree-canvas');
    const canvasPlaceholder = document.getElementById('canvas-placeholder');
    const treeInfo = document.getElementById('tree-info');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    if (canvasPlaceholder) {
        canvasPlaceholder.style.display = 'flex';
    }
    
    if (treeInfo) {
        treeInfo.innerHTML = `
            <div class="info-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                </svg>
                <p>Tree information will appear here...</p>
            </div>
        `;
    }
    
    // Clear input
    const expressionInput = document.getElementById('tree-expression');
    if (expressionInput) {
        expressionInput.value = '';
    }
}

// Zoom tree visualization
function zoomTree(factor) {
    const canvas = document.getElementById('tree-canvas');
    if (canvas && window.currentTree) {
        // Store zoom factor
        if (!window.treeZoom) window.treeZoom = 1;
        window.treeZoom *= factor;
        window.treeZoom = Math.max(0.5, Math.min(3, window.treeZoom)); // Limit zoom range
        
        // Redraw tree with new zoom
        drawTree(canvas, window.currentTree);
    }
}

// Reset tree view
function resetTreeView() {
    window.treeZoom = 0.7;
    const canvas = document.getElementById('tree-canvas');
    if (window.currentTree && canvas) {
        drawTree(canvas, window.currentTree);
    }
}

// Display BST info in the info section
function displayBSTInfo(root) {
    const infoDiv = document.getElementById('bst-info');
    if (!infoDiv) return;
    if (!root) {
        infoDiv.innerHTML = '<div class="info-placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg><p>Tree information will appear here...</p></div>';
        return;
    }
    function getHeight(node) { return node ? 1 + Math.max(getHeight(node.left), getHeight(node.right)) : 0; }
    function getNodeCount(node) { return node ? 1 + getNodeCount(node.left) + getNodeCount(node.right) : 0; }
    function getLeafCount(node) { return node ? (!node.left && !node.right ? 1 : getLeafCount(node.left) + getLeafCount(node.right)) : 0; }
    const height = getHeight(root);
    const nodeCount = getNodeCount(root);
    const leafCount = getLeafCount(root);
    infoDiv.innerHTML = `<div class="tree-info-item"><strong>Height:</strong> ${height}</div>
        <div class="tree-info-item"><strong>Total Nodes:</strong> ${nodeCount}</div>
        <div class="tree-info-item"><strong>Leaf Nodes:</strong> ${leafCount}</div>`;
}

function convertNFAtoDFA() {
    const states = document.getElementById('nfa-states').value.trim().split(',').map(s => s.trim());
    const alphabet = document.getElementById('nfa-alphabet').value.trim().split(',').map(s => s.trim());
    const startState = document.getElementById('nfa-start').value.trim();
    const finalStates = document.getElementById('nfa-final').value.trim().split(',').map(s => s.trim());
    
    if (!states.length || !alphabet.length || !startState || !finalStates.length) {
        alert('Please fill in all NFA fields.');
        return;
    }
    
    const transitions = [];
    const transitionItems = document.querySelectorAll('.transition-item');
    
    for (let item of transitionItems) {
        const from = item.querySelector('.transition-from').value.trim();
        const symbol = item.querySelector('.transition-symbol').value.trim();
        const to = item.querySelector('.transition-to').value.trim();
        
        if (from && symbol && to) {
            transitions.push({ from, symbol, to });
        }
    }
    
    if (transitions.length === 0) {
        alert('Please add at least one transition.');
        return;
    }
    
    const dfa = convertNFAToDFA(states, alphabet, startState, finalStates, transitions);
    displayDFAResult(dfa);
}

// Helper: count number of 1 bits in an integer
function countBits(n) {
    let c = 0;
    while (n) {
        c += n & 1;
        n >>= 1;
    }
    return c;
}
