/***************************************************************
 * DATA STRUCTURES
 ***************************************************************/
const hotDrinks = [
    { name: 'Espresso (s)', price: 2.5 },
    { name: 'Espresso (d)', price: 3.5 },
    { name: 'Americano', price: 3.5 },
    { name: 'Café filtre', price: 3.5 },
    { name: 'Cortado', price: 4.0 },
    { name: 'Cappuccino / Latte', price: 4.5 },
    { name: 'Flat White', price: 5.0 },
    { name: 'Chai Latte', price: 5.0 },
    { name: 'Matcha Latte', price: 5.0 },
    { name: 'Golden Latte', price: 5.0 },
    { name: 'Thé / Infusion', price: 5.0 },
    { name: 'Grand Latte', price: 5.5 },
    { name: 'V60', price: 6.0 },
  ];
  
  const coldDrinks = [
    { name: 'Soda', price: 3.5 },
    { name: 'Iced Latte (s)', price: 4.5 },
    { name: 'Iced Latte (d)', price: 5.0 },
    { name: 'Iced Chai', price: 5.0 },
    { name: 'Iced Matcha', price: 5.0 },
    { name: 'Cold Brew', price: 5.0 },
    { name: 'Espresso Tonic', price: 5.5 },
    { name: 'Limonade', price: 6.0 },
    { name: 'Ginger Beer', price: 6.0 },
    { name: 'Kombucha', price: 6.0 },
  ];
  
  const food = [
    { name: 'Cookie (Vegan) - Choc, Olive Oil, Fleur de sel', price: 4.0 },
    { name: 'Cookie - Chocolat, Tahini', price: 4.0 },
  ];
  
  const apero = [
    { name: 'Olives (apéro)', price: 4 },
    { name: 'Houmous (apéro)', price: 6 },
    { name: 'Fromages (apéro)', price: 8 },
    { name: 'Burrata (apéro)', price: 8 },
  ];
  
  const auVerre = [
    { name: 'Vin nat (bib) (12.5cl) - 6€', price: 6 },
    { name: 'Vin nat (bib) (12.5cl) - 7€', price: 7 },
    { name: 'Vin nat (12.5cl) - 6€', price: 6 },
    { name: 'Vin nat (bib) (12.5cl) - 7€', price: 7 },
    { name: 'Vin nat (12.5cl) - 8€', price: 8 },
    { name: 'Bières bouteilles (33cl) - 5€', price: 5 },
    { name: 'Bières bouteilles (33cl) - 6€', price: 6 },
  ];
  
  // Tables data (fixed)
  const tables = [
    { id: 'table1', name: 'Table 1', items: [], firstCommandTime: null },
    { id: 'table2', name: 'Table 2', items: [], firstCommandTime: null },
    { id: 'table3', name: 'Table 3', items: [], firstCommandTime: null },
    { id: 'table4', name: 'Table 4', items: [], firstCommandTime: null },
    { id: 'table5', name: 'Table 5', items: [], firstCommandTime: null }
  ];
  
  // Customers data (initially empty)
  let customers = [];
  
  // Global state variables
  let currentMode = 'tables'; // 'tables' or 'customers'
  let selectedEntity = null;  // Currently selected table or customer
  let totalSalesAmount = 0;   // Global total sales
  
  /***************************************************************
   * ON PAGE LOAD
   ***************************************************************/
  document.addEventListener('DOMContentLoaded', () => {
    switchMode('tables');
    populateAccordion(); // Build out the accordion lists
  });
  
  /***************************************************************
   * MODE SWITCHING
   ***************************************************************/
  function switchMode(mode) {
    currentMode = mode;
    document.getElementById('tab-tables').classList.toggle('active', mode === 'tables');
    document.getElementById('tab-customers').classList.toggle('active', mode === 'customers');
    selectedEntity = null;
    updateEntityGrid();
    hideDetailsPanel();
  }
  
  /***************************************************************
   * ENTITY GRID UPDATE
   ***************************************************************/
  function updateEntityGrid() {
    const grid = document.getElementById('entity-grid');
    grid.innerHTML = '';
  
    // In customers mode, add an "Add Client" box first
    if (currentMode === 'customers') {
      const addDiv = document.createElement('div');
      addDiv.className = 'entity-circle add-client';
      addDiv.innerHTML = `
        <img src="add-client.png" alt="Add Client" class="entity-logo">
        <p class="entity-name">Add Client</p>
      `;
      addDiv.onclick = () => addNewCustomer();
      grid.appendChild(addDiv);
    }
  
    const entities = currentMode === 'tables' ? tables : customers;
    entities.forEach(entity => {
      const div = document.createElement('div');
      div.className = 'entity-circle';
      if (selectedEntity && selectedEntity.id === entity.id) {
        div.classList.add('selected');
      }
      const logoSrc = currentMode === 'tables' ? 'table-logo.png' : 'customer-logo.png';
      const due = entity.items.reduce((sum, item) => sum + item.price, 0);
      let elapsed = '';
      if (entity.firstCommandTime) {
        const diff = Date.now() - entity.firstCommandTime;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        elapsed = `${minutes}m ${seconds}s`;
      }
      div.innerHTML = `
        <img src="${logoSrc}" alt="${entity.name} Logo" class="entity-logo">
        <p class="entity-name">${entity.name}</p>
        <p class="entity-due">Due: ${due.toFixed(2)}€</p>
        <p class="entity-time">${elapsed}</p>
      `;
      div.onclick = () => selectEntity(entity);
      grid.appendChild(div);
    });
    updateTotalSalesDisplay();
  }
  
  /***************************************************************
   * SELECT ENTITY
   ***************************************************************/
  function selectEntity(entity) {
    selectedEntity = entity;
    updateEntityGrid();
    showDetailsPanel();
  }
  
  /***************************************************************
   * DETAILS PANEL
   ***************************************************************/
  function showDetailsPanel() {
    document.getElementById('details-panel').classList.remove('hidden');
    updateDetailsPanel();
  }
  
  function hideDetailsPanel() {
    document.getElementById('details-panel').classList.add('hidden');
  }
  
  function updateDetailsPanel() {
    if (!selectedEntity) return;
    document.getElementById('details-title').textContent = selectedEntity.name + " Details";
    const list = document.getElementById('details-items');
    list.innerHTML = '';
    let total = 0;
    selectedEntity.items.forEach((item, index) => {
      total += item.price;
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${item.name} – ${item.price.toFixed(2)}€</span>
        <button class="remove-btn" onclick="removeItem(${index})">✖</button>
      `;
      list.appendChild(li);
    });
    document.getElementById('details-total').textContent = `Total: ${total.toFixed(2)}€`;
  }
  
  /***************************************************************
   * REMOVE ITEM
   ***************************************************************/
  function removeItem(index) {
    if (!selectedEntity) return;
    selectedEntity.items.splice(index, 1);
    if (selectedEntity.items.length === 0) {
      selectedEntity.firstCommandTime = null;
    }
    updateDetailsPanel();
    updateEntityGrid();
  }
  
  /***************************************************************
   * CLEAR SELECTED ENTITY (PAYMENT)
   ***************************************************************/
  function clearSelectedEntity() {
    if (!selectedEntity) return;
    if (!confirm("Are you sure you want to clear all items for " + selectedEntity.name + "?")) return;
    const due = selectedEntity.items.reduce((sum, item) => sum + item.price, 0);
    totalSalesAmount += due;
  
    if (currentMode === 'tables') {
      selectedEntity.items = [];
      selectedEntity.firstCommandTime = null;
    } else {
      customers = customers.filter(c => c.id !== selectedEntity.id);
    }
  
    selectedEntity = null;
    hideDetailsPanel();
    updateEntityGrid();
    updateTotalSalesDisplay();
  }
  
  /***************************************************************
   * UPDATE TOTAL SALES DISPLAY
   ***************************************************************/
  function updateTotalSalesDisplay() {
    const el = document.getElementById('total-sales');
    el.textContent = `Total Sales: ${totalSalesAmount.toFixed(2)}€`;
  }
  
  /***************************************************************
   * ADD NEW CUSTOMER
   ***************************************************************/
  function addNewCustomer() {
    const name = prompt("Enter the customer's name:");
    if (!name) return;
    const id = Date.now().toString();
    const newCustomer = { id, name, items: [], firstCommandTime: null };
    customers.push(newCustomer);
    updateEntityGrid();
  }
  
  /***************************************************************
   * ACCORDION (COLLAPSIBLE MENU)
   ***************************************************************/
  function populateAccordion() {
    fillCategoryList('hot-drinks-list', hotDrinks);
    fillCategoryList('cold-drinks-list', coldDrinks);
    fillCategoryList('food-list', food);
    fillCategoryList('apero-list', apero);
    fillCategoryList('auverre-list', auVerre);
  }
  
  function fillCategoryList(listId, itemsArray) {
    const ul = document.getElementById(listId);
    if (!ul) return; // if the list element doesn't exist, do nothing
    ul.innerHTML = '';
    itemsArray.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} – ${item.price}€`;
      li.onclick = () => addMenuItemToEntity(item);
      ul.appendChild(li);
    });
  }
  
  function toggleAccordion(header) {
    const section = header.parentElement;
    const icon = header.querySelector('.accordion-icon');
    section.classList.toggle('active');
    icon.textContent = section.classList.contains('active') ? '–' : '+';
  }
  
  /***************************************************************
   * ADD MENU ITEM TO ENTITY
   ***************************************************************/
  function addMenuItemToEntity(item) {
    if (!selectedEntity) {
      alert("Please select a table or customer first.");
      return;
    }
    if (!selectedEntity.firstCommandTime) {
      selectedEntity.firstCommandTime = Date.now();
    }
    selectedEntity.items.push({ name: item.name, price: item.price });
    updateDetailsPanel();
    updateEntityGrid();
  }
  
  /***************************************************************
   * ADD CUSTOM ITEM
   ***************************************************************/
  function addCustomItem() {
    if (!selectedEntity) {
      alert("Please select a table or customer first.");
      return;
    }
    const itemName = prompt("Enter the custom item name:");
    if (!itemName) return;
    const priceStr = prompt("Enter the price for this item:");
    if (!priceStr) return;
    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) {
      alert("Invalid price. Please try again.");
      return;
    }
    if (!selectedEntity.firstCommandTime) {
      selectedEntity.firstCommandTime = Date.now();
    }
    selectedEntity.items.push({ name: itemName, price: price });
    updateDetailsPanel();
    updateEntityGrid();
  }
  