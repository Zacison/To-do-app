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

			return newItem;
		},
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
				
				html = '<section class="to-do-list"><section class="list-items"><div class="item" id="item-0"><span class="checkmark-button"><input type="checkbox"></span><span class="item-description"><h2>%description%</h2></span><span class="delete-button"><input type="button" value= "delete" class="actual-delete-button"></span></div></section></section>';
				newHtml = html.replace('%description%', item.description);

				document.querySelector('.to-do-list-container').insertAdjacentHTML('beforeend', newHtml);
			} 
			else {

				html = '<div class="item" id="item-0"><span class="checkmark-button"><input type="checkbox"></span><span class="item-description"><h2>%description%</h2></span><span class="delete-button"><input type="button" value= "delete" class="actual-delete-button"></span></div>';
				newHtml = html.replace('%description%', item.description);

				document.querySelector('.list-items').insertAdjacentHTML('beforeend', newHtml);		
			}
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
	};

	return {
		init:function() {
			setupEventListeners();
		},
	}

})(dataModule, UIModule);

appControllerModule.init();