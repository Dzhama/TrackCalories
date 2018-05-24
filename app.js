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
        logData: function() {
            return data;
        } 
    }
})();

///////////////////////////////////////////////////////////
//UI Controller
const UICtrl = (function () {

    const UISelector = {
        itemList: '#item-list'
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
        }
    }
})();

/////////////////////////////////////////////////////////
//App Controller
const App = (function (ItemCtrl, UICtrl) {
        

    // public methods
   return {
       init: function() {
           //Fetch items from Data Structure
           const items = ItemCtrl.getItems();

           //Populate List with Items
           UICtrl.populateItemList(items);
       }
   }

})(ItemCtrl, UICtrl);


//////////////////////////////////////////////////////////
// Initializing App
App.init()