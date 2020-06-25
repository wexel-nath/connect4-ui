class HumanPlayer {
  constructor(color, selector) {
    this.turn = false;
    this.color = color;
    this.selectedColumn = -1;
    this.selector = selector;
    this.setupEventListeners();
  }

  async getPosition(validMoves, boardArray) {
    this.turn = true;
    while (this.selectedColumn < 0) {
      await timeout(50);
    }

    const col = this.selectedColumn;
    this.selectedColumn = -1;
    this.turn = false;
    return col;
  }

  setupEventListeners() {
    const board = $(this.selector);
    const self = this;

    const findLastEmptyCell = (col) => {
      const cells = $(`.col[data-col='${col}']`);
      for (let i = cells.length - 1; i >= 0; i--) {
        const cell = $(cells[i]);
        if (cell.hasClass("empty")) {
          return cell;
        }
      }
      return null;
    };

    board.on("mouseenter", ".col.empty", function () {
      if (!self.turn) return;

      const col = $(this).data("col");
      const lastEmptyCell = findLastEmptyCell(col);
      lastEmptyCell.addClass(`next-${self.color}`);
    });

    board.on("mouseleave", ".col", function () {
      if (!self.turn) return;

      $(".col").removeClass(`next-${self.color}`);
    });

    board.on("click", ".col.empty", function () {
      if (!self.turn) return;

      self.selectedColumn = $(this).data("col");
      $(this).trigger("mouseenter");
    });
  }
}

class RandomPlayer {
  constructor(color) {
    this.color = color;
  }

  async getPosition(validMoves, boardArray) {
    await timeout(100);
    const index = Math.floor(Math.random() * validMoves.length);
    return validMoves[index];
  }
}

class CustomPlayer {
  constructor(color, endpoint) {
    this.color = color;
    this.endpoint = endpoint;
  }

  async getPosition(validMoves, boardArray) {
    // todo
    return 0;
  }
}
