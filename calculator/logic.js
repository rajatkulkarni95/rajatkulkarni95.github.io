let runningTotal = 0;
let buffer = "0";
let previousOperator;

const screen = document.querySelector(".screen");

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
    } else if (previousOperator === "-") {
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

function init() {
    document
        .querySelector(".calculator")
        .addEventListener("click", function (event) {
            buttonClick(event.target.innerText);
        });
}

init();
