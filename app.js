var dataModule = (function() {

	var Item = function(id, description) {
		this.id = id;
		this.description = description;
	};

	var data = {
		allItems: [],
	};

	return {
		
		addItem: function(description) {
			var newItem, ID;

			if (data.allItems.length > 0) {
				ID = data.allItems[data.allItems.length-1].id +1;
			}
			else {
				ID = 0;
			}

			newItem = new Item(ID, description);
			data.allItems.push(newItem);
			this.persistData();
			return newItem;
			
		},


		deleteItemData: function(idNum) {

			var idArray = data.allItems.map(function(currentValue){
				return currentValue.id;
			});

			var index = idArray.indexOf(idNum);

			if(index !== -1) {
				data.allItems.splice(index, 1);
			}

			this.persistData();
			
		},

		allDataItems: function() {
			return {
				allItems: data.allItems,
			}
		},

		
		//Create local storage functionality
		persistData: function() {
			localStorage.setItem('Items', JSON.stringify(data.allItems))
		},

		//restroring the stored data back into the data model
		readStorage: function() {
			var storage = JSON.parse(localStorage.getItem('Items'));
			storage.forEach(el => {
				var description = el.description;
				var id = el.id;
				var newItem = new Item(id, description);
				data.allItems.push(newItem)
			})
			console.log(storage);

				
			return {
				allItems: data.allItems,
			}
		}
		
	}

})();


var UIModule = (function(){

	return {
		getInput: function() {
			return {
				description: document.querySelector('.input-text').value,
			}
		},

		displayItem: function (item) {
			var html;
			var newHtml;
			var firstItemHtml;
		

				if (item.id === 0) {
					
					html = '<section class="to-do-list"><section class="list-items"><div class="item" id="item-0"><span class="checkmark-button"><input type="checkbox" id ="cb"><span class="checkmarkCSS"></span></span><span class="item-description"><h2 class="des">%description%</h2></span><span class="delete-button"><input type="button" value= "Delete" class="actual-delete-button"></span></div></section></section>';
					newHtml = html.replace('%description%', item.description);

					document.querySelector('.to-do-list-container').insertAdjacentHTML('beforeend', newHtml);
				} 
			
				else {

					html = '<div class="item" id="item-0"><span class="checkmark-button"><input type="checkbox" id ="cb"><span class="checkmarkCSS"></span></span><span class="item-description"><h2 class="des">%description%</h2></span><span class="delete-button"><input type="button" value= "Delete" class="actual-delete-button"></span></div>';
					newHtml = html.replace('%description%', item.description);
					newHtml = newHtml.replace('item-0', 'item-' + item.id);

					document.querySelector('.list-items').insertAdjacentHTML('afterbegin', newHtml);		
				}
		},

		clearFields: function() {
			document.querySelector('.input-text').value = "";
		},


		deleteToDoListItem: function(selectorID) {
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},

		deleteLastToDoListItem: function(selectorID) {
			var el = document.querySelector('.' + selectorID);
			el.parentNode.removeChild(el);
		},

	}

})();


var appControllerModule = (function(dataModule, UIModule){

	var addNewItem = function() { //What needs to happen when the button is pressed?
		
		//#1: Read input from user interface & store as a var
		var userInput = UIModule.getInput();
		console.log(userInput)

		//#2: create a data model, and add it to the data model
		if (userInput.description !=="") {
			var newItem = dataModule.addItem(userInput.description);
		}

		//#3: add to user interface
		UIModule.displayItem(newItem);

		//#4: Clear the fields
		UIModule.clearFields();

	};



	var deleteItem = function(event) {

		//#1: Listen to the event firing to delete an element
	
		var itemID = event.target.parentNode.parentNode.id;
		
		var classID = event.target.className; //.actual delete button
		
		var toDoListClass = event.target.parentNode.parentNode.parentNode.parentNode.className; //.to-to-list 
		
		var howManyItems = dataModule.allDataItems().allItems.length - 1;
		

		var splitID = itemID.split('-');
		var id = parseInt(splitID[1]);
	
		if(itemID && classID === "actual-delete-button") {

				//#2: Delete item from data strucute
				dataModule.deleteItemData(id);

				//#3: Delete item from UI
				UIModule.deleteToDoListItem(itemID);
			
		}
		 if (howManyItems == 0 && classID === "actual-delete-button") {
			console.log("Baby yoda");

			//#1: Delete last item from data structure
			dataModule.deleteItemData(id);
				

			//#3: Delete the last item from UI
			UIModule.deleteLastToDoListItem(toDoListClass);
				
		}
	}



	var setupEventListeners = function() {
		document.querySelector('.input-button').addEventListener('click', function(){
			addNewItem();		
		});
		
		document.addEventListener('keypress', function(event){
			if(event.keycode === 13 || event.which === 13) {
				addNewItem();
			}
		});

		//adds delete button funcitonality
		document.querySelector('.to-do-list-container').addEventListener('click', deleteItem);


		//Toggles the strikethrough class for the item desctiption
		document.querySelector('.to-do-list-container').addEventListener('click', function(event) {
			
			if (event.target.className === "des") {
				event.target.classList.add("strikethrough");
			}
			else if (event.target.classList.length === 2) {
				event.target.classList.remove("strikethrough");
			}
		});


		//Restore items from local storage
		 window.addEventListener('load', function() {

			//Restore Items
			dataModule.readStorage();
			var items = dataModule.allDataItems();
			console.log(items);
			
			//Iterate each item from localStorage through the UI to display
			
			if(items.allItems.length === 1) {
				
				//console.log(items.allItems);
				
				items.allItems.forEach(el => {
					el.id = 0;
					console.log(el.description);
					console.log(el.id);
					UIModule.displayItem(el);
				});	
			} 
			else if (items.allItems.length > 1) {
				items.allItems.forEach((el, index) => {
					console.log(el.index);
					el.id = index;
					UIModule.displayItem(el);
				});	
			};
		
		/*
			
			*/
		})
	};

	return {
		init:function() {
			setupEventListeners();
		},
	}

})(dataModule, UIModule);

appControllerModule.init();