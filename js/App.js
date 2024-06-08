import { TaskItem } from "./TaskApp.js";

class App {
  constructor() {
    if (localStorage.getItem("key") === null) {
      localStorage.setItem("tasks", JSON.stringify([]));
      localStorage.setItem("key", 1);
    }

    window.onload = TaskItem.renderAll;

    this.addButton = document.querySelector("[app-add]");
    this.inputField = document.querySelector("[app-input]");
  }

  run() {
    this.addButton.addEventListener("click", () => {
      TaskItem.AddTaskItem(this.inputField.value);
      this.inputField.value = "";
    });
  }
}

new App().run();
