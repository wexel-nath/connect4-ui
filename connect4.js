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

  getValidMoves() {
    return $(".col.empty[data-row='0']")
      .map((_, col) => $(col).data("col"))
      .get();
  }

  getBoardArray() {
    let board = [];
    for (let numRow = 0; numRow < this.ROWS; numRow++) {
      board[numRow] = [];
      for (let numCol = 0; numCol < this.COLS; numCol++) {
        const color = $(`.col[data-row='${numRow}'][data-col='${numCol}']`).data("color");
        let val = 0;
        if (color === PLAYER_ONE) {
          val = 1;
        } else if (color === PLAYER_TWO) {
          val = 2;
        }

        board[numRow].push(val)
      }
    }

    return board;
  }

  dropPiece(color, col) {
    const lastEmptyCell = findLastEmptyCell(col);
    const row = lastEmptyCell.data("row");

    lastEmptyCell.removeClass(`empty next-${color}`);
    lastEmptyCell.addClass(color);
    lastEmptyCell.data("color", color);

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
      while (
        i >= 0 &&
        i < self.ROWS &&
        j >= 0 &&
        j < self.COLS &&
        next.data("color") === color
      ) {
        total++;
        i += rowDiff;
        j += colDiff;
        next = getCell(i, j);
      }
      return total;
    };

    const checkWin = (rowDiff, colDiff) => {
      if (checkDirection(rowDiff, colDiff) + checkDirection(-rowDiff, -colDiff) >= 3) {
        $(".col.empty").removeClass("empty");
        return true;
      };
      return false;
    };

    return (
      checkWin(1, 0) || // vertical
      checkWin(0, 1) || // horizontal
      checkWin(1, 1) || // positive diagonal
      checkWin(-1, 1) // negative diagonal
    );
  }
}