$(document).ready(function () {
  manager = new Manager();
  manager.run();

  $("#restart").click(() => {
    manager.run();
  });
});
