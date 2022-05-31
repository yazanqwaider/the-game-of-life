window.onload = function() {
    const SQUARES_LENGTH = 100;
    let interval = null;

    let squares = new Array(SQUARES_LENGTH);
    for (let row = 0; row < SQUARES_LENGTH; row++) {
        squares[row] = new Array(SQUARES_LENGTH).fill(false);
    }

    let items = "";
    for (var row = 0; row < SQUARES_LENGTH; row++) {
        items+= `<div class="squares_row">`;
        for (var col = 0; col < SQUARES_LENGTH; col++) {
            items+= `<div class="square_col" data-row="${row}" data-col="${col}"></div>`;
        }
        items+= `</div>`;
    }
    
    let plateElem = document.querySelector('.plate');
    plateElem.innerHTML = items;

    document.querySelectorAll('.square_col').forEach(squareCol => {
        squareCol.addEventListener('click', function() {
            const row = this.getAttribute('data-row');
            const col = this.getAttribute('data-col');

            squares[row][col] = !squares[row][col];
            if(squares[row][col])
                this.classList.add('live_cell');
            else
                this.classList.remove('live_cell');
        });
    });


    const startBtn = document.getElementById('start_btn');
    const stopBtn = document.getElementById('stop_btn');
    startBtn.addEventListener('click', function() {
        interval = setInterval(nextGeneration, 1000);
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
        let rowElem = document.querySelectorAll('.squares_row');

        for (let row = 0; row < SQUARES_LENGTH; row++) {
            for (let col = 0; col < SQUARES_LENGTH; col++) {
                const current_cell = squares[row][col];
                let neighbors = [];

                if(row-1 >= 0)
                    neighbors.push(squares[row-1][col]);
                if(row+1 < SQUARES_LENGTH)
                    neighbors.push(squares[row+1][col]);

                if(col-1 >= 0) {
                    neighbors.push(squares[row][col-1]);
                    if(row-1 >= 0) {
                        neighbors.push(squares[row-1][col-1]);    
                    }
                    if(row+1 < SQUARES_LENGTH) {
                        neighbors.push(squares[row+1][col-1]);    
                    }
                }

                if(col+1 < SQUARES_LENGTH) {
                    neighbors.push(squares[row][col+1]);
                    if(row-1 >= 0) {
                        neighbors.push(squares[row-1][col+1]);    
                    }
                    if(row+1 < SQUARES_LENGTH) {
                        neighbors.push(squares[row+1][col+1]);    
                    }
                }
                
                const live_neighbors = neighbors.filter((neighbor) => (neighbor === true)).length;
                if(current_cell) {
                    if(![2, 3].includes(live_neighbors)) {
                        copied_squares[row][col] = false;
                        rowElem[row].children[col].classList.remove('live_cell');
                    }
                }
                else {
                    if(live_neighbors == 3) {
                        copied_squares[row][col] = true;
                        rowElem[row].children[col].classList.add('live_cell');
                    }
                }
            }
        }

        squares = JSON.parse(JSON.stringify(copied_squares));
    }
}