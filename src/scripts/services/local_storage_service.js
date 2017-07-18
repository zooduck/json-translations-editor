// DOM...
import {file_name} from "./dom_service";
// Services...
import {paginationService} from "./pagination_service";
import {translationsService} from "./translations_service";
import {translationsTableService} from "./translations_table_service";
import {loadingService} from "./loading_service";
import {malenkyFileService} from "./malenky_file_service";
import {confirmService} from "./confirm_service";

export const localStorageService = (function () {
    const getLocalStorage = () => {
        return localStorage;
    };
    const isLocalStorageSet = () => {
    	return getLocalStorage()["JTE_TRANSLATIONS"];
    };
    const prefix = "JTE_";
    return function () {
        return {
            setLocalStorage: () => {
                let translations = translationsService().getTranslations();
                localStorage[`${prefix}TRANSLATIONS`] = JSON.stringify(translations);
                
                console.log("translations", translations);
                console.log("setLocalStorage:", localStorage);

            },
            setLocalStorageItem: (item, val) => {
                localStorage.setItem(item, val);
            },
            GetLocalStorage: () => {
                return getLocalStorage();
            },
            // IsLocalStorageSet: () => {
            // 	return isLocalStorageSet();
            //     //return getLocalStorage()["JTE_TRANSLATIONS"];
            // },
            clear: () => {                
                let items = [`${prefix}TRANSLATIONS`, `${prefix}FILENAME`, `${prefix}PAGE`];
                for (let item of items) {
                    localStorage.removeItem(item);
                }
                // console.log("localStorage after clear()", localStorage);
            },
            init: () => {

		        if (isLocalStorageSet()) {		        	    

		            let promise = new Promise(function (resolve, reject) {
		                confirmService().raise("Do you want to load data from your last session?", resolve, reject);
		            });

		            promise.then(function (result) {

		                loadingService().setLoading();

		                // let translations = JSON.parse(localStorageService().GetLocalStorage().JTE_TRANSLATIONS);
		                // let data = translations.export;
		                // let fileName = localStorageService().GetLocalStorage().JTE_FILENAME;

		                let translations = JSON.parse(getLocalStorage().JTE_TRANSLATIONS);
		                let data = translations;
		                let fileName = getLocalStorage().JTE_FILENAME;
                        let page = getLocalStorage().JTE_PAGE;


		                file_name.innerHTML = `${fileName} [from cache]`;

		                malenkyFileService().build(data, fileName);

                        paginationService().SetLastViewedPage(page);

		                translationsService().setTranslations();
		                translationsTableService().init(data);              

		                let interval = setInterval(function(){
		                    if (loadingService().isLoading()) {
		                        translationsTableService().build(data, page);
		                        clearInterval(interval);
		                    }
		                }, 10);

		            }, function (err) {
		                Error(err);
		            });
		   		}
	        }
        }
    }
})();
