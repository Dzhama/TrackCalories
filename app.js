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
        addItem: function(name, calories) {
            // create ID
            if(data.items.length > 0) {
                ID = data.items[data.items.length -1].id + 1;
            }else {
                ID = 0;
            }

            // calories to number
            calories = parseInt(calories);

            // Create a new Item
            newItem = new Item(ID, name, calories);

            // Add to items array
            data.items.push(newItem);

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
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'

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
       //get Selectors
        const UISelector = UICtrl.getSelectors();
        // Add item events;
        document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit)
   }    
   
   //Add item submit
   const itemAddSubmit = function (e) {
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();

        // check for name and calories input
        if(input.name !== '' && input.calories !== '') {
           // add item
           const newItem = ItemCtrl.addItem(input.name, input.calories)
        }
        e.preventDefault(e);
   }

    // public methods
   return {
       init: function() {
           //Fetch items from Data Structure
           const items = ItemCtrl.getItems();

           //Populate List with Items
           UICtrl.populateItemList(items);

           //Load event listeners
           loadEventListeners();
       } 
       
   }

})(ItemCtrl, UICtrl);


//////////////////////////////////////////////////////////
// Initializing App
App.init()