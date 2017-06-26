import "./styles/main.scss";
import Services from "./scripts/services.js";

Services.log();
Services.es6BabelTest();

const file_input = document.getElementById("file");
file_input.addEventListener("change", Services.fileHandler);

const thumbnail_file = document.getElementById("thumbnailFile");
thumbnail_file.addEventListener("click", Services.thumbnailFileExpand);

const download = document.getElementById("download");
download.onclick = function () {
	Services.saveTranslationsToJSON();
}

// const translations_console = document.getElementById("translationsConsole");
// translations_console.addEventListener("click", Services.toggleConsoleView);

// thumbnail_file.querySelector(".expand-ctrl").addEventListener("click", Services.thumbnailFileExpand);

