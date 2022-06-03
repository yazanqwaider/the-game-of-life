window.onload = function() {
    const SQUARES_LENGTH = 100;
    let interval = null;

    let squares = new Array(SQUARES_LENGTH);
    for (let row = 0; row < SQUARES_LENGTH; row++) {
        squares[row] = new Array(SQUARES_LENGTH).fill(false);
    }

    
    document.querySelector('.plate').innerHTML = generateEmptyCells();

    document.querySelectorAll('.cell').forEach(cellItem => toggleActivityOfCell(cellItem));


    // Start and stop running of game
    const startBtn = document.getElementById('start_btn');
    const stopBtn = document.getElementById('stop_btn');
    startBtn.addEventListener('click', function() {
        interval = setInterval(nextGeneration, 500);
        this.classList.add('active_btn');
        stopBtn.classList.remove('active_btn');
    });
    stopBtn.addEventListener('click', function() {
        clearInterval(interval);
        this.classList.add('active_btn');
        startBtn.classList.remove('active_btn');
    });

    
    function nextGeneration() {
        let copied_squares = JSON.parse(JSON.stringify(squares));
        let rowElem = document.querySelectorAll('.row');

        for (let row = 0; row < SQUARES_LENGTH; row++) {
            for (let cell = 0; cell < SQUARES_LENGTH; cell++) {
                const current_cell = squares[row][cell];
                const neighbors = getNeighbors(row, cell);
                const live_neighbors = neighbors.filter((neighbor) => (neighbor === true)).length;

                // rule [1]: each cell is live, 
                // then if it has two or three live neighbors, will still live
                // else if it has one or more of there or no neighbors, will die.
                if(current_cell) {
                    if(![2, 3].includes(live_neighbors)) {
                        copied_squares[row][cell] = false;
                        rowElem[row].children[cell].classList.remove('live_cell');
                    }
                }
                // rule [2]: each cell is die, 
                // then if it has three live neighbors, will live
                // else if it has not three neighbors, will still die.
                else {
                    if(live_neighbors == 3) {
                        copied_squares[row][cell] = true;
                        rowElem[row].children[cell].classList.add('live_cell');
                    }
                }
            }
        }
        squares = JSON.parse(JSON.stringify(copied_squares));
    }

    function generateEmptyCells() {
        let cells = "";
        for (var row = 0; row < SQUARES_LENGTH; row++) {
            cells+= `<div class="row">`;
            for (var cell = 0; cell < SQUARES_LENGTH; cell++) {
                cells+= `<div class="cell" data-row="${row}" data-cell="${cell}"></div>`;
            }
            cells+= `</div>`;
        }
        return cells;
    }

    function toggleActivityOfCell(cellItem) {
        cellItem.addEventListener('click', function() {
            const row = this.getAttribute('data-row');
            const cell = this.getAttribute('data-cell');

            squares[row][cell] = !squares[row][cell];
            if(squares[row][cell])
                this.classList.add('live_cell');
            else
                this.classList.remove('live_cell');
        });
    }

    function getNeighbors(row, cell) {
        let neighbors = [];
        if(row-1 >= 0)
            neighbors.push(squares[row-1][cell]);
        if(row+1 < SQUARES_LENGTH)
            neighbors.push(squares[row+1][cell]);

        if(cell-1 >= 0) {
            neighbors.push(squares[row][cell-1]);
            if(row-1 >= 0) {
                neighbors.push(squares[row-1][cell-1]);    
            }
            if(row+1 < SQUARES_LENGTH) {
                neighbors.push(squares[row+1][cell-1]);    
            }
        }

        if(cell+1 < SQUARES_LENGTH) {
            neighbors.push(squares[row][cell+1]);
            if(row-1 >= 0) {
                neighbors.push(squares[row-1][cell+1]);    
            }
            if(row+1 < SQUARES_LENGTH) {
                neighbors.push(squares[row+1][cell+1]);    
            }
        }

        return neighbors;
    }
}