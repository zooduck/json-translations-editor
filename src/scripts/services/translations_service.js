// DOM...
import {table_rows} from "./dom_service";
// Libraries...
import flat from "flat";
// Services...
import {localStorageService} from "./local_storage_service";
import {paginationService} from "./pagination_service";
import {fileService} from "./file_service";
import {alertService} from "./alert_service";

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

    const getDateTimeSuffix = () => {
        return new Date().toISOString().split(".")[0].replace(/T/, "_");
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

    // const resetTranslationKey = (key) => {
    //     if (key) {
    //         translations.export[key] = translations.import[key];
    //     }
    //     updateTranslations();
    // };

    const updateTranslations = (options = {type: ["export", "dev"]}) => {

        // console.log("translations before update .export", translations);
        // debugger

        // 1. update exports
        if (options.type.indexOf("export") !== -1) {
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
                            //translations.export[key] = translations.import[key];
                        }
                    }
                }
            }  
        }

        // console.log("translations before update .dev", translations);
        // debugger

        // 2. update dev
        if (options.type.indexOf("dev") !== -1) {
            for (let key in translations.export) {
                if (translations.import[key] != translations.export[key]) {
                    translations.dev[key] = translations.export[key]
                } else {
                    // console.log("deleting", key, "from translations.dev");
                    delete translations.dev[key];
                }
            }
        }

        localStorageService().setLocalStorage();

    };

    return function () {
        return {
            SyncCommonKeyValues: (key, val) => {
                return syncCommonKeyValues(key, val);
            },
            UpdateTranslations: () => {
                return updateTranslations();
            },
            setTranslations: (data, flattenData = false) => {

                if (!data && localStorageService().GetLocalStorage().JTE_TRANSLATIONS) {
                    data = localStorageService().GetLocalStorage().JTE_TRANSLATIONS;
                }

                if (data) {

                    init(); // reset translations object                   

                    if (flattenData) {
                        data = JSON.stringify(flat.flatten(JSON.parse(data)), null, 4);
                    }
                                    

                    let obj = JSON.parse(data);

                    // console.log("obj", obj);
                    // debugger

                    if (obj.export && obj.import && obj.dev) {                       
                        Object.assign(translations.export, obj.export);
                        Object.assign(translations.import, obj.import);
                        Object.assign(translations.dev, obj.dev);
                    } else {  
                        Object.assign(translations.export, obj);
                        Object.assign(translations.import, obj);
                    }
                }

                console.log("translations after setTranslations are: ", translations);
                //debugger
                
                // debugger

                //updateTranslations({type: ["dev"]});

                // console.log("translations after first update", translations);

                //localStorageService().setLocalStorage();
                localStorageService().setLocalStorage();
             
            },
            resetTranslationKey: (key) => {
                if (key) {
                    //alert("export:"+translations.export[key]+" import:"+translations.import[key]);
                    translations.export[key] = translations.import[key];
                    updateTranslations({type:["dev"]});
                    //console.log("translations after resetTranslationKey", translations);
                    return translations.import[key];
                }
            },
            getTranslations: () => {
                return translations;
            },
            setCommonKey: (key, val) => {
                commonKeys[key] = val;
            },
            saveDev: (link) => {
                console.log("saveDev() translations:", translations);

                if (Object.keys(translations.dev).length < 1) { 
                    event.preventDefault();                   
                    return alertService().raise("ERROR.NO_TRANSLATIONS_TO_SAVE");
                }

                if (link) {
                    let fileName = fileService().getFileName().split(".")[0];
                    let fileExt = fileService().getFileName().split(".")[1];
                    let jsonData = JSON.stringify(flat.unflatten(translations.dev), null, 4);
                    let textData = new Blob([jsonData], {type: "text/plain"});
                    let file = window.URL.createObjectURL(textData);
                    link.download = `${fileName}_EDIT_${getDateTimeSuffix()}.${fileExt}`;
                    link.href = file;

                    console.log("saveDev output: ", jsonData);
                }
            },
            saveExport: (link) => {
                if (link) {
                    let fileName = fileService().getFileName().split(".")[0];
                    let fileExt = fileService().getFileName().split(".")[1];                   
                    // let jsonData = JSON.stringify(translations.export, null, 4);
                    // jsonData += JSON.stringify(translations.import, null, 4);

                    let jsonData = JSON.stringify(translations, null, 4);




                    let textData = new Blob([jsonData], {type: "text/plain"});
                    let file = window.URL.createObjectURL(textData);
                    link.download = `${fileName}_WORK_IN_PROGRESS_${getDateTimeSuffix()}.${fileExt}`;
                    link.href = file;

                    console.log("saveExport output: ", jsonData);
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
