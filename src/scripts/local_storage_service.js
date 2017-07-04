import {translationsService} from "./translations_service";

export const localStorageService = (function () {
    const getLocalStorage = () => {
        return localStorage;
    }
    const prefix = "JTE_";
    return function () {
        return {
            setLocalStorage: () => {
                let translations = translationsService().getTranslations();
                localStorage[`${prefix}TRANSLATIONS`] = JSON.stringify(translations);
                console.log("setLocalStorage:", localStorage);
            },
            setLocalStorageItem: (item, val) => {
                localStorage.setItem(item, val);
            },
            GetLocalStorage: () => {
                return getLocalStorage();
            },
            isLocalStorageSet: () => {
                return getLocalStorage()["JTE_TRANSLATIONS"];
            },
            clear: () => {                
                let items = [`${prefix}TRANSLATIONS`, `${prefix}FILENAME`];
                for (let item of items) {
                    localStorage.removeItem(item);
                }
                // console.log("localStorage after clear()", localStorage);
            }
        }
    }
})();
