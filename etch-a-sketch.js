// The canvas is a 2D array of squares
// This is the initial size, can be later changed
const DEFAULT_SQUARES_PER_EDGE = 16

// What color to make the squares when resetting
const BLANK_SQUARE_COLOR = 'white';

const DrawingModes = {
    Black: "black",
    White: "white"
};

// Initial value, can change via pulldown
let drawingMode = DrawingModes.Black;

/* Initialize the container */
function initContainer(squaresPerEdge, squareColor) {
    console.log(`Initializing container with ${squaresPerEdge} squares per edge to ${squareColor}`);

    const squareSizePixels = getSquareSizePixels(squaresPerEdge);

    const container = document.querySelector('#container');
    console.log("Clearing container");
    // The list of child nodes is live, so removing them all can be a little tricky
    // See https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes#remove_all_children_from_a_node
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    for (let x = 0; x < squaresPerEdge; x++) {
        // console.log(`Adding row ${x}`);
        addRow(container, squaresPerEdge, squareSizePixels, squareColor);
    }
    console.log("Container initialized")
    console.log(container)
}

/* Prompt for size, and initialize the container */
function resizeContainer() {
    let squaresPerEdgeStr, squaresPerEdge;
    let valueEntered = false;
    do {
        squaresPerEdgeStr = prompt("How many squares per side of the grid?")
        if (squaresPerEdgeStr == null) {
            // Cancel button
            return;
        } else if (squaresPerEdgeStr == "") {
            alert("You have to enter some value");
        } else {
            squaresPerEdge = parseInt(squaresPerEdgeStr)
            if (squaresPerEdge == NaN) {
                alert("Only numeric values are legal");
            } else if (squaresPerEdge != squaresPerEdgeStr) {
                alert("Value must be an integer");
            } else if (squaresPerEdge < 1 || squaresPerEdge > 100) {
                alert("Please enter a value between 1 and 100");
            } else {
                // If we get this far, we're good
                valueEntered = true;
            }
        }
    } while (!valueEntered);

    console.assert(squaresPerEdge && squaresPerEdge >= 1 && squaresPerEdge <= 100);
    initContainer(squaresPerEdge, BLANK_SQUARE_COLOR);
}

// Using a large portion of the available space, dynamically compute the size of each square.
// Return this as a value in pixels.
function getSquareSizePixels(squaresPerEdge) {
    console.log(`The viewport is ${window.innerWidth} x ${window.innerHeight}`);

    const head = document.querySelector('#head');
    const headStyle = getComputedStyle(head);
    const headHeight = parseInt(headStyle.marginTop) + head.clientHeight + parseInt(headStyle.marginBottom);
    console.log(`The height of the head is ${headHeight}`);

    // size the total drawable area at 90% of the smaller of the available spaces
    const availHeight = window.innerHeight - headHeight;
    const availWidth = window.innerWidth
    const totalSize = Math.min(availHeight, availWidth) * 0.9;
    const squareSizePixels = totalSize / squaresPerEdge;
    console.log(`Will use an area that is ${totalSize} pixels square,` +
        ` with each of the ${squaresPerEdge} squares being ${squareSizePixels} each.`);

    return squareSizePixels;
}

/* Create a new row and add it to the container */
function addRow(container, squaresPerEdge, squareSizePixels, squareColor) {
    const row = document.createElement('div');
    row.classList.add('row')
    for (let y = 0; y < squaresPerEdge; y++) {
        // console.log(`Adding square ${y}`);
        addSquare(row, squareSizePixels, squareColor);
    }
    container.appendChild(row);
}

/* Create a new square and add it to the row */
function addSquare(row, squareSizePixels, squareColor) {
    const square = document.createElement('div');
    square.classList.add('square');

    square.style.width = `${squareSizePixels}px`;
    square.style.height = `${squareSizePixels}px`;
    square.style.backgroundColor = squareColor;

    square.addEventListener('mouseenter', updateSquare);

    row.appendChild(square);
}

function updateSquare() {
    console.log(`Update square based on drawing mode: ${drawingMode}`);
    this.style.backgroundColor = drawingMode;
    console.log(this);
}

function setDrawingMode() {
    console.log("Set drawing mode");

    const drawingModeSelect = document.querySelector('select#drawing-mode');
    // console.log(drawingModeSelect);
    // console.log(`value = ${drawingModeSelect.value}`);
    // This is an alternate way of getting the value
    // console.log(`options = ${drawingModeSelect.options}`);
    // console.log(`selectedIndex = ${drawingModeSelect.selectedIndex}`);
    // console.log(`options[selectedIndex] = ${drawingModeSelect.options[drawingModeSelect.selectedIndex]}`);
    // console.log(`value at index = ${drawingModeSelect.options[drawingModeSelect.selectedIndex].value}`);

    console.log(`Before: drawingMode = ${drawingMode}`);
    drawingMode = drawingModeSelect.value;
    console.log(`After: drawingMode = ${drawingMode}`);
}

console.log("Welcome to Etch-A-Sketch");

const resetButton = document.querySelector('button#reset');
resetButton.addEventListener('click', () => { initContainer(DEFAULT_SQUARES_PER_EDGE, BLANK_SQUARE_COLOR) });

const resizeButton = document.querySelector('button#resize');
resizeButton.addEventListener('click', resizeContainer);

const drawingModeSelect = document.querySelector('select#drawing-mode');
drawingModeSelect.addEventListener('change', setDrawingMode);

initContainer(DEFAULT_SQUARES_PER_EDGE, BLANK_SQUARE_COLOR);

console.log("Ready");
