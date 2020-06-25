const PLAYER_ONE = "red";
const PLAYER_TWO = "yellow";
const SELECTOR = "#connect4";

const OPTION_HUMAN = "human";
const OPTION_RANDOM = "random";
const OPTION_CUSTOM = "custom";

class Manager {
  constructor() {
    this.board = new Connect4(SELECTOR);
    this.createPlayers();
  }

  createPlayers() {
    this.playerOne = this.createPlayer(PLAYER_ONE);
    this.playerTwo = this.createPlayer(PLAYER_TWO);
  }

  createPlayer(color) {
    const selected = $(`input[name='${color}-type']:checked`).val();
    if (selected === OPTION_RANDOM) {
      return new RandomPlayer(color);
    }

    return new HumanPlayer(color, SELECTOR);
  }

  heading(text) {
    $("#heading").text(text);
  }

  async run() {
    this.board.createGrid();
    this.createPlayers();

    let turns = 0;
    while (true) {
      const player = turns % 2 === 0 ? this.playerOne : this.playerTwo;
      turns++;

      const validMoves = this.board.getValidMoves();
      const boardArray = this.board.getBoardArray();

      this.heading(`Waiting for ${player.color}`);
      const col = await player.getPosition(validMoves, boardArray);
      const winner = this.board.dropPiece(player.color, col);
      if (winner) {
        this.heading(`Game Over! Player ${player.color} has won!`);
        break;
      } else if (turns === 42) {
        this.heading("Game Over! It's a draw!");
        break;
      }
    }

    $(".col.empty").removeClass("empty");
  }
}
