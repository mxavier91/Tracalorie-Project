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
      {id: 0, name: 'Steak Dinner', calories: 1200},
      {id: 1, name: 'Cookie', calories: 400},
      {id: 2, name: 'Eggs', calories: 300}
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
    ItemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories'
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
    const UISelectors = UICtrl.getSelectors()

    // Add Item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
  }

  // Add Item submit
  const itemAddSubmit = function(e) {
    // Get Form input from UICrtl
    const input = UICtrl.getItemInput();

    // Chek for name and calorie input
    if(input.name !== '' && input.calories !== '') {
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories)
    }

    e.preventDefault()
  }

  // Public Methods
  return {
    init: function() {

      // Fetch Items from data structure
      const items = ItemCtrl.getItems()

      // Populate list with items
      UICtrl.populateItemList(items)

      // Load Event Listeners
      loadEventListeners()
    }
  }

})(ItemCtrl, UICtrl)


// Initalize App
App.init()