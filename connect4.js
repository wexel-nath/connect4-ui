const PLAYER_ONE = "red";
const PLAYER_TWO = "yellow";

class Manager {
    constructor(selector) {
        this.board = new Connect4(selector);

        this.playerOne = new HumanPlayer(PLAYER_ONE, selector)
        this.playerTwo = new HumanPlayer(PLAYER_TWO, selector)
    }

    heading(text) {
        $('#heading').text(text);
    }

    async run() {
        this.board.createGrid();

        let turns = 0;
        while (true) {
            turns++;
            const player = turns % 2 === 0 ? this.playerTwo : this.playerOne;

            this.heading(`Waiting for ${player.color}`);
            const col = await player.getPosition();
            const winner = this.board.dropPiece(player.color, col);
            if (winner) {
                this.heading(`Game Over! Player ${player.color} has won!`);
                break;
            } else if (turns === 42) {
                this.heading("Game Over! It's a draw!");
                break;
            }
        }

        $('.col.empty').removeClass('empty');
    }
}

class Connect4 {
    constructor(selector) {
        this.ROWS = 6;
        this.COLS = 7;
        this.selector = selector;
        this.createGrid();
    }

    createGrid() {
        const board = $(this.selector);
        board.empty();
        for (let numRow = 0; numRow < this.ROWS; numRow++) {
            const row = $("<div>").addClass("row");
            for (let numCol = 0; numCol < this.COLS; numCol++) {
                const col = $("<div>")
                    .addClass("col empty")
                    .attr("data-col", numCol)
                    .attr("data-row", numRow);
                row.append(col);
            }
            board.append(row);
        }
    }

    dropPiece(color, col) {
        const lastEmptyCell = findLastEmptyCell(col);
        const row = lastEmptyCell.data("row");

        lastEmptyCell.removeClass(`empty next-${color}`);
        lastEmptyCell.addClass(color);
        lastEmptyCell.data('color', color);

        return this.checkForWinner(color, row, col);
    }

    checkForWinner(color, row, col) {
        const self = this;

        const getCell = (i, j) => $(`.col[data-row='${i}'][data-col='${j}']`);

        const checkDirection = (rowDiff, colDiff) => {
            let total = 0;
            let i = row + rowDiff;
            let j = col + colDiff;
            let next = getCell(i, j);
            while (i >= 0 &&
                i < self.ROWS &&
                j >= 0 &&
                j < self.COLS &&
                next.data('color') === color
            ) {
                total++;
                i += rowDiff;
                j += colDiff;
                next = getCell(i, j);
            }
            return total;
        };

        const checkWin = (rowDiff, colDiff) => {
            const total = 1 +
                checkDirection(rowDiff, colDiff) +
                checkDirection(-rowDiff, -colDiff);
            return total >= 4;
        }

        return (
            checkWin(1, 0) || // vertical
            checkWin(0, 1) || // horizontal
            checkWin(1, 1) || // positive diagonal
            checkWin(-1, 1) // negative diagonal
        );
    }
}