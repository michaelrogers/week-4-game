document.addEventListener('DOMContentLoaded', () => {
	let characterArray, 
		defeatedCharactersArray, 
		selectedCharacter,
		selectedOpponent;

	function characterPrototype (name, healthPoints, attackPower, counterAttackPower) {
		this.name = name;
		this.healthPoints = healthPoints;
		this.attackPower = attackPower;
		this.counterAttackPower = counterAttackPower;
	}

	const initializeStartingArray = () => {
		let characterArray = [];
		let defeatedCharactersArray = [];
		let test = new characterPrototype("test", 100, 50, 60);
		characterArray.push(test);
		let test2 = new characterPrototype("test2", 100, 50, 60);
		characterArray.push(test2);
	}

	

	
	const init = () => {
		initializeStartingArray();
		console.log(characterArray);
		var result = characterArray.filter((object) => {
			return object.name == "test";
		});
		console.log(result);
	}

	init();

});