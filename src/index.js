import "./styles/main.scss";
import Services from "./scripts/services.js";

Services.log();
Services.es6BabelTest();

const file_input = document.getElementById("file");
file_input.addEventListener("change", Services.FileHandler);

// const thumbnail_file = document.getElementById("thumbnailFile");
// thumbnail_file.addEventListener("click", Services.ThumbnailFileExpand);

const exportTranslations = document.getElementById("exportTranslations");
exportTranslations.addEventListener("click", function () {
	Services.TranslationsService().saveJSON(this);
});


const searchTable = document.getElementById("searchTable");
searchTable.addEventListener("keyup", function () {
	Services.TranslationsTableService().filter(this.value);
});

const alert_confirm_ctrl = document.getElementById("alertBox").querySelector(".alert-confirm-ctrl");
alert_confirm_ctrl.addEventListener("click", function () {
	Services.AlertService().dismiss();
});

const paginatonCtrls = document.getElementById("paginationCtrls");
paginationCtrls.querySelectorAll("i")[0].addEventListener("click", function () {
	Services.PaginationService().loadPreviousPage();
});
paginationCtrls.querySelectorAll("i")[1].addEventListener("click", function () {
	Services.PaginationService().loadNextPage();
});


window.addEventListener("resize", function () {
	Services.TranslationsTableService().resize();
});

// window.addEventListener("resize", function(){alert("ewifjworhjf")});
//console.log(Services.translationsTableService().init());


// const translations_console = document.getElementById("translationsConsole");
// translations_console.addEventListener("click", Services.toggleConsoleView);

// thumbnail_file.querySelector(".expand-ctrl").addEventListener("click", Services.thumbnailFileExpand);

