export default {
	log() {
		console.log("services.js log() method called");
	},
	es6BabelTest() {
		console.log("services.js es6BabelTest() method called");
		const ES6_ARROW_FN = () => console.log(ES6_ARROW_FN)
		console.log("babel converted ES6_ARROW_FN = () => console.log(ES6_ARROW_FN) to:");
		console.log(ES6_ARROW_FN);
	}
}
