// DOM...
import {export_translations_ctrl, dev_translations_ctrl, file_input, search_table, pagination_ctrls} from "./dom_service";
// Services...
import Services from "./services";

Services.init();

// Event Listeners...
export_translations_ctrl.addEventListener("click", function () {
	Services.TranslationsService().setTranslations();
	Services.LocalStorageService().setLocalStorage();
	Services.TranslationsService().saveJSON(this);
});

dev_translations_ctrl.addEventListener("click", function () {
	Services.TranslationsService().setTranslations();
	Services.LocalStorageService().setLocalStorage();
	Services.TranslationsService().saveProgress(this);
});

file_input.addEventListener("change", Services.FileHandlerService);

search_table.addEventListener("keyup", function () {
	Services.TranslationsTableService().filter(this.value);
});

pagination_ctrls.querySelectorAll("i")[0].addEventListener("click", function () {
	Services.PaginationService().loadPreviousPage();
});

pagination_ctrls.querySelectorAll("i")[1].addEventListener("click", function () {
	Services.PaginationService().loadNextPage();
});
