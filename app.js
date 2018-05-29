//Storage Controller
const StorageCtrl = (function(){
    
    //Public methods
    return {
        storeItem: function(item){
            let items;
            //Check if any items in LS
            if(localStorage.getItem('items') === null){
                items = [];
                //Push new item
                items.push(item);
                //Set LS
                localStorage.setItem('items', JSON.stringify(items));
            }else {
                //Get what we have in LS
                items = JSON.parse(localStorage.getItem('items'));
                //Push new item
                items.push(item);
                //Set LS
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemFromStorage: function() {
            let items;
            //Check if any items in LS
            if (localStorage.getItem('items') === null) {
                items = [];
            }else {
                //Get what we have in LS
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        }
    }
})();

///////////////////////////////////////////////////
//Item Controller
const ItemCtrl = (function() {
    //Item Constructot
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / State
    const data = {
        // items: [
        //     // {
        //     //     id: 0,
        //     //     name: "Steak Diner",
        //     //     calories: 1200
        //     // },
        //     // {
        //     //     id: 1,
        //     //     name: "Cookie",
        //     //     calories: 400
        //     // },
        //     // {
        //     //     id: 2,
        //     //     name: "Egg",
        //     //     calories: 200
        //     // }
        // ],
        items: StorageCtrl.getItemFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // public methods
    return {
        getItems: function() {
            return data.items;
        },
        getItemById: function(id) {
            let found = null;

            // Loop 
            data.items.forEach(function(item){
                if(item.id === id) {
                    found = item;
                }
            });

            return found;
        },
        updateItem: function (name, calories) {
            //calories to number
            calories = parseInt(calories);

            let found = 0;

            data.items.forEach(function(item) {
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },
        addItem: function(name, calories) {
            // create ID
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            }else {
                ID = 0;
            }

            // calories to number
            calories = parseInt(calories);
            // Create a new Item
            newItem = new Item(ID, name, calories);
            // Add to items array
            data.items.push(newItem);
            return newItem;

        },
        deleteItem: function(id){

            //get iDs
            const ids = data.items.map(function(item){
                return item.id;
            });

            //get index
            const index = ids.indexOf(ids);

            //Remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function() {
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function() {
            let total = 0;
            // Loop throug items and add cals
            data.items.forEach(function(item){
                total += item.calories
            })
            
            // Set total calories in data structure
            data.totalCalories = total;

            // Return total
            return data.totalCalories;
        },
        logData: function() {
            return data;
        } 
    }
})();

///////////////////////////////////////////////////////////
//UI Controller
const UICtrl = (function () {

    const UISelector = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'

    }
    // public methods
    return {
        populateItemList: function(items) {
            let html = "";

            items.forEach(item => {
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}:</strong>
                    <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fas fa-pencil-alt"></i>
                    </a>
                 </li>
                `;
            });

            // insert list items
            document.querySelector(UISelector.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelector.itemNameInput).value,
                calories: document.querySelector(UISelector.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            //Show the list
            document.querySelector(UISelector.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            //Add ID
            console.log(item);
            li.id = `item-${item.id}`;
            
            li.innerHTML = `
                    <strong>${item.name}:</strong>
                    <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fas fa-pencil-alt"></i>
                    </a>`;
            // Insert item
            document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelector.listItems);

            // Turn Node list in to array
            listItems = Array.from(listItems);
            // LOOP 
            listItems.forEach(function (listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}:</strong>
                    <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fas fa-pencil-alt"></i>
                    </a>
                    `;
                }
            })
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function() {
            document.querySelector(UISelector.itemNameInput).value = '';
            document.querySelector(UISelector.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelector.listItems);
            
            //Trun Node list to array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            })
        },
        hideList: function() {
            document.querySelector(UISelector.itemList).style.display = 'none';
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelector.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.deleteBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';
            document.querySelector(UISelector.addBtn).style.display = 'inline';
            //Clear fields
            UICtrl.clearInput();
        },
        showEditState: function(){
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
            document.querySelector(UISelector.addBtn).style.display = 'none';
        },
        getSelectors: function() {
            return UISelector;
        }
    }
})();

/////////////////////////////////////////////////////////
//App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
   // Load Event listeners
   const loadEventListeners = function() {
       //Get Selectors
        const UISelector = UICtrl.getSelectors();
        // Add item events;
        document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit);

        //disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.wich === 13) {
                e.preventDefault();
                return false;
            }
        })

       //Edit icon click event
       document.querySelector(UISelector.itemList).addEventListener('click', itemEditClick);
       // Update item submit event
       document.querySelector(UISelector.updateBtn).addEventListener('click', itemUpdateSubmit);
       // Back button event
       document.querySelector(UISelector.backBtn).addEventListener('click', UICtrl.clearEditState);
       //Delete button event
       document.querySelector(UISelector.deleteBtn).addEventListener('click', itemDeleteSubmit);
       //Clear button event
       document.querySelector(UISelector.clearBtn).addEventListener('click', clearAllItemsClick);
   }
   
   
   //Add item submit
   const itemAddSubmit = function (e) {
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();
        
        // Check for name and calories input
        if(input.name !== '' && input.calories !== '') {
           // Add item
           const newItem = ItemCtrl.addItem(input.name, input.calories);
           //Add item to UI list
            UICtrl.addListItem(newItem);
            // Get total Calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add total Calories to UI
            UICtrl.showTotalCalories(totalCalories);
            // Get from LS
            StorageCtrl.storeItem(newItem);            
            //Clear fields
            UICtrl.clearInput();
        }
        e.preventDefault();
   }

   //Click edit item
    itemEditClick = function(e) {
       
        if(e.target.classList.contains('edit-item')) {
           // Get list item id
           const listId = e.target.parentNode.parentNode.id;
           //Break into an array
           const listIdArr = listId.split('-');
           //Get the actual id
           const id = parseInt(listIdArr[1]);
           // Get Item
           const itemToEdit = ItemCtrl.getItemById(id);
           // Set current item
           ItemCtrl.setCurrentItem(itemToEdit);
           //Add item to form
           UICtrl.addItemToForm();
        }

       e.preventDefault(e);
   }

   //Item update Submit event
   itemUpdateSubmit = function (e) {
        //Get item input
       const input = UICtrl.getItemInput();
       //Update item
       const updateItem = ItemCtrl.updateItem(input.name, input.calories);
       // Update UI
       UICtrl.updateListItem(updateItem);
       // Get total Calories
       const totalCalories = ItemCtrl.getTotalCalories();
       //Add total Calories to UI
       UICtrl.showTotalCalories(totalCalories);
       //Clear Edit State
       UICtrl.clearEditState();

    e.preventDefault();
   }

    // Item Delete event
   const itemDeleteSubmit = function(e){
       //get current item
       const currentItem = ItemCtrl.getCurrentItem();
       //Delete from data structure
       ItemCtrl.deleteItem(currentItem.id);
       // Delete from UI
       UICtrl.deleteListItem(currentItem.id);
       // Get total Calories
       const totalCalories = ItemCtrl.getTotalCalories();
       //Add total Calories to UI
       UICtrl.showTotalCalories(totalCalories);
       //Clear Edit State
       UICtrl.clearEditState();
    e.preventDefault();
   }

   //Clear all items event
   const clearAllItemsClick = function() {
       //Delete all items from Data Structure
       ItemCtrl.clearAllItems();
       // Get total Calories
       const totalCalories = ItemCtrl.getTotalCalories();
       //Add total Calories to UI
       UICtrl.showTotalCalories(totalCalories);
       //Remove all items from UI
       UICtrl.removeItems();
       // Get total Calories
        //Hide list
        UICtrl.hideList();

   }

    // Public methods
   return {
       init: function() {
           //Clear edit state 
           UICtrl.clearEditState();
           //Fetch items from Data Structure
           const items = ItemCtrl.getItems();

            //Check if any items
            if(items.length === 0) {
                //Hide the list
                UICtrl.hideList();
            }else {
                //Populate List with Items
                UICtrl.populateItemList(items);
            }

           // Get total Calories
           const totalCalories = ItemCtrl.getTotalCalories();
           //Add total Calories to UI
           UICtrl.showTotalCalories(totalCalories);
           //Load event listeners
           loadEventListeners();
       } 
       
   }
})(ItemCtrl, StorageCtrl, UICtrl);

//////////////////////////////////////////////////////////
// Initializing App
App.init()