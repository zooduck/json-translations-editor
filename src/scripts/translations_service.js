// DOM...
import {table_rows} from "./dom_service";
// Services...
import {localStorageService} from "./local_storage_service";
import {paginationService} from "./pagination_service";

export const translationsService = (function(){

    let importedFiles = [];
    let commonKeys = {}

    let translations = {
        export: {},
        import: {},
        dev: {}
    };

    const init = () => {

        translations = {
            export: {},
            import: {},
            dev: {}
        }
    };

    const getFiles = () => {
        return importedFiles;
    };

    const getCommonKey = (key) => {
        return commonKeys[key];
    };

    const syncCommonKeyValues = (key, val) => {
        // ==========================
        // this method is purely UX
        // ==========================
        let commonKeyPattern = /^COMMON\./;
        let pattern = new RegExp(`${key}</span>`);
        if (key.match(commonKeyPattern)) {
            // update all hints relating to this key
            for (let row of Array.from(table_rows.children)) {
                let en = row.querySelectorAll(".td")[1];
                if (en.hasAttribute("common-key")) {
                    if (en.innerHTML.match(pattern)) {
                        let hint = en.querySelector(".common-value");
                        if (val && hint) {
                            hint.innerHTML = val;
                        } else if (hint){
                            hint.innerHTML = getCommonKey(key);
                        }
                    }
                }
            }
        }
    };

    const updateTranslations = () => {

        // 1. update exports
        let collections = paginationService().GetPages().collections;
        if (collections) {
            for (let collection of Array.from(collections)) {
                for (let row of collection) {
                    let textarea = row.querySelector("textarea");
                    let key = textarea.getAttribute("key");
                    let val = textarea.value;
                    let commonKeyAsValuePrefix = "@:";
                    
                    if (val !== "") {
                        if (val.match(/^COMMON\./)) {
                            val = `${commonKeyAsValuePrefix}${val}`;
                        }
                        translations.export[key] = val;
                    } else {
                        translations.export[key] = translations.import[key];
                    }
                }
            }
        }             

        // 2. update dev
        for (let key in translations.export) {
            if (translations.import[key] != translations.export[key]) {
                translations.dev[key] = translations.export[key]
            } else {
                delete translations.dev[key];
            }
        }
    };

    return function () {
        return {
            SyncCommonKeyValues: (key, val) => {
                return syncCommonKeyValues(key, val);
            },
            UpdateTranslations: () => {
                return updateTranslations();
            },
            setTranslations: (data) => {

                if (!data && localStorageService().GetLocalStorage().JTE_TRANSLATIONS) {
                    data = localStorageService().GetLocalStorage().JTE_TRANSLATIONS;
                }

                if (data) {

                    init(); // reset translations object

                    let obj = JSON.parse(data);
                    if (obj.export && obj.import) {                       
                        Object.assign(translations.export, obj.export);
                        Object.assign(translations.import, obj.import);
                    } else {  
                        Object.assign(translations.export, obj);
                        Object.assign(translations.import, obj);
                    }
                }

                console.log(translations);
                
                debugger

                // updateTranslations();

                //localStorageService().setLocalStorage();
             
            },
            getTranslations: () => {
                return translations;
            },
            // setTextData: (data) => {
            //     textData = data;
            // },
            // getTextData: () => {
            //     return textData;
            // },
            setCommonKey: (key, val) => {
                commonKeys[key] = val;
            },
            saveJSON: (link) => {
                if (link) {
                    let fileName = fileService().getFileName().split(".")[0];
                    let fileExt = fileService().getFileName().split(".")[1];
                    let jsonData = JSON.stringify(flat.unflatten(translations), null, 4);
                    let textData = new Blob([jsonData], {type: "text/plain"});
                    let file = window.URL.createObjectURL(textData);
                    link.download = `${fileName}_EDIT.${fileExt}`;
                    link.href = file;

                    console.log("saveJSON output: ", jsonData);
                }
            },
            saveProgress: (link) => {
                if (link) {
                    let fileName = fileService().getFileName().split(".")[0];
                    let fileExt = fileService().getFileName().split(".")[1];
                    let jsonData = JSON.stringify(exportedTranslations, null, 4);
                    let textData = new Blob([jsonData], {type: "text/plain"});
                    let file = window.URL.createObjectURL(textData);
                    link.download = `${fileName}_WORK_IN_PROGRESS.${fileExt}`;
                    link.href = file;

                    console.log("saveProgress output: ", jsonData);
                }
            },
            pushFile: (file) => {
                importedFiles.push({
                    name: file.name.split(".")[0],
                    ext: file.name.split(".")[1]
                });
            }
        }
    }
})();
