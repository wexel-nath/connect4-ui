$(document).ready(function () {
    const connect4 = new Connect4('#connect4');
    connect4.onPlayerMove = () => {
        $('#player').text(connect4.player);
    }

    $('#restart').click(() => {
        connect4.restart();
    })
});