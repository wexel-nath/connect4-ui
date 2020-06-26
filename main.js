$(document).ready(function () {
  manager = new Manager();
  manager.run();

  $("#restart").click(() => {
    manager.run();
  });
});

const showCustom = color => {
  document.getElementById(`${color}-custom`).style.display = 'block';
};

const hideCustom = color => {
  document.getElementById(`${color}-custom`).style.display = 'none';
};