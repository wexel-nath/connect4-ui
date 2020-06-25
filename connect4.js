const PLAYER_ONE = "red";
const PLAYER_TWO = "yellow";

class Connect4 {
    constructor(selector) {
        this.ROWS = 6;
        this.COLS = 7;
        this.player = "red";
        this.selector = selector;
        this.isGameOver = false;
        this.onPlayerMove = () => {};
        this.createGrid();
        this.setupEventListeners();
    }

    createGrid() {
        this.player = "red";
        this.onPlayerMove();
        this.isGameOver = false;

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

    setupEventListeners() {
        const board = $(this.selector);
        const that = this;

        const findLastEmptyCell = col => {
            const cells = $(`.col[data-col='${col}']`);
            for (let i = cells.length - 1; i >= 0; i--) {
                const cell = $(cells[i]);
                if (cell.hasClass("empty")) {
                    return cell;
                }
            }
            return null;
        }

        board.on("mouseenter", ".col.empty", function () {
            if (that.isGameOver) return;

            const col = $(this).data("col");
            const lastEmptyCell = findLastEmptyCell(col);
            lastEmptyCell.addClass(`next-${that.player}`);
        });

        board.on("mouseleave", ".col", function () {
            if (that.isGameOver) return;

            $(".col").removeClass(`next-${that.player}`);
        });

        board.on("click", ".col.empty", function () {
            if (that.isGameOver) return;

            const col = $(this).data("col");
            const lastEmptyCell = findLastEmptyCell(col);
            const row = lastEmptyCell.data("row");

            lastEmptyCell.removeClass(`empty next-${that.player}`);
            lastEmptyCell.addClass(that.player);
            lastEmptyCell.data('player', that.player);

            const winner = that.checkForWinner(row, col);
            if (winner) {
                that.isGameOver = true;
                alert(`Game Over! Player ${that.player} has won!`);
                $('.col.empty').removeClass('empty');
                return;
            }

            that.player = that.player === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
            that.onPlayerMove();
            $(this).trigger("mouseenter");
        });
    }

    checkForWinner(row, col) {
        const that = this;

        const getCell = (i, j) => $(`.col[data-row='${i}'][data-col='${j}']`);

        const checkDirection = (rowDiff, colDiff) => {
            let total = 0;
            let i = row + rowDiff;
            let j = col + colDiff;
            let next = getCell(i, j);
            while (i >= 0 &&
                i < that.ROWS &&
                j >= 0 &&
                j < that.COLS &&
                next.data('player') === that.player
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
            return total >= 4 ? that.player : null;
        }

        return (
            checkWin(1, 0) || // vertical
            checkWin(0, 1) || // horizontal
            checkWin(1, 1) || // positive diagonal
            checkWin(-1, 1) // negative diagonal
        );
    }

    restart() {
        this.createGrid();
    }
}