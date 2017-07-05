// DOM...
import {export_translations_ctrl, dev_translations_ctrl, file_input, search_table, pagination_ctrls} from "./services/dom_service";
// Services...
import {localStorageService} from "./services/local_storage_service";
import {translationsService} from "./services/translations_service";
import {translationsTableService} from "./services/translations_table_service";
import {paginationService} from "./services/pagination_service";
import {fileHandlerService} from "./services/file_handler_service";

localStorageService().init();

// Event Listeners...

dev_translations_ctrl.addEventListener("click", function () {
	translationsService().setTranslations();
	//localStorageService().setLocalStorage();
	translationsService().saveDev(this);
});

export_translations_ctrl.addEventListener("click", function () {
	translationsService().setTranslations();
	//localStorageService().setLocalStorage();
	translationsService().saveExport(this);
});

file_input.addEventListener("change", fileHandlerService);

search_table.addEventListener("keyup", function () {
	translationsTableService().filter(this.value);
});

pagination_ctrls.querySelectorAll("i")[0].addEventListener("click", function () {
	paginationService().loadPreviousPage();
});

pagination_ctrls.querySelectorAll("i")[1].addEventListener("click", function () {
	paginationService().loadNextPage();
});
