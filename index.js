import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js';

const appSettings = {
    databaseURL: "https://shop-together-6a782-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.querySelector("#input-field");
const addButtonEl = document.querySelector("#add-button");
const shoppingListEl = document.querySelector("#shopping-list");

inputFieldEl.addEventListener("keydown", function(e) {
	if (e.key === "Enter") addButtonEl.click();
});

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    
    push(shoppingListInDB, inputValue);
    
    clearInputEl();
});

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        shoppingListEl.innerHTML = "";

				itemsArray.forEach(currentItem => {
					appendItemToShoppingListEl(currentItem);
			});
    } else {
        shoppingListEl.innerHTML = "No items in list... yet";
    }
});

function clearInputEl() {
    inputFieldEl.value = "";
};

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
};