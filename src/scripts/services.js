// DOM...
import {file_name} from "./dom_service";
// Services...
import {localStorageService} from "./local_storage_service";
import {translationsService} from "./translations_service";
import {translationsTableService} from "./translations_table_service";
import {malenkyFileService} from "./malenky_file_service";
import {loadingService} from "./loading_service";
import {confirmService} from "./confirm_service";
import {fileHandlerService} from "./file_handler_service";

export default {
    FileHandlerService(e) {       
        return fileHandlerService(e);
    },
    TranslationsTableService() {
        return translationsTableService();
    },
    TranslationsService() {
        return translationsService();
    },
    LocalStorageService() {
        return localStorageService();
    },
    AlertService() {
        return alertService();
    },
    PaginationService() {
        return paginationService();
    },
    init() {

        if (localStorageService().isLocalStorageSet()) {           

            let promise = new Promise(function (resolve, reject) {
                confirmService().raise("Do you want to load data from your last session?", resolve, reject);
            });

            promise.then(function (result) {

                loadingService().setLoading();

                let translations = JSON.parse(localStorageService().GetLocalStorage().JTE_TRANSLATIONS);
                let data = translations.export;
                let fileName = localStorageService().GetLocalStorage().JTE_FILENAME;

                file_name.innerHTML = `${fileName} [from cache]`;

                malenkyFileService().build(data, fileName);

                translationsService().setTranslations();
                translationsTableService().init(data);                

                let interval = setInterval(function(){
                    if (loadingService().isLoading()) {
                        translationsTableService().build(data);
                        clearInterval(interval);
                    }
                }, 10);

            }, function (err) {
                Error(err);
            });
        }
    }
}
