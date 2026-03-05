const fs = require("fs");
const prompt = require("prompt-sync")();

let jsonFile = "./tasks.json";
let tasks = [];

if (fs.existsSync(jsonFile) && fs.statSync(jsonFile).size > 0) {
  const data = fs.readFileSync(jsonFile, "utf8");
  tasks = JSON.parse(data);
}

function helperDateFormat(isoString) {
  const date = new Date(isoString);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "short" });
  return `${day} ${month} ${year}`;
}

function saveToFile() {
  fs.writeFileSync(jsonFile, JSON.stringify(tasks, null, 2));
}

function getNextId() {
  return tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
}

function statusHelper(status) {
  return status ? "Completed" : "Not Completed";
}

function viewTasks() {
  if (tasks.length === 0) return console.log("No tasks found.");
  tasks.forEach((tsk) => {
    console.log(
      `[${tsk.id}] ${tsk.title} - ${statusHelper(tsk.isCompleted)} (${helperDateFormat(tsk.createdAt)})`,
    );
  });
}
function filterCompletedTasks() {
  const completedTasks = tasks.filter((t) => t.isCompleted);
  if (completedTasks.length === 0)
    return console.log("No completed tasks found.");
  completedTasks.forEach((tsk) => {
    console.log(
      `[${tsk.id}] ${tsk.title} - ${statusHelper(tsk.isCompleted)} (${helperDateFormat(tsk.createdAt)})`,
    );
  });
}
function addTask(title) {
  if (!title) return console.log("Invalid title");
  let taskObj = {
    id: getNextId(),
    title: title,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(taskObj);
  saveToFile();
  console.log("Task Saved");
}

function deleteTask(id) {
  if (isNaN(id)) return console.log("ID must be a number");
  const initialLength = tasks.length;
  tasks = tasks.filter((tsk) => tsk.id !== id);

  if (tasks.length < initialLength) {
    saveToFile();
    console.log("Task Deleted Successfully");
  } else {
    console.log("Task ID not found.");
  }
}

function markTaskCompleted(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.isCompleted = !task.isCompleted;
    saveToFile();
    console.log(`Task ${id} is now ${statusHelper(task.isCompleted)}`);
  } else {
    console.log("Task ID not found.");
  }
}

while (true) {
  console.log(
   `
1. Add Task
2. View Tasks
3. Mark Task Completed
4. Delete Task
5. View Completed Tasks
6. Exit
   `
  );
  let option = prompt("Choose: ");
  switch (option) {
    case "1":
      let title = prompt("Enter title: ");
      addTask(title);
      break;
    case "2":
      viewTasks();
      break;
    case "3":
      let cId = prompt("Enter ID to toggle: ");
      markTaskCompleted(Number(cId));
      break;
    case "4":
      let dId = prompt("Enter ID to delete: ");
      deleteTask(Number(dId));
      break;
    case "5":
      filterCompletedTasks();
      break;
    case "6":
      process.exit();
  }
}
