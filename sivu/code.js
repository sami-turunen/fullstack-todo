const rootApi = "https://fullstack-todoo.onrender.com";

function init() {
  let infoText = document.getElementById("infoText");
  infoText.innerHTML = "Ladataan tehtävälista palvelimelta...";
  loadTodos();
}

async function loadTodos() {
  let response = await fetch(rootApi + "/todos");
  let todos = await response.json();
  console.log(todos);
  showTodos(todos);
}

function createTodoListItem(todo) {
  let li = document.createElement("li");
  let li_attr = document.createAttribute("id");
  li_attr.value = todo._id;
  li.setAttributeNode(li_attr);
  let text = document.createTextNode(todo.text);
  li.appendChild(text);
  let edit = document.createElement("span");
  let edit_attr = document.createAttribute("class");
  edit_attr.value = "edit";
  edit.setAttributeNode(edit_attr);
  let edit_btn = document.createTextNode(" Muokkaa ");
  edit.appendChild(edit_btn);
  edit.onclick = function () {
    changeButton(todo._id);
  };
  li.appendChild(edit);
  let span = document.createElement("span");
  let span_attr = document.createAttribute("class");
  span_attr.value = "delete";
  span.setAttributeNode(span_attr);
  let x = document.createTextNode(" x ");
  span.appendChild(x);
  span.onclick = function () {
    removeTodo(todo._id);
  };
  li.appendChild(span);
  return li;
}

function showTodos(todos) {
  let todosList = document.getElementById("todosList");
  let infoText = document.getElementById("infoText");
  todosList.innerHTML = "";
  if (todos.length === 0) {
    infoText.innerHTML = "Ei tehtäviä";
  } else {
    todos.forEach((todo) => {
      let li = createTodoListItem(todo);
      todosList.appendChild(li);
    });
    infoText.innerHTML = "";
  }
}

async function addTodo() {
  let newTodo = document.getElementById("newTodo");
  if (newTodo.value === "") {
    alert("Tehtävä ei voi olla tyhjä!");
    return;
  }
  const data = { text: newTodo.value };
  const response = await fetch(rootApi + "/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let todo = await response.json();
  let todosList = document.getElementById("todosList");
  let li = createTodoListItem(todo);
  todosList.appendChild(li);
  let infoText = document.getElementById("infoText");
  infoText.innerHTML = "";
  newTodo.value = "";
}

async function removeTodo(id) {
  const response = await fetch(`${rootApi}/todos/${id}`, {
    method: "DELETE",
  });

  let responseJson = await response.json();
  let li = document.getElementById(id);
  li.parentNode.removeChild(li);
  let todosList = document.getElementById("todosList");
  if (!todosList.hasChildNodes()) {
    let infoText = document.getElementById("infoText");
    infoText.innerHTML = "Ei tehtäviä";
  }
}

function changeButton(id) {
  let newTodo = document.getElementById("newTodo");
  let button = document.getElementById("submitButton");
  let li = document.getElementById(id);
  if (button.innerHTML === "Lisää") {
    button.innerHTML = "Tallenna";
    button.className = "editButton";
    newTodo.value = li.firstChild.textContent;
    button.setAttribute("onclick", `updateTodo("${id}")`);
  } else {
    button.innerHTML = "Lisää";
    button.className = "addButton";
    button.setAttribute("onclick", "addTodo()");
  }
}

async function updateTodo(id) {
  let newTodo = document.getElementById("newTodo");
  if (newTodo.value === "") {
    alert("Tehtävä ei voi olla tyhjä!");
    return;
  }
  const data = { text: newTodo.value };
  let url = rootApi + "/todos/" + id;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  loadTodos();
  let infoText = document.getElementById("infoText");
  infoText.innerHTML = "";
  newTodo.value = "";
  changeButton(id);
}
