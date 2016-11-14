document.addEventListener('DOMContentLoaded', () => {
	let currentGame; let canAttack = false;
	let gameOn = true;

	function characterPrototype (name, healthPoints, attackPower, counterAttackPower, defeated, image) {
		this.name = name;
		this.healthPoints = healthPoints;
		this.maxHealthPoints = healthPoints;
		this.attackPower = attackPower;
		this.counterAttackPower = counterAttackPower;
		this.defeated = false;
		this.image = image
	}

	function gamePrototype (characterArray) {
		this.characters = characterArray;
		this.selectedCharacter = null;
		this.selectedOpponentIndex = null;
		this.victories = 0;
	}


	const initializeStartingArray = () => {
		characterArray = [
			new characterPrototype("Lancelot", 100, 30, Math.floor(30/3), false, 'assets/images/Joust1.jpg'),
			new characterPrototype("Percival", 120, 35, Math.floor(35/3), false, 'assets/images/Joust2.jpg'),
			new characterPrototype("Lamorak", 110, 25, Math.floor(25/3), false, 'assets/images/Joust3.jpg'),
			// new characterPrototype("Gawain", 90, 30, 15, false, 'assets/images/Joust4.jpg'),
			new characterPrototype("Geraint", 90, 40, Math.floor(40/3), false, 'assets/images/Joust5.jpg'),
		];
		return characterArray;
	}

	const updateFighterUI = () => {
		let nodeList = document.querySelectorAll('#fighters .progress-bar');
		let thisPlayer = currentGame.selectedCharacter;
		let thisOpponent = characterArray[currentGame.selectedOpponentIndex];
		nodeList[0].innerHTML = thisPlayer.healthPoints;
		nodeList[1].innerHTML = thisOpponent.healthPoints;
		nodeList[0].style.width = (thisPlayer.healthPoints / thisPlayer.maxHealthPoints * 100).toString() + '%';
		nodeList[1].style.width = (thisOpponent.healthPoints / thisOpponent.maxHealthPoints * 100).toString()+ '%';
	}

	const startGame = (characterArray) => {
		currentGame = new gamePrototype(characterArray);
		//Click event to handle the character the player selects
		createEventListeners('click', 'div.fighter-card', 'selectedCharacter', (event) => {
			spliceCharacter(event.currentTarget['data-fighterName']);
			document.getElementById('fighters').innerHTML = "";
			//Create the character panel the player has selected
			createCharacterPanel(currentGame.selectedCharacter, 'fighters', 'col-md-3', true);
			battle();
		});
	}

	const battle = () => {
		document.getElementById('actionMessage').innerHTML = "Select your opponent";
		//Updated column width based on how many fighters are in the array
		let columnWidth = (
			characterArray.length > 4 
			? 3
			: Math.floor(12 / characterArray.length)
		);
		characterArray.map((x,i) => createCharacterPanel(x, 'opponents', 'col-md-'+ columnWidth, false ));
		
		//Select opponent
		createEventListeners('click', 'div.fighter-card', 'selectedOpponentIndex', (event) => {
			let index = characterIndex(event.currentTarget['data-fighterName']);
			if (index !== undefined && currentGame.characters[index].defeated == false) {
				currentGame.selectedOpponentIndex = index;
				event.currentTarget.style.visibility = 'hidden';
				createCharacterPanel(characterArray[currentGame.selectedOpponentIndex], 'fighters', 'col-md-3 pull-right', true)
				canAttack = true;
				document.getElementById('actionMessage').innerHTML = "Press enter to begin attacking!";

			}
		});
		document.addEventListener('keypress', (event) => {
			if (event.key == 'Enter' && canAttack && gameOn) attack();
		});
	}

	const animateAttack = () => {
		let nodeList = document.querySelectorAll('#fighters div.fighter-card');
		$(nodeList[0]).animate({left: '2000px'}, 'slow');
		$(nodeList[0]).animate({left: '0px'}, 'slow');
		$(nodeList[1]).animate({right: '2000px'}, 'slow');
		$(nodeList[1]).animate({right: '0px'}, 'slow');
		// $(nodeList[0]).toggleClass('skewClock');
	}

	const attack =  () => {
		canAttack = false;
		animateAttack();
		//Player attacks first
		const damageOnOpponent = Math.floor(currentGame.selectedCharacter.attackPower * Math.random());
		currentGame.characters[currentGame.selectedOpponentIndex].healthPoints -= damageOnOpponent;
		const damageOnPlayer = Math.floor(currentGame.characters[currentGame.selectedOpponentIndex].counterAttackPower * Math.random());
		document.getElementById('actionMessage').innerHTML = (currentGame.selectedCharacter.name + " attacked with " +  damageOnOpponent + ' damage.');
		updateFighterUI();
		setTimeout(() => {
			if (currentGame.selectedOpponentIndex !== null && currentGame.characters[currentGame.selectedOpponentIndex].healthPoints > 0) {
				currentGame.selectedCharacter.healthPoints -= damageOnPlayer;
				updateFighterUI();
				document.getElementById('actionMessage').innerHTML = (currentGame.characters[currentGame.selectedOpponentIndex].name + " countered with " +  damageOnPlayer + ' damage.');
				setTimeout(() => canAttack = true, 1200); //Allow time for the animations to complete
			}
		}, 750);
		if (currentGame.selectedCharacter.healthPoints < 1) {
			//Condition if player runs out of health
			canAttack = false;
			winGame(false);
		}
		else if (currentGame.characters[currentGame.selectedOpponentIndex].healthPoints < 1) {
			//Condition if opponent is defeated
			canAttack = false;
			currentGame.characters[currentGame.selectedOpponentIndex].defeated = true;
			currentGame.selectedOpponentIndex = null;
			document.getElementById('actionMessage').innerHTML = "Please select a more worthy opponent!";
			let nodeList = document.querySelectorAll('#opponents .fighter-card');
			let nodeArray = Array.prototype.slice.call(nodeList, 0);
			console.log(nodeArray)
			nodeArray.map((x,i) => {
				x.style.visibility = "initial";
				if (currentGame.characters[i].defeated) x.className += " defeated";
			});
			console.log(nodeArray);
			//Remove last node / defeated opponent
			nodeList = document.querySelectorAll('#fighters .fighter-card');
			let lastNode = nodeList[nodeList.length - 1];
			lastNode.parentNode.removeChild(lastNode);
			currentGame.victories++;
			if (currentGame.victories == currentGame.characters.length) {
				winGame(true);
			} 
		}
	}

	const winGame = (winner) => {
		gameOn = false;
		document.addEventListener('keypress', (event) => {
			if (event.key == 'Enter' && gameOn == false) {
				gameOn = true;
				init();
			}
		});
		document.getElementById('actionMessage').innerHTML = winner 
			? 'You are victorious. Press enter to restart' 
			: 'You have been defeated. Press enter to restart.';

	}

	const characterIndex = (characterName) => {
		//Return the index location of a character name
		let index;
		characterArray.map((x, i) => {
			if (x.name == characterName) index = i;
		});
		return index;
		// let result = characterArray.filter((object) => {
		// 	return object.name === name.toString();
		// });
	}

	const spliceCharacter = (characterName) => {
		//Remove the chosen character from the array and reassign it to the selected character property
		const index = characterIndex(characterName);
		let selectedFighter = characterArray.splice(index, 1)[0];
		currentGame.selectedCharacter = selectedFighter;
	}

	const createEventListeners = (eventType, selector, property, callbackFunction) => {
		//Generic function to create click listener on a node list
		let nodeList = document.querySelectorAll(selector);
				
		Array.from(nodeList).forEach(item => {
			item.addEventListener('click', (event) => {
				if (currentGame[property] === null) callbackFunction(event);
				// else console.log(selector, 'Ignored');
			});
		});
	}	

	const createElement = (type, className) => {
		//Generic function to create elements using vanilla JavaScript
		let element = document.createElement(type);
		element.className = className;
		return element;
	}

	const createCharacterPanel = (character, divToWrite, className, fighter) => {
		//Function to dynamically generate the characterPanel in the DOM
		const greyScale = fighter ? '' : ' greyScale';
		let column = createElement('div', 'fighter-card '+ className);
		column['data-fighterName'] = character.name;
		let panel = createElement('div', "panel panel-default");
		let panelHeading = createElement('div', 'panel-heading text-center');
		panelHeading.innerHTML = character.name;
		let panelBody = createElement('div', 'panel-body');
		let imageElement = createElement('img', "img-responsive"+ greyScale);
		imageElement.src = character.image;
		
		if (fighter) {
			//If the character is a fighter, show the health bar div
			let health = createElement('div', "progress");
			let progressBar = createElement('div', "progress-bar progress-bar-success");
			progressBar.style.width = "100%";
			progressBar.innerHTML = character.maxHealthPoints;
			health.appendChild(progressBar);
			panelBody.appendChild(health);
		} else {
			//Else generate a stat div
			let stats = createElement('div', 'stats');
			panelBody.appendChild(stats);

		}
		//Append all elements to the correct parent
		panelBody.appendChild(imageElement);
		panel.appendChild(panelHeading);
		panel.appendChild(panelBody);
		column.appendChild(panel);
		document.getElementById(divToWrite).appendChild(column);
	}


	const init = () => {
		let characterArray = initializeStartingArray();
		document.getElementById('fighters').innerHTML = '';
		document.getElementById('opponents').innerHTML = '';
		document.getElementById('actionMessage').innerHTML = 'Select Your Fighter';
		//Generate the selectable characters from the array
		characterArray.map((x,i) => createCharacterPanel(x, 'fighters', 'col-md-3', false));
		startGame(characterArray);
		
	}

	init();

});