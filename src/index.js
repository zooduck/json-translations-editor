import "./styles/main.scss";
import Services from "./scripts/services.js";

Services.log();
Services.es6BabelTest();

const file_input = document.getElementById("file");
file_input.addEventListener("change", Services.FileHandler);

const thumbnail_file = document.getElementById("thumbnailFile");
thumbnail_file.addEventListener("click", Services.ThumbnailFileExpand);

const download = document.getElementById("download");
download.onclick = function () {
	Services.saveTranslationsToJSON();
}


window.addEventListener("resize", function () {
	Services.TranslationsTableService().resize();
});

// window.addEventListener("resize", function(){alert("ewifjworhjf")});
//console.log(Services.translationsTableService().init());


// const translations_console = document.getElementById("translationsConsole");
// translations_console.addEventListener("click", Services.toggleConsoleView);

// thumbnail_file.querySelector(".expand-ctrl").addEventListener("click", Services.thumbnailFileExpand);

