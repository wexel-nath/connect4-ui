$(document).ready(function () {
    manager = new Manager("#connect4");
    manager.run();

    $('#restart').click(() => {
        manager.run();
    })
});