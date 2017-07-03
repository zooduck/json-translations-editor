import Services from "./services";

Services.init();

const save_progress_ctrl = document.getElementById("saveProgressCtrl");
const export_translations_ctrl = document.getElementById("exportTranslationsCtrl");
const file_input = document.getElementById("file");
const searchTable = document.getElementById("searchTable");
const alert_confirm_ctrl = document.getElementById("alertBox").querySelector(".alert-confirm-ctrl");
const pagination_ctrls = document.getElementById("paginationCtrls");

save_progress_ctrl.addEventListener("mouseenter", function (e) {
	Services.TranslationsService().setTranslations();
	Services.LocalStorageService().setLocalStorage();
	console.log("localStorage:", Services.LocalStorageService().getLocalStorage());
});

export_translations_ctrl.addEventListener("mouseenter", function (e) {
	Services.TranslationsService().setTranslations();
	Services.LocalStorageService().setLocalStorage();
	console.log("localStorage:", Services.LocalStorageService().getLocalStorage());
});                        

file_input.addEventListener("change", Services.FileHandler);

export_translations_ctrl.addEventListener("click", function () {
	Services.TranslationsService().saveJSON(this);
});

searchTable.addEventListener("keyup", function () {
	Services.TranslationsTableService().filter(this.value);
});

alert_confirm_ctrl.addEventListener("click", function () {
	Services.AlertService().dismiss();
});

pagination_ctrls.querySelectorAll("i")[0].addEventListener("click", function () {
	Services.PaginationService().loadPreviousPage();
});

pagination_ctrls.querySelectorAll("i")[1].addEventListener("click", function () {
	Services.PaginationService().loadNextPage();
});

window.addEventListener("resize", function () {
	Services.TranslationsTableService().resize();
});
