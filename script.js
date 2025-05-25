document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const memoryIndicator = document.getElementById('memoryIndicator');
    const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
    const resultContent = document.getElementById('resultContent');
    const copyBtn = document.getElementById('copyResult');
    
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let resetInput = false;
    let memoryValue = 0;
    
    // Update display
    function updateDisplay() {
        display.textContent = currentInput;
    }
    
    // Update memory indicator
    function updateMemoryIndicator() {
        memoryIndicator.textContent = memoryValue !== 0 ? 'M' : '';
    }
    
    // Show result in modal
    function showResult(result) {
        resultContent.textContent = result;
        resultModal.show();
    }
    
    // Handle number input
    function inputNumber(number) {
        if (currentInput === '0' || resetInput) {
            currentInput = number;
            resetInput = false;
        } else {
            currentInput += number;
        }
        updateDisplay();
    }
    
    // Handle decimal point
    function inputDecimal() {
        if (resetInput) {
            currentInput = '0.';
            resetInput = false;
            updateDisplay();
            return;
        }
        
        if (!currentInput.includes('.')) {
            currentInput += '.';
            updateDisplay();
        }
    }
    
    // Handle operator
    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);
        
        if (operation && !resetInput) {
            calculate();
        }
        
        previousInput = currentInput;
        operation = nextOperator;
        resetInput = true;
    }
    
    // Perform calculation
    function calculate() {
        let result;
        const prevValue = parseFloat(previousInput);
        const currentValue = parseFloat(currentInput);
        
        if (isNaN(prevValue)) return;
        
        switch (operation) {
            case 'add':
                result = prevValue + currentValue;
                break;
            case 'subtract':
                result = prevValue - currentValue;
                break;
            case 'multiply':
                result = prevValue * currentValue;
                break;
            case 'divide':
                result = prevValue / currentValue;
                break;
            case 'percentage':
                result = prevValue * (currentValue / 100);
                break;
            default:
                return;
        }
        
        currentInput = result.toString();
        operation = null;
        updateDisplay();
        
        // Show result in modal
        // showResult(result);
    }
    
    // Clear display
    function clearDisplay() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        updateDisplay();
    }
    
    // Clear all (including memory)
    function clearAll() {
        clearDisplay();
        memoryValue = 0;
        updateMemoryIndicator();
    }
    
    // Toggle plus/minus
    function toggleSign() {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
    }
    
    // Memory functions
    function memoryClear() {
        memoryValue = 0;
        updateMemoryIndicator();
    }
    
    function memoryRecall() {
        currentInput = memoryValue.toString();
        updateDisplay();
    }
    
    function memoryAdd() {
        memoryValue += parseFloat(currentInput);
        updateMemoryIndicator();
    }
    
    function memorySubtract() {
        memoryValue -= parseFloat(currentInput);
        updateMemoryIndicator();
    }
    
    // Button click event listeners
    document.querySelectorAll('.number-btn').forEach(button => {
        button.addEventListener('click', () => {
            inputNumber(button.getAttribute('data-number'));
        });
    });
    
    document.querySelector('[data-action="decimal"]').addEventListener('click', inputDecimal);
    
    document.querySelectorAll('[data-action="add"], [data-action="subtract"], [data-action="multiply"], [data-action="divide"], [data-action="percentage"]').forEach(button => {
        button.addEventListener('click', () => {
            handleOperator(button.getAttribute('data-action'));
        });
    });
    
    document.querySelector('[data-action="equals"]').addEventListener('click', calculate);
    document.querySelector('[data-action="clear"]').addEventListener('click', clearDisplay);
    document.querySelector('[data-action="clear-all"]').addEventListener('click', clearAll);
    document.querySelector('[data-action="plus-minus"]').addEventListener('click', toggleSign);
    document.querySelector('[data-action="memory-clear"]').addEventListener('click', memoryClear);
    document.querySelector('[data-action="memory-recall"]').addEventListener('click', memoryRecall);
    document.querySelector('[data-action="memory-add"]').addEventListener('click', memoryAdd);
    document.querySelector('[data-action="memory-subtract"]').addEventListener('click', memorySubtract);
    
    // Copy result to clipboard
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultContent.textContent)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            });
    });
    
    // Initialize
    updateDisplay();
    updateMemoryIndicator();
});