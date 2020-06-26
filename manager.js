const PLAYER_ONE = "red";
const PLAYER_TWO = "yellow";
const DRAW = "draw";
const SELECTOR = "#connect4";

const OPTION_HUMAN = "human";
const OPTION_RANDOM = "random";
const OPTION_CUSTOM = "custom";

const GAME_OVER_TIMEOUT = 3000;
const RANDOM_WAIT_TIME = 100;

class Manager {
  constructor() {
    this.board = new Connect4(SELECTOR);
    this.createPlayers();
    this.results = {
      [PLAYER_ONE]: 0,
      [PLAYER_TWO]: 0,
      [DRAW]: 0,
    };
    this.stats = {
      [PLAYER_ONE]: {
        totalTimeTaken: 0,
        totalMoves: 0,
        maxTime: 0,
      },
      [PLAYER_TWO]: {
        totalTimeTaken: 0,
        totalMoves: 0,
        maxTime: 0,
      }
    }
  }

  createPlayers() {
    this.playerOne = this.createPlayer(PLAYER_ONE);
    this.playerTwo = this.createPlayer(PLAYER_TWO);
  }

  createPlayer(color) {
    const selected = $(`input[name='${color}-type']:checked`).val();
    if (selected === OPTION_RANDOM) {
      return new RandomPlayer(color, RANDOM_WAIT_TIME);
    }
    if (selected === OPTION_CUSTOM) {
      const endpoint = $(`input[id='${color}-custom']`).val();
      return new CustomPlayer(color, endpoint)
    }

    return new HumanPlayer(color, SELECTOR);
  }

  heading(text) {
    $("#heading").text(text);
  }

  async play() {
    this.board.createGrid();

    let turns = 0;
    let start, elapsed;
    while (true) {
      const player = turns % 2 === 0 ? this.playerOne : this.playerTwo;
      turns++;

      const validMoves = this.board.getValidMoves();
      const boardArray = this.board.getBoardArray();

      this.heading(`Waiting for ${player.color}`);
      start = new Date();
      let col = await player.getPosition(validMoves, boardArray);
      elapsed = (new Date()) - start;
      if (!validMoves.includes(col)) {
        // if the provided move is not valid, just select randomly
        col = randomMove(validMoves);
      }

      const winner = this.board.dropPiece(player.color, col);
      if (elapsed > this.stats[player.color].maxTime) {
        this.stats[player.color].maxTime = elapsed;
      }
      this.stats[player.color].totalTimeTaken += elapsed;
      this.stats[player.color].totalMoves++;
      if (winner) {
        this.heading(`Game Over! Player ${player.color} has won!`);
        return player.color;
      } else if (turns === 42) {
        this.heading("Game Over! It's a draw!");
        return DRAW;
      }
    }
  }

  async run() {
    this.createPlayers();

    do {
      const result = await this.play();
      this.results[result]++;

      this.updateStats(PLAYER_ONE);
      this.updateStats(PLAYER_TWO);
      await timeout(GAME_OVER_TIMEOUT);
    }
    while (this.playerOne.isAutomated && this.playerTwo.isAutomated)
  }

  updateStats(color) {
    const wins = this.results[color];
    const losses = this.results[color === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE];
    const draws = this.results[DRAW];
    const played = wins + losses + draws;
    const winRate = wins / played * 100;

    $(`#${color}-played`).text(played);
    $(`#${color}-wins`).text(wins);
    $(`#${color}-win-rate`).text(winRate.toFixed(1) + "%");
    $(`#${color}-losses`).text(losses);
    $(`#${color}-draws`).text(draws);

    const {
      totalTimeTaken,
      totalMoves,
      maxTime
    } = this.stats[color];

    const avgTime = totalTimeTaken / totalMoves;
    $(`#${color}-avg-time`).text(avgTime.toFixed(0) + "ms");
    $(`#${color}-max-time`).text(maxTime.toFixed(0) + "ms");
  }
}