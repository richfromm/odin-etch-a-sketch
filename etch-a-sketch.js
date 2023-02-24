// The canvas is NxN squares
// Later this will be variable
const N = 16

/* Initialize the container */
function initContainer(squaresPerEdge, squareColor) {
    console.log("Initializing container")

    const squareSizePixels = getSquareSizePixels(squaresPerEdge);

    const container = document.querySelector('#container');
    for (let x = 0; x < squaresPerEdge; x++) {
        // console.log(`Adding row ${x}`);
        addRow(container, squaresPerEdge, squareSizePixels, squareColor);
    }
    console.log("Container initialized")
    console.log(container)
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
    console.log("Update square");
    this.style.backgroundColor = 'black';
    console.log(this);
}

console.log("Welcome to Etch-A-Sketch");
initContainer(N, 'white');
console.log("Ready");
