// What color to make the squares when resetting
const BLANK_SQUARE_COLOR = 'white';

const DrawingModes = {
    Black: "black",
    White: "white",
    Darken: "darken",
    Lighten: "lighten"
};

// How many levels of grey
const GREY_LEVELS = 10;

// range of RGB values
const RGB_MIN = 0;
const RGB_MAX = 255;

// XXX is there a better solution than global variables?

// Initial values, can change
let SquaresPerEdge = 16; // change via prompt from Resize button
let DrawingMode = DrawingModes.Black; // change via pulldown

/* Initialize the container */
function initContainer() {
    const squareColor = BLANK_SQUARE_COLOR;
    // XXX use of global variable
    const squaresPerEdge = SquaresPerEdge;

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

    // update global variable
    SquaresPerEdge = squaresPerEdge;

    initContainer();
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
    // XXX use of global variable
    const drawingMode = DrawingMode;

    console.log(`Update square based on drawing mode: ${drawingMode}`);
    switch (drawingMode) {
        case DrawingModes.Black:
        case DrawingModes.White:
            // This case is simple, we can use named colors
            this.style.backgroundColor = drawingMode;
            break;
        case DrawingModes.Darken:
        case DrawingModes.Lighten:
            const squareColor = getComputedStyle(this).backgroundColor;
            // https://stackoverflow.com/a/66623849/9797192
            // we're going to ignore alpha
            let [r, g, b, a] = squareColor.match(/\d+/g).map(Number);
            let greyLevelAdjust = (RGB_MAX - RGB_MIN + 1) / GREY_LEVELS;
            if (drawingMode == DrawingModes.Darken) {
                // subtract values to darken
                greyLevelAdjust *= -1;
            }
            // else keep as is, to add values to lighten
            if (isPureGrey(r, g, b)) {
                r += greyLevelAdjust;
            } else {
                let rgb_limit;
                if (drawingMode == DrawingModes.Lighten) {
                    // start lighten at the first level after black
                    rgb_limit = RGB_MIN;
                } else {
                    // start darken at the last level before white
                    rgb_limit = RGB_MAX;
                }
                // greyLevelAdjust is already either a positive or negative value
                // so this is either add to the min, or subtract from the max
                r = rgb_limit + greyLevelAdjust;
            }
            // keep values in bounds
            r = Math.min(RGB_MAX, r);
            r = Math.max(RGB_MIN, r);
            // darken and lighten just give grey values as results
            g = r;
            b = r;
            // this automatically rounds, so we don't have to convert r, g, and b to integer values
            // you could argue that we should anyway, b/c it's sloppy not to
            // but it's a little silly, since we're not actually storing the more precise value
            // so we already have potential rounding error
            // it's ultimately not precise enough to worry about
            this.style.backgroundColor = rgbToString(r, g, b);
            break;
        default:
            console.error(`Unknown drawing mode, not updating square: ${drawingMode}`);
    }

    console.log(this);
}

/* Is the input RGB color a literal grey (equal color values) */
function isPureGrey(r, g, b) {
    return (r === g) && (g === b);
}

function rgbToString(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
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

    // update global variable
    console.log(`Before: drawingMode = ${DrawingMode}`);
    DrawingMode = drawingModeSelect.value;
    console.log(`After: drawingMode = ${DrawingMode}`);
}

console.log("Welcome to Etch-A-Sketch");

const resetButton = document.querySelector('button#reset');
resetButton.addEventListener('click', initContainer);

const resizeButton = document.querySelector('button#resize');
resizeButton.addEventListener('click', resizeContainer);

const drawingModeSelect = document.querySelector('select#drawing-mode');
drawingModeSelect.addEventListener('change', setDrawingMode);

initContainer();

console.log("Ready");
