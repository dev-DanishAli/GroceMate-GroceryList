const addButton = document.getElementById('add-button');
const clearButton = document.getElementById('clear-button');
const input = document.getElementById('grocery-input');
const list = document.getElementById('grocery-list');
const themeToggle = document.getElementById('theme-toggle');
const exportBtn = document.getElementById('export-pdf');
const body = document.body;


document.addEventListener('DOMContentLoaded', () => {
  const items = JSON.parse(localStorage.getItem('groceryItems')) || [];
  items.forEach(item => addItemToDOM(item));

  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  }
});


addButton.addEventListener('click', () => {
  const value = input.value.trim();
  if (value === "") {
    alert("Please enter an item.");
    return;
  }
  addItemToDOM(value);
  saveToLocalStorage(value);
  input.value = "";
  input.focus();
});


clearButton.addEventListener('click', () => {
  if (confirm("Clear the entire list?")) {
    list.innerHTML = "";
    localStorage.removeItem('groceryItems');
  }
});


function addItemToDOM(item) {
  const li = document.createElement('li');
  li.innerHTML = `
    ${item}
    <button class="delete-btn" onclick="deleteItem(this)">×</button>
  `;
  list.appendChild(li);
}


function saveToLocalStorage(item) {
  const items = JSON.parse(localStorage.getItem('groceryItems')) || [];
  items.push(item);
  localStorage.setItem('groceryItems', JSON.stringify(items));
}


function deleteItem(button) {
  const li = button.parentElement;
  const itemText = li.firstChild.textContent.trim();
  li.classList.add('fadeOut');
  setTimeout(() => li.remove(), 300);

  let items = JSON.parse(localStorage.getItem('groceryItems')) || [];
  items = items.filter(i => i !== itemText);
  localStorage.setItem('groceryItems', JSON.stringify(items));
}


themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});


exportBtn.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("GroceMate - Grocery List", 20, 20);

  const items = Array.from(document.querySelectorAll('#grocery-list li')).map(li => li.firstChild.textContent.trim());

  if (items.length === 0) {
    alert("No items to export!");
    return;
  }

  items.forEach((item, i) => {
    doc.text(`${i + 1}. ${item}`, 20, 30 + i * 10);
  });

  doc.save("Grocery_List.pdf");
});
