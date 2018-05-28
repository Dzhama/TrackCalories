//Storage Controller

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
        items: [
            {
                id: 0,
                name: "Steak Diner",
                calories: 1200
            },
            {
                id: 1,
                name: "Cookie",
                calories: 400
            },
            {
                id: 2,
                name: "Egg",
                calories: 200
            }
        ],
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
        setCurrentItem(item) {
            data.currentItem = item;
        },
        getCurrentItem(){
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
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
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
        clearInput: function() {
            document.querySelector(UISelector.itemNameInput).value = '';
            document.querySelector(UISelector.itemCaloriesInput).value = '';
        },
        addItemToForm(){
            document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
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
const App = (function (ItemCtrl, UICtrl) {
   // Load Event listeners
   const loadEventListeners = function() {
       //Get Selectors
        const UISelector = UICtrl.getSelectors();
        // Add item events;
        document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit);

       //Edit icon click
       document.querySelector(UISelector.itemList).addEventListener('click', itemUpdateSubmit)
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

            //Clear fields
            UICtrl.clearInput();
        }
        e.preventDefault(e);
   }

   //Update Item Submit
   itemUpdateSubmit = function(e) {
       
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

})(ItemCtrl, UICtrl);


//////////////////////////////////////////////////////////
// Initializing App
App.init()