// 브라우저에 물건 목록을 저장해두는 상자 이름
const STORAGE_KEY = "shopping-list-items";

const form = document.getElementById("add-form");
const input = document.getElementById("item-input");
const list = document.getElementById("item-list");
const emptyMessage = document.getElementById("empty-message");

// 브라우저에 저장된 목록을 꺼내온다. 없으면 빈 목록으로 시작한다.
function loadItems() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

// 목록을 브라우저 저장 공간에 다시 넣어둔다.
function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

let items = loadItems();

// 목록 데이터를 가지고 화면(li 태그들)을 새로 그려준다.
function render() {
  list.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "item" + (item.checked ? " checked" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.checked;
    checkbox.addEventListener("change", () => toggleItem(item.id));

    const span = document.createElement("span");
    span.textContent = item.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", () => deleteItem(item.id));

    li.append(checkbox, span, deleteBtn);
    list.appendChild(li);
  });

  emptyMessage.classList.toggle("hidden", items.length > 0);
}

// 새 물건을 목록 맨 앞에 추가한다.
function addItem(text) {
  items.unshift({
    id: Date.now(),
    text,
    checked: false,
  });
  saveItems(items);
  render();
}

// 체크박스를 눌렀을 때 완료 상태를 뒤집어준다.
function toggleItem(id) {
  items = items.map((item) =>
    item.id === id ? { ...item, checked: !item.checked } : item
  );
  saveItems(items);
  render();
}

// 목록에서 해당 물건을 지운다.
function deleteItem(id) {
  items = items.filter((item) => item.id !== id);
  saveItems(items);
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (text === "") return;
  addItem(text);
  input.value = "";
  input.focus();
});

render();
