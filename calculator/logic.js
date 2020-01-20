let runningTotal = 0;
let buffer = "0";
let previousOperator;
let memoryText = '';
let modeTracker = 0;

const screen = document.querySelector(".screen");
const memory = document.querySelector(".memory");
const calc_buttons = document.querySelector('.calc-buttons');
const header = document.querySelector('.calc-name');

function buttonClick(value) {
    if (isNaN(value)) {
        //is not a number
        handleSymbol(value);
    } else {
        //is a number
        handleNumber(value);
    }
    console.log(value);
    rerender();
}

function handleNumber(numberString) {
    if (buffer === "0") {
        buffer = numberString;
    } else {
        buffer = buffer + numberString;
    }
}


function handleMath(symbol) {
    if (buffer === "0") {
        //do nothing
        return;
    }
    updateMemory(symbol);
    const intBuffer = parseInt(buffer);

    if (runningTotal === 0) {
        runningTotal = intBuffer;
    } else {
        flushOperators(intBuffer);
    }

    previousOperator = symbol;
    buffer = "0";
}

function flushOperators(intBuffer) {
    if (previousOperator === "+") {
        runningTotal += intBuffer;
    } else if (previousOperator === "−") {
        runningTotal -= intBuffer;
    } else if (previousOperator === "÷") {
        runningTotal /= intBuffer;
    } else {
        runningTotal *= intBuffer;
    }
}

function handleSymbol(symbol) {
    switch (symbol) {
        case "CLEAR":
            buffer = "0";
            runningTotal = 0;
            memory.innerText = 'Cleared!'
            break;

        case "←":
            if (buffer.length === 1) {
                buffer = "0";
            } else {
                buffer = buffer.substring(0, buffer.length - 1);
            }

        case "=":
            if (previousOperator === null) {
                return;
            }
            updateMemory('=');
            memoryText = '';
            flushOperators(parseInt(buffer));
            previousOperator = null;
            buffer = +runningTotal;
            runningTotal = 0;
            break;

        case "+":
        case "−":
        case "÷":
        case "×":
            handleMath(symbol);
            break;
    }
}

function rerender() {
    screen.innerText = buffer;
}


function updateMemory(operator) {
    memoryText += buffer + '' + operator;
    memory.innerText = memoryText;
}

function modes() {
    if (modeTracker === 0) {
        let element = document.body;
        element.classList.toggle('lightmode');
        screen.style.background = '#1c8dba';
        memory.style.background = '#c4d113';
        modeTracker = 1;
    } else if (modeTracker === 1) {
        let darkElement = document.body;
        darkElement.classList.toggle('darkmode');
        screen.style.backgroundColor = "#ff3333";
        memory.style.background = 'teal';
        modeTracker = 0;
    }
    console.log(modeTracker);
}

function init() {
    document
        .querySelector(".calculator")
        .addEventListener("click", function (event) {
            buttonClick(event.target.innerText);
        });
}

init();
