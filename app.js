// Storage Controller


// Item Controller

const ItemCtrl = (function () {
  // Item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Struture / State
  const data = {
    items: [
      // {id: 0, name: 'Steak Dinner', calories: 1200},
      // {id: 1, name: 'Cookie', calories: 400},
      // {id: 2, name: 'Eggs', calories: 300}
    ],
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItems: function() {
      return data.items
    },

    addItem: function(name, calories) {
      let ID

      // Create ID
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;

      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories)

      // Create new item

      newItem = new Item(ID, name, calories)

      // Add to items array
      data.items.push(newItem)

      return newItem;

    },
    getItembyId: function(id) {
      let found = null;

      // loop through items
      data.items.forEach(function(item){
        if(item.id === id) {
          found = item
        }
      })

      return found;
    },
    setCurrentItem: function(item) {
      data.currentItem = item
    },

    getCurrentItem: function(){
      return data.currentItem;
    },

    getTotalCaloties: function() {
      let total = 0

      // Loop through items and add cals
      data.items.forEach((item) => {
        total += item.calories;
      });

      // Set totalCalories in data structure
      data.totalCalories = total;

      // Return Total
      return data.totalCalories;
    },

    logData: function() {
      return data;
    }
  }

})()


// UI Controller
const UICtrl = (function () {

  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    ItemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }


  // Public Methods
  return {
    populateItemList: function(items) {
      let html = '';

      items.forEach(function(item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fas fa-pencil-alt"></i>
        </a>
      </li>`;
      });

      // Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.ItemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function(item) {
      // Show List
      document.querySelector(UISelectors.itemList).style.display = 'block';

      // Create li element
      const li = document.createElement('li');

      // Add class
      li.className = 'collection-item';

      // Add id
      li.id = `item-${item.id}`;

      // Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fas fa-pencil-alt"></i>
      </a>`

      // Insert Item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    clearInput: function() {
      document.querySelector(UISelectors.ItemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    addItemToForm: function() {
      document.querySelector(UISelectors.ItemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none'
    },

    showTotalCalories: function(totalCal) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCal;
    },

    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    getSelectors: function() {
      return UISelectors;
    }
  }

})()


// App Controller
const App = (function (ItemCtrl, UICtrl) {

  // Load event listeners
  const loadEventListeners = function() {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add Item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit)
  }

  // Add Item submit
  const itemAddSubmit = function(e) {
    // Get Form input from UICrtl
    const input = UICtrl.getItemInput();

    // Chek for name and calorie input
    if(input.name !== '' && input.calories !== '') {
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories)

      // Add Item to UI list
      UICtrl.addListItem(newItem)

      // get total calories
      const totalCalories = ItemCtrl.getTotalCaloties()

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories)

      // Clear Input Fields
      UICtrl.clearInput()
    } else {
      console.log('Do Something')
    }

    e.preventDefault()
  }

  // Update item Submit
  const itemUpdateSubmit = function(e) {
    if(e.target.classList.contains('edit-item')) {
      // Get list item ID (item-0)
      const listid = e.target.parentNode.parentNode.id;

      // Break into an array
      const listidArr = listid.split('-');

      // Get id number
      const id = parseInt(listidArr[1])

      // Get item
      const itemToEdit = ItemCtrl.getItembyId(id)

      // Set curentItem
      ItemCtrl.setCurrentItem(itemToEdit)

      // Add Item to form
      UICtrl.addItemToForm();
    }


    e.preventDefault
  }

  // Public Methods
  return {
    init: function() {

      // Clear Edit State / set inital state
      UICtrl.clearEditState();

      // Fetch Items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if(items.length === 0) {
        UICtrl.hideList()

      } else {
      // Populate list with items
      UICtrl.populateItemList(items)

      }

      // get total calories
      const totalCalories = ItemCtrl.getTotalCaloties()

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories)

      // Load Event Listeners
      loadEventListeners()
    }
  }

})(ItemCtrl, UICtrl)


// Initalize App
App.init()