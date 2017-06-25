import "./styles/main.scss";
import Services from "./scripts/services.js";

Services.log();
Services.es6BabelTest();

const FILE_INPUT = document.getElementById("file");
FILE_INPUT.addEventListener("change", (e) => {
	alert(e);
});
