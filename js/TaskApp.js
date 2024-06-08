export class Task {
  static key;
  static Pending = "pending";
  static Done = "done";

  constructor(taskName, taskStatus = null, key = null) {
    this.taskName = taskName;
    this.taskStatus = taskStatus === null ? Task.Pending : taskStatus;
    if (key != null) this.key = key;
    else {
      this.key = Number.parseInt(localStorage.getItem("key"));
      localStorage.setItem("key", this.key + 1);
    }
  }

  updateStatus() {
    this.taskStatus =
      this.taskStatus == Task.Pending ? Task.Done : Task.Pending;
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    for (let i = 0; i < tasks.length; i++)
      if (tasks[i].key == this.key) {
        tasks[i] = this;
      }

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  save() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.push(this);

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  delete() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    for (let i = 0; i < tasks.length; i++)
      if (tasks[i].key == this.key) tasks.splice(i, 1);

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

export class TaskItem {
  constructor(task) {
    this.task = task;
    this.assignEvent(this.render());
    const tasks = document.querySelector("[data-tasks]");
    tasks.scrollTo(0, tasks.offsetHeight + tasks.offsetTop);
  }

  render() {
    const taskWrapper = TaskItem.Element(
      "li",
      "className",
      `list-group-item d-flex justify-content-between align-items-center cursor-pointer ${
        this.task.taskStatus === Task.Done ? "bg-light" : ""
      }`
    );

    const taskStatusIcon = TaskItem.Element(
      "span",
      "className",
      `border rounded-circle size ${
        this.task.taskStatus === Task.Done ? "bg-done" : ""
      }`
    );

    const taskText = TaskItem.Element(
      "p",
      ["className", "innerText"],
      [
        `my-auto ${
          this.task.taskStatus === Task.Done
            ? "text-decoration-line-through"
            : ""
        }`,
        this.task.taskName,
      ]
    );

    const taskDeleteIcon = TaskItem.Element(
      "img",
      ["className", "src", "width", "height", "alt"],
      ["cursor-pointer", "./img/delete.png", 10, 10, "delete"]
    );

    taskWrapper.append(taskStatusIcon, taskText, taskDeleteIcon);
    document.body.querySelector("[data-tasks]").append(taskWrapper);

    return {
      text: taskText,
      wrapper: taskWrapper,
      delete: taskDeleteIcon,
      icon: taskStatusIcon,
    };
  }

  assignEvent(taskWrapper) {
    taskWrapper.wrapper.addEventListener("click", () => {
      this.task.updateStatus();
      taskWrapper.wrapper.classList.toggle("bg-light");
      taskWrapper.icon.classList.toggle("bg-done");
      taskWrapper.text.classList.toggle("text-decoration-line-through");
    });

    taskWrapper.delete.addEventListener("click", () => {
      this.task.delete();
      taskWrapper.wrapper.remove();
    });
  }
  static Element(tagName, attr = null, value = null) {
    const tag = document.createElement(tagName);
    if (attr instanceof Array)
      for (let i = 0; i < attr.length; i++) tag[attr[i]] = value[i];
    else tag[attr] = value;

    return tag;
  }

  static AddTaskItem(taskName, taskStatus = null) {
    const task = new Task(taskName, taskStatus);
    task.save();
    new TaskItem(task);
  }

  static renderAll() {
    const items = JSON.parse(localStorage.getItem("tasks"));
    if (items.length != 0)
      for (const data of items) {
        const task = new Task(data.taskName, data.taskStatus, data.key);
        new TaskItem(task);
      }
  }
}
