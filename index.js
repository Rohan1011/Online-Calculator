const display = document.getElementById('display');
const buttons = Array.from(document.getElementsByClassName('button'));
let expression = '';

function updateDisplay() {
    display.innerText = expression || '0';
}

document.getElementById('darkToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    document.querySelector('.container').classList.toggle('dark');
    document.querySelectorAll('.button').forEach(btn => btn.classList.toggle('dark'));
});

function evaluateExpression() {
    try {
        const sanitized = expression
            .replace(/√/g, 'Math.sqrt')
            .replace(/\^/g, '**')
            .replace(/%/g, '/100');

        const result = eval(sanitized);
        expression = result.toString();
        updateDisplay();

        const historyList = document.getElementById('historyList');
        if (historyList) {
            const li = document.createElement('li');
            li.innerText = `${sanitized} = ${result}`;
            historyList.prepend(li);
        }
    } catch (err) {
        display.innerText = 'Error';
        expression = '';
    }
}

function handleInput(value) {
    switch (value) {
        case 'C':
            expression = '';
            break;
        case 'CE':
        case '←':
        case 'Backspace':
            expression = expression.slice(0, -1);
            break;
        case '=':
        case 'Enter':
            evaluateExpression();
            return;
        default:
            const lastChar = expression[expression.length - 1];
            if (/[+\-*/^.%]/.test(lastChar) && /[+\-*/^.%]/.test(value)) return;

            expression += value;
    }
    updateDisplay();
}

// Mouse input
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.innerText;
        handleInput(value);
    });
});

// Keyboard input
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (/[\d+\-*/().^%]/.test(key)) {
        handleInput(key);
    } else if (key === 'Enter' || key === '=' || key === 'Backspace' || key === 'Delete') {
        handleInput(key === 'Delete' ? 'C' : key);
    }
});

// Matrix utilities
function parseMatrix(input) {
    return input.trim().split('\n').map(row =>
        row.trim().split(',').map(Number)
    );
}

function multiplyMatrices() {
    const a = parseMatrix(document.getElementById('matrixA').value);
    const b = parseMatrix(document.getElementById('matrixB').value);
    const result = [];

    if (a[0].length !== b.length) {
        document.getElementById('matrixResult').innerText = "❌ Incompatible matrices.";
        return;
    }

    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < b[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < a[0].length; k++) {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }

    document.getElementById('matrixResult').innerText =
        result.map(row => row.join('\t')).join('\n');
}
