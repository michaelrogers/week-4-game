document.addEventListener('DOMContentLoaded', () => {
	// let characterArray;
	let currentGame;

	function characterPrototype (name, healthPoints, attackPower, counterAttackPower) {
		this.name = name;
		this.healthPoints = healthPoints;
		this.attackPower = attackPower;
		this.counterAttackPower = counterAttackPower;
		this.defeated = false;
		
	}

	function gamePrototype (characterArray) {
		this.characters = characterArray;
		this.selectedCharacter = null;
		this.selectedOpponent = null;
		this.victories = 0;
	}


	const initializeStartingArray = () => {
		characterArray = [
			new characterPrototype("Fighter1", 100, 50, 60, false),
			new characterPrototype("Fighter2", 100, 50, 60, false),
			new characterPrototype("Fighter3", 100, 50, 60, false)
		];
		return characterArray;

	}

	const startGame = (characterArray) => {
		currentGame = new gamePrototype(characterArray);
		console.log(currentGame);
		selectFighter()
	}



	const selectFighter = () => {


	}

	const selectedOpponent = () => {

	}



	
	const init = () => {
		let characterArray = initializeStartingArray();
		console.log(characterArray);
		var result = characterArray.filter((object) => {
			return object.name === "test";
		});
		
		startGame(characterArray);
	}

	init();

});