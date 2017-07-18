// DOM...
import {table_rows} from "./dom_service";
// Libraries...
import flat from "flat";
// Services...
import {localStorageService} from "./local_storage_service";
import {paginationService} from "./pagination_service";
import {fileService} from "./file_service";
import {alertService} from "./alert_service";
import {translationsTableService} from "./translations_table_service";
import {confirmService} from "./confirm_service";

export const translationsService = (function(){

    let importedFiles = [];
    let commonKeys = {}
    let translations = {
        export: {},
        import: {},
        dev: {},
        page: 1
    };

    const init = () => {
        translations.export = {}
        translations.import = {}
        translations.dev = {}
        translations.page = 1
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

    const updateTranslations = (options = {type: ["export", "dev"]}) => {

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
                            translations.export[key] = translations.import[key];
                        }
                    }
                }
            }
        }

        // 2. update dev
        if (options.type.indexOf("dev") !== -1) {
            for (let key in translations.export) {
                if (translations.import[key] != translations.export[key]) {
                    translations.dev[key] = translations.export[key]
                } else {
                    delete translations.dev[key];
                }
            }
        }

        // 3. update page
        if (options.type.indexOf("page") !== -1) {
            translations.page = paginationService().GetLastViewedPage();
        }

        localStorageService().setLocalStorage();

    };

    return function () {
        return {
            SyncCommonKeyValues: (key, val) => {
                return syncCommonKeyValues(key, val);
            },
            UpdateTranslations: (options) => {
                return updateTranslations(options);
            },
            setTranslations: (data, flattenData = false) => {

                if (!data && localStorageService().GetLocalStorage().JTE_TRANSLATIONS) {
                    data = localStorageService().GetLocalStorage().JTE_TRANSLATIONS;
                }

                if (data) {

                    init(); // reset translations object

                    let dataObj = JSON.parse(data);

                    // ----------------------------------------------------------------------------------------------------------------
                    // NOTE: This is here only to allow deep objects like package.json to be imported (and not crash the application)
                    // ----------------------------------------------------------------------------------------------------------------
                    if (flattenData && !dataObj.export && !dataObj.import && !dataObj.dev) {
                        dataObj = JSON.parse(JSON.stringify(flat.flatten(JSON.parse(data)), null, 4));
                    }


                    if (dataObj.export) {
                         Object.assign(translations, dataObj);
                     } else {
                        Object.assign(translations["export"], dataObj);
                        Object.assign(translations["import"], dataObj);
                     }
                }
            },
            resetTranslationKey: (key) => {
                if (key) {
                    translations.export[key] = translations.import[key];
                    updateTranslations({type:["dev"]});
                    return translations.import[key];
                }
            },
            resetTranslations: () => {

                if (Object.keys(translations.import).length < 1) {
                    return;
                }


                let promise = new Promise(function (resolve, reject) {
                    confirmService().raise("Are you sure you want to revert all translations back to their original values?", resolve, reject);
                });

                promise.then(function (result) {
                    // reset translations...
                    translations.export = translations.import;
                    translations.dev = {}
                    // reset DOM...
                    let rows = translationsTableService().GetRows();
                    for (let row of rows) {
                        let enTD = row.children[1];
                        let textarea = row.children[2].querySelector("textarea");
                        enTD.querySelector("span").classList.remove("line-through");
                        textarea.value = "";
                    }
                    // update localStorage...
                    localStorageService().setLocalStorage();
                }, function (err) {
                    // ...
                });
            },
            getTranslations: () => {
                return translations;
            },
            setCommonKey: (key, val) => {
                commonKeys[key] = val;
            },
            saveDev: (link) => {
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
