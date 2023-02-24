// The canvas is NxN squares
// Later this will be variable
const N = 16
// How big is each square
// Later this will also be variable
const SQUARE_SIZE = 32

/* Initialize the container */
function initContainer(squaresPerEdge, squareSizePixels, squareColor) {
    console.log("Initializing container")
    let container = document.querySelector('#container');
    for (let x = 0; x < squaresPerEdge; x++) {
        // console.log(`Adding row ${x}`);
        addRow(container, squaresPerEdge, squareSizePixels, squareColor);
    }
    console.log("Container initialized")
    console.log(container)
}

/* Create a new row and add it to the container */
function addRow(container, squaresPerEdge, squareSizePixels, squareColor) {
    let row = document.createElement('div');
    row.classList.add('row')
    for (let y = 0; y < squaresPerEdge; y++) {
        // console.log(`Adding square ${y}`);
        addSquare(row, squareSizePixels, squareColor);
    }
    container.appendChild(row);
}

/* Create a new square and add it to the row */
function addSquare(row, squareSizePixels, squareColor) {
    let square = document.createElement('div');
    square.classList.add('square');
    square.style.width = `${squareSizePixels}px`;
    square.style.height = `${squareSizePixels}px`;
    square.style.backgroundColor = squareColor;
    row.appendChild(square);
}

console.log("Welcome to Etch-A-Sketch");
initContainer(N, SQUARE_SIZE, 'white');
console.log("Ready");