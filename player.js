class HumanPlayer {
    constructor(color, selector) {
        this.turn = false;
        this.color = color;
        this.selectedColumn = -1;
        this.selector = selector;
        this.setupEventListeners();
    }

    async getPosition() {
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