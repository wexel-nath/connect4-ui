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

const timeout = async ms => new Promise(res => setTimeout(res, ms));