// <⚠️ DONT DELETE THIS ⚠️>
import "./styles.css";
// <⚠️ /DONT DELETE THIS ⚠️>

const form = document.querySelector(".js-toDoForm"),
  input = form.querySelector("input"),
  pendingList = document.querySelector(".pendingList"),
  finishedList = document.querySelector(".finishedList");

const PENDING = "PENDING";
const FINISHED = "FINISHED";

let pendings = [];
let finisheds = [];

function backToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const span = li.querySelector("span");
  paintToDo(span.innerText, true);
  deleteToDo(event);
}

function finishToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const span = li.querySelector("span");
  paintToDo(span.innerText, false);
  deleteToDo(event);
}

function deleteToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  if (li.className === PENDING) {
    pendingList.removeChild(li);
    const cleanToDos = pendings.filter(function(toDo) {
      return toDo.id !== parseInt(li.id, 10);
    });
    pendings = cleanToDos;
    savePendings();
  } else {
    finishedList.removeChild(li);
    const cleanToDos = finisheds.filter(function(toDo) {
      return toDo.id !== parseInt(li.id, 10);
    });
    finisheds = cleanToDos;
    saveFinisheds();
  }
}

function savePendings() {
  localStorage.setItem(PENDING, JSON.stringify(pendings));
}

function saveFinisheds() {
  localStorage.setItem(FINISHED, JSON.stringify(finisheds));
}

function paintToDo(text, bool) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  delBtn.innerText = "❌";
  const span = document.createElement("span");
  const newId = pendings.length + 1;
  delBtn.addEventListener("click", deleteToDo);
  span.innerText = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.id = newId;
  if (bool) {
    li.classList.add(PENDING);
    const finBtn = document.createElement("button");
    finBtn.innerText = "✅";
    finBtn.addEventListener("click", finishToDo);
    li.appendChild(finBtn);
    pendingList.appendChild(li);
    const pendingObj = {
      id: newId,
      text: text
    };
    pendings.push(pendingObj);
    savePendings();
  } else {
    li.classList.add(FINISHED);
    const retBtn = document.createElement("button");
    retBtn.innerText = "⏪";
    retBtn.addEventListener("click", backToDo);
    li.appendChild(retBtn);
    finishedList.appendChild(li);
    const finishedObj = {
      id: newId,
      text: text
    };
    finisheds.push(finishedObj);
    saveFinisheds();
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const currentValue = input.value;
  paintToDo(currentValue, true);
  input.value = "";
}

function loadToDos() {
  const loadedPendings = localStorage.getItem(PENDING);
  if (loadedPendings !== null) {
    const parsedPendings = JSON.parse(loadedPendings);
    parsedPendings.forEach(function(toDo) {
      paintToDo(toDo.text, true);
    });
  }
  const loadedFinisheds = localStorage.getItem(FINISHED);
  if (loadedFinisheds !== null) {
    const parsedFinisheds = JSON.parse(loadedFinisheds);
    parsedFinisheds.forEach(function(toDo) {
      paintToDo(toDo.text, false);
    });
  }
}

function init() {
  loadToDos();
  form.addEventListener("submit", handleSubmit);
}
init();
