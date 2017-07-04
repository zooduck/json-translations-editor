// dom elements...
import {file_name} from "./dom_service";
// services...
import {localStorageService} from "./local_storage_service";
import {translationsService} from "./translations_service";
import {translationsTableService} from "./translations_table_service";
import {malenkyFileService} from "./malenky_file_service";
import {loadingService} from "./loading_service";
import {confirmService} from "./confirm_service";
import {fileHandlerService} from "./file_handler_service";



//console.log(translations_table);


// const thumbnail_file = document.getElementById("thumbnailFile");
// const progress = document.getElementById("progress");
// const alert_bar = document.getElementById("alertBar");

// const translations_table = document.getElementById("translationsTable");
// const table_rows = translations_table.querySelector(".table-rows");
// const translations_table_row_TEMPLATE = document.getElementById("translationsTableRow_TEMPLATE");
// const translations_console = document.getElementById("translationsConsole");
// const paper_content = document.getElementById("paperContent");
// const paper_title = document.getElementById("paperTitle");
// const file_name = document.getElementById("fileName");
// const import_prompt = document.getElementById("importPrompt");
// const loading_screen = document.getElementById("loadingScreen");
// const pagination_ctrls = document.getElementById("paginationCtrls");



// const alert_screen = document.getElementById("alertScreen");
// const alert_box = document.getElementById("alertBox");
// const alert_confirm_ctrl_cancel = document.getElementById("alertConfirmCtrlCancel");
// const alert_confirm_ctrl_ok = document.getElementById("alertConfirmCtrlOK");




// function buildMalenkyFile (fileName, txt, delay = 0) {

//     paper_title.innerHTML = "";
//     paper_content.innerHTML = "";

//     paper_content.parentNode.parentNode.classList.remove("file-add");

//     setTimeout( () => {
//         paper_content.parentNode.parentNode.classList.add("file-add");
//     }, 10);

//     setTimeout( () => {
//          paper_title.innerHTML = fileName;
//          paper_content.innerHTML = txt;;
//     }, delay);
// }

// function textShuffle(txt) {
//     let chars = txt.substr(0, 1000).split("");
//     let newChars = [];
//     for (let i = 0, l = chars.length; i < l; i++) {
//         let rand = Math.floor(Math.random() * l);
//         newChars.push(chars[rand]);
//     }
//     return newChars.join(" ");
// }

// function applyShuffledText (txt, el, delay, totalDelay) {
//     setTimeout(function(){
//         el.innerHTML = txt;
//         setProgress(`${(delay / totalDelay) * 100}%`);
//     }, delay);
// }

// function setProgress (percent = "0%") {
//     progress.querySelector(".progress-bar").style.width = percent;
//     let pretext = parseInt(percent) < 50? "Reading file..." : "Converting...";
//     if (parseInt(percent) >= 100) {
//         progress.querySelector(".before").innerHTML = "Done!";
//     } else {
//         progress.querySelector(".before").innerHTML = `${pretext} ${Math.floor(parseInt(percent))}%`;
//     }
// }

// const translationsService = (function(){
//     let importedTranslations = {} // stores data imported from a file
//     let exportedTranslations = {export:{}, import:{}} // stores a copy of the imported translations along with changes (for restoring the previous session from localStorage)
//     let translations = {}
//     let translationsCompared = {}
//     let jsonTranslations = "{}";
//     let commonKeys = {}
//     let textData = "";
//     let importedFiles = [];





//     // ALL TRANSLATIONS DATA SHOULD NOW BE STORED IN THIS ONE OBJECT

//     let translationsNEW = {
//         export: {},
//         import: {},
//         dev: {}
//     }











//     let getFiles = () => {
//         return importedFiles;
//     };
//     let getCommonKey = (key) => {
//         return commonKeys[key];
//     };
//     let syncCommonKeyValues = (key, val) => {
//         // ==========================
//         // this method is purely UX
//         // ==========================
//         let commonKeyPattern = /^COMMON\./;
//         let pattern = new RegExp(`${key}</span>`);
//         if (key.match(commonKeyPattern)) {
//             // update all hints relating to this key
//             for (let row of Array.from(table_rows.children)) {
//                 let en = row.querySelectorAll(".td")[1];
//                 if (en.hasAttribute("common-key")) {
//                     if (en.innerHTML.match(pattern)) {
//                         let hint = en.querySelector(".common-value");
//                         if (val && hint) {
//                             hint.innerHTML = val;
//                         } else if (hint){
//                             hint.innerHTML = getCommonKey(key);
//                         }
//                     }
//                 }
//             }
//         }
//     };
//     // const setTranslationsAsJSON = (data = null) => {
//     //     if (data) { // init
//     //         return jsonTranslations = data;
//     //     }
//     //     // update
//     //     let obj = JSON.parse(jsonTranslations);
//     //     for (let key in translations) {
//     //         obj[key] = translations[key];
//     //     }
//     //     return Object.keys(translations).length > 0 ? jsonTranslations = JSON.stringify(obj, null, 4) : jsonTranslations = JSON.stringify(importedTranslations, null, 4);
//     // }
//     const updateExportedTranslations = () => {
//         console.log("importedTranslations", importedTranslations);
//         console.log("exportedTranslations", exportedTranslations);
//         for (let key in translations) {
//             //importedTranslations[key] = translations[key];
//             exportedTranslations.export[key] = translations[key];
//         }
//         for (let key in importedTranslations) {
//             exportedTranslations.import[key] = importedTranslations[key];
//         }
//         console.log("importedTranslations", importedTranslations);
//         console.log("exportedTranslations", exportedTranslations);
//     };

//     const updateTranslations = () => {

//         // 1. update exports
//         let collections = paginationService().GetPages().collections;
//         if (collections) {
//             for (let collection of Array.from(collections)) {
//                 for (let row of collection) {
//                     let textarea = row.querySelector("textarea");
//                     let key = textarea.getAttribute("key");
//                     let val = textarea.value;
//                     let commonKeyAsValuePrefix = "@:";
                    
//                     if (val !== "") {
//                         if (val.match(/^COMMON\./)) {
//                             val = `${commonKeyAsValuePrefix}${val}`;
//                         }
//                         translationsNEW.export[key] = val;
//                     } else {
//                         translationsNEW.export[key] = translationsNEW.import[key];
//                     }
//                 }
//             }
//         }             

//         // 2. update dev
//         for (let key in translationsNEW.export) {
//             if (translationsNEW.import[key] != translationsNEW.export[key]) {
//                 translationsNEW.dev[key] = translationsNEW.export[key]
//             } else {
//                 delete translationsNEW.dev[key];
//             }
//         }

//         console.log("translationsNEW after dev update", translationsNEW);

//     };
//     return function () {
//         return {
//             setImportedTranslations: (data) => {
//                 // this gets called only when a file is uploaded
//                 let obj = JSON.parse(data);
//                 importedTranslations = obj;
//                 console.log("importedTranslations after setImportedTranslations =>", importedTranslations);
//                 // setTranslationsAsJSON(data);
//             },
//             setExportedTranslations: (data) => {
//                 let obj = JSON.parse(data);
//                 exportedTranslations = obj;
//                 //exportedTranslations.import = importedTranslations;
//                 console.log("exportedTranslations after setImportedTranslations =>", exportedTranslations);
//                 console.log("translations after setImportedTranslations =>", translations);
//             },
//             getImportedTranslations: () => {
//                 return importedTranslations;
//             },
//             getExportedTranslations: () => {
//                 return exportedTranslations;
//             },
//             // SetTranslationsAsJSON: (data) => {
//             //     return setTranslationsAsJSON(data);
//             // },
//             SyncCommonKeyValues: (key, val) => {
//                 return syncCommonKeyValues(key, val);
//             },
//             // setTranslations: (e) => {
//             //     //console.log(paginationService().GetPages().collections);
//             //     let key = e.target.getAttribute("key");
//             //     let val = e.target.value;

//             //     //syncCommonKeyValues(key, val);

//             //     // ensure COMMON key translation values are prefixed with "@:"
//             //     // (this allows easy copy paste from key in table)
//             //     if (val.match(/^COMMON\./)) {
//             //         val = `@:${val}`;
//             //     }

//             //     if (val !== "") {
//             //         translations[key] = val;
//             //     } else {
//             //         delete translations[key];
//             //     }
//             //     updateExportedTranslations();
//             //     setTranslationsAsJSON();
//             //     return translations;
//             // },
//             UpdateTranslations: () => {

//                 return updateTranslations();
//                 // // =============================================================================
//                 // // this method should update export and dev properties of translations object
//                 // // =============================================================================               

//                 // // 1. update exports
//                 // let collections = paginationService().GetPages().collections;
//                 // if (collections) {
//                 //     for (let collection of Array.from(collections)) {
//                 //         for (let row of collection) {
//                 //             let textarea = row.querySelector("textarea");
//                 //             let key = textarea.getAttribute("key");
//                 //             let val = textarea.value;
//                 //             let commonKeyAsValuePrefix = "@:";
                            
//                 //             if (val !== "") {
//                 //                 if (val.match(/^COMMON\./)) {
//                 //                     val = `${commonKeyAsValuePrefix}${val}`;
//                 //                 }
//                 //                 translationsNEW.export[key] = val;
//                 //             } else {
//                 //                 translationsNEW.export[key] = translationsNEW.import[key];
//                 //             }
//                 //         }
//                 //     }
//                 // }             

//                 // // 2. update dev
//                 // for (let key in translationsNEW.export) {
//                 //     if (translationsNEW.import[key] != translationsNEW.export[key]) {
//                 //         translationsNEW.dev[key] = translationsNEW.export[key]
//                 //     } else {
//                 //         delete translationsNEW.dev[key];
//                 //     }
//                 // }

//                 // console.log("translationsNEW after dev update", translationsNEW);

//             },
//             setTranslations: (data) => {

//                 if (!data && localStorageService().GetLocalStorage().translations) {
//                     data = localStorageService().GetLocalStorage().translations;
//                 }

//                 if (data) {
//                     let obj = JSON.parse(data);
//                     if (obj.export && obj.import) {                       
//                         Object.assign(translationsNEW.export, obj.export);
//                         Object.assign(translationsNEW.import, obj.import);
//                     } else {  
//                         Object.assign(translationsNEW.export, obj);
//                         Object.assign(translationsNEW.import, obj);
//                     }
//                 }

//                 updateTranslations();

//                 localStorageService().setLocalStorageNEW();

//                 console.log("translationsNEW", translationsNEW);






//                 // //alert(exportedTranslations.export);

//                 // // first check for changes in export data
//                 // for (let key in exportedTranslations.export) {
//                 //     // alert("checking "+exportedTranslations.import[key]+ " against " + exportedTranslations.export[key]);
//                 //     if (exportedTranslations.import[key] != exportedTranslations.export[key]) {
//                 //         // alert("detected a change in => "+key);
//                 //         translations[key] = exportedTranslations.export[key];
//                 //     }
//                 // }

//                 // // next check for changes in UI
//                 // let collections = paginationService().GetPages().collections;
//                 // if (collections) {
//                 //     for (let collection of Array.from(collections)) {
//                 //         for (let row of collection) {
//                 //             let translationsTextarea = row.querySelector("textarea");
//                 //             let key = translationsTextarea.getAttribute("key");
//                 //             let val = translationsTextarea.value;

//                 //             // ensure COMMON key translation values are prefixed with "@:"
//                 //             // (this allows easy copy paste from key in table)
//                 //             if (val.match(/^COMMON\./)) {
//                 //                 val = `@:${val}`;
//                 //             }
//                 //             if (val !== "") {
//                 //                 translations[key] = val;
//                 //             } else {
//                 //                 delete translations[key];
//                 //             }
//                 //         }
//                 //     }
//                 // }

//                 // console.log("translations after setTranslations =>", translations);


//                 // updateExportedTranslations();

//                 // // setTranslationsAsJSON();
                

//                 // console.log("translations after setTranslations =>", translations);

//                 // return translations;
//             },
//             getTranslations: () => {
//                 // return translations;
//                 return translationsNEW;
//             },
//             // getJSONTranslations: () => {
//             //     console.log("jsonTranslations", jsonTranslations);
//             //     return jsonTranslations;
//             // },
//             setTextData: (data) => {
//                 textData = data;
//             },
//             getTextData: () => {
//                 return textData;
//             },
//             setCommonKey: (key, val) => {
//                 commonKeys[key] = val;
//             },
//             saveJSON: (link) => {
//                 if (link) {
//                     let fileName = fileService().getFileName().split(".")[0];
//                     let fileExt = fileService().getFileName().split(".")[1];
//                     // console.log("translations about to be downloaded: ", translations);
//                     let jsonData = JSON.stringify(flat.unflatten(translations), null, 4);
//                     let textData = new Blob([jsonData], {type: "text/plain"});
//                     let file = window.URL.createObjectURL(textData);
//                     link.download = `${fileName}_EDIT.${fileExt}`;
//                     link.href = file;

//                     console.log("output: ", jsonData);
//                 }
//             },
//             saveProgress: (link) => {
//                 if (link) {
//                     let fileName = fileService().getFileName().split(".")[0];
//                     let fileExt = fileService().getFileName().split(".")[1];
//                     let jsonData = JSON.stringify(exportedTranslations, null, 4);
//                     let textData = new Blob([jsonData], {type: "text/plain"});
//                     let file = window.URL.createObjectURL(textData);
//                     link.download = `${fileName}_WORK_IN_PROGRESS.${fileExt}`;
//                     link.href = file;

//                     console.log("output: ", jsonData);
//                 }
//             },
//             pushFile: (file) => {
//                 console.log(file);
//                 importedFiles.push({
//                     name: file.name.split(".")[0],
//                     ext: file.name.split(".")[1]
//                 });
//             },
//             init: (e) => {
//                 translations = {}

//                 translationsNEW = {
//                     export: {},
//                     import: {},
//                     dev: {}
//                 }
//             }
//         }
//     }
// })();

// const paginationService = (function() {
//     let pagination = {}
//     let currentPage = 1;
//     let itemsPerPage = 10;
//     const updateCurrentPage = (page) => {
//         currentPage = page;
//     };
//     const showCtrls = () => {
//         pagination_ctrls.classList.add("active");
//     };
//     const loadPage = (page = 1) => {
//         let pageToLoad = pagination.collections[page - 1];
//         if (pageToLoad) {
//             showCtrls();
//             pagination_ctrls.querySelector(".pagination-info").innerHTML = `page ${page} of ${pagination.collections.length}`;
//             for (let row of Array.from(table_rows.children)) {
//                 row.parentNode.removeChild(row);
//             }
//             for (let row of pageToLoad) {
//                 table_rows.appendChild(row);
//             }
//             updateCurrentPage(page);
//         }
//         translationsTableService().resize();
//     };
//     const getPages = () => {
//         return pagination;
//     };
//     return function () {
//         return {
//             setPages: (rows) => {
//                 pagination.collections = [];
//                 let collectionsAmount = rows.length / itemsPerPage;
//                 for (let i = 0; i < collectionsAmount; i++) {
//                     pagination.collections.push(rows.splice(0, itemsPerPage));
//                 }
//                 console.log("pagination.collections:", pagination.collections);
//                 loadPage(); // load first page

//                 let shutterInDelays = 100 * 11; // there is a 100ms compounded animation-delay on first 10 rows
//                 setTimeout(function() {
//                    console.log("getPages()", getPages());
//                    for (let collection of getPages().collections) {
//                         for (let row of collection) {
//                             row.classList.remove("shutter-in");
//                         }
//                    }
//                 }, (shutterInDelays));
//             },
//             loadNextPage: () => {
//                 return loadPage(currentPage + 1);
//             },
//             loadPreviousPage: () => {
//                 return loadPage(currentPage - 1);
//             },
//             showCtrls: () => {
//                 return showCtrls();
//             },
//             hideCtrls: () => {
//                 pagination_ctrls.classList.remove("active");
//             },
//             GetPages: () => {
//                 return getPages();
//             }
//         }
//     }
// })();

// function translationsTableService () {
//     let rows = [];
//     let getRows = () => {
//         return rows;
//     };
//     let addRow = (row) => {
//         rows.push(row);
//     };
//     let setTableSize = (data = null) => {

//         console.log("data for setTableSize is:", data);

//         let space = window.innerHeight - translations_table.offsetTop - 100;

//         if (table_rows.children.length === 0 && !data) {
//            return;
//         }

//         if (!data) {
//             let h = table_rows.children.length < 10 ? "auto" : `${space}px`;
//             table_rows.style.height = h;
//             // table_rows.style.height = `${(window.innerHeight - translations_table.offsetTop - 50)}px`;
//             return;
//         }

//         // let keys = Object.keys(flat.flatten(JSON.parse(data)));
//         let keys = Object.keys(data);
//         // let space = window.innerHeight - translations_table.offsetTop - 50;

//         let h = keys.length < 10 ? "auto" : `${space}px`;
//         table_rows.style.height = h;
//     };
//     let checkInterpolationChanges = (e, valueToCheck, interpolationMatches) => {

//         if (valueToCheck == "") {
//             e.target.classList.remove("interpolation-changed");
//             return
//         }

//         let interpolationChanged = false;
//         for (let match of Array.from(interpolationMatches)){

//             console.log("matching " + match + " against >>>", valueToCheck);

//             if (valueToCheck.match(match)) {
//                 valueToCheck = valueToCheck.replace(match, "");
//             } else if (!valueToCheck.match(match)) {

//                 //alert("INTERPOLATION CHANGE DETECTED FOR: "+match);

//                 interpolationChanged = true;
//                 break;

//                 //e.target.classList.add("interpolation-changed");

//                 // let imported_interpolation_value = translationsService().getImportedTranslations()[e.target.getAttribute("key")];
//                 // this.value = imported_interpolation_value;
//                 // this.parentNode.previousElementSibling.classList.remove("line-through");
//             }
//         }

//         let type = interpolationChanged ? "add" : "remove";
//         e.target.classList[type]("interpolation-changed");
//     };
//     return {
//         filter: (data) => {
//             let pattern = new RegExp(data, "i");
//             for (let child of Array.from(translations_table.querySelector(".table-rows").children)) {
//                 if (!child.querySelector(".td").innerHTML.match(pattern)) {
//                     child.classList.add("hidden");
//                 } else {
//                     child.classList.remove("hidden");
//                 }
//             }
//         },
//         build: (data) => {
//             console.log("START BUILD");
//             console.log("USING DATA SET OF >>>>>>>>>", data);
//             // let obj = JSON.parse(data);
//             let obj = data;
//             obj = flat(obj); // flatten

//             let numKeys = Object.keys(obj).length;

//             let commonKeyPattern = /^(@:)*COMMON\./;

//             for (let prop in obj) {
//                     let key = prop;
//                     let en = obj[prop].toString();
//                     let enPretty = en;
//                     let interpolationPattern = /(one{|other{#?|plural,?|=0{|=1{|[a-zA-Z]+_[a-zA-Z]+[},]?|{{\w+}}|[{}])/g;

//                     let interpolationMatches = en.match(interpolationPattern);


//                     let patternsMatched = [];
//                     if (interpolationMatches && !en.match(/@:/)) {
//                         // continue;
//                         for (let match of interpolationMatches) {
//                             let pattern = new RegExp(match, "g");
//                             let alreadyMatched = false;
//                             for (let patternMatched of patternsMatched) {
//                                 if (pattern == patternMatched) {
//                                     alreadyMatched = true;
//                                 }
//                             }
//                             if (!alreadyMatched) {
//                                 // enPretty = enPretty.replace(pattern, `<span class=\"interpolation\">${match}</span>`);
//                                 patternsMatched.push(pattern);
//                             }
//                         }
//                     }



//                     let row = translations_table_row_TEMPLATE.cloneNode(true);
//                     let translationTextarea = row.querySelector("textarea");
//                     let keyTD = row.querySelectorAll(".td")[0];
//                     let enTD = row.querySelectorAll(".td")[1];

//                     row.removeAttribute("id");
//                     row.classList.remove("template");


//                     keyTD.innerHTML = `<span>${key}</span>`;
//                     enTD.innerHTML = `<span>${enPretty}</span>`;
//                     enTD.setAttribute("plain-text-value", en);

//                     if (key.match(commonKeyPattern)) {
//                         translationsService().setCommonKey(key, en);
//                     }

//                     if (en.match(commonKeyPattern)) {
//                          row.querySelectorAll(".td")[1].setAttribute("common-key", "");
//                     }

//                     if (interpolationMatches && !en.match(/@:/)) {
//                          enTD.setAttribute("interpolation", interpolationMatches);
//                          enTD.innerHTML += `<div class="interpolation-warning">This translation contains interpolation. Changing text within curly braces is not recommended.</div>`;

//                          translationTextarea.addEventListener("keyup", function (e) {

//                             let keyPressed = e.keyCode || e.charCode;

//                             console.log("e.target.value", e.target.value);

//                             let interpolationMatches = enTD.getAttribute("interpolation").split(",");
//                             let valueToCheck = this.value;

//                             // console.log("interpolationMatches", interpolationMatches);

//                             checkInterpolationChanges(e, valueToCheck, interpolationMatches);

//                          });
//                     }

//                     if (en.match(commonKeyPattern)) {
//                         let commonVal = obj[en.substr(2)];
//                         let commonKey = en;
//                         enTD.innerHTML += `<div class="common-value">${commonVal}</div>`;
//                     }

//                     translationTextarea.setAttribute("key", key);

//                     translationTextarea.addEventListener("keydown", function (e) {
//                         let key = e.keyCode || e.charCode;
//                         if (key === 13) {
//                             e.preventDefault();
//                         }
//                     });

//                     translationTextarea.addEventListener("click", function (e) {
//                         let en = this.parentNode.parentNode.querySelectorAll(".td")[1];
//                         if (en.hasAttribute("interpolation") && this.value === "") {
//                             let exportedInterpolationValue = translationsService().getExportedTranslations()[this.getAttribute("key")];
//                             this.value = exportedInterpolationValue;
//                             this.parentNode.previousElementSibling.classList.remove("line-through");
//                         }
//                     });

//                     translationTextarea.addEventListener("keyup", function (e) {
//                         let keyPressed = e.keyCode || e.charCode;
//                         let keyAttr = this.getAttribute("key");
//                         let val = this.value;

//                         if (keyPressed === 13) {
//                             e.preventDefault();
//                             return
//                         }

//                         if (val != "" && val != this.parentNode.previousElementSibling.getAttribute("plain-text-value")) {
//                             this.parentNode.previousElementSibling.classList.add("line-through");
//                         } else {
//                             this.parentNode.previousElementSibling.classList.remove("line-through");
//                         }

//                         translationsService().SyncCommonKeyValues(keyAttr, val);

//                     });

//                     translationTextarea.addEventListener("change", function (e) {

//                         translationsService().UpdateTranslations();
//                         localStorageService().setLocalStorageNEW();
//                     });
   
//                     addRow(row);
//             }

//             let rows = getRows();
//             paginationService().setPages(rows);

//             console.log("END BUILD");
//         },
//         resize: () => {
//             setTableSize();
//         },
//         init: (data) => {
//             let tableRows = translations_table.querySelector(".table-rows");
//             for (let child of Array.from(tableRows.children)) {
//                 if (!child.className.match(/tr/)) {
//                     continue;
//                 }
//                 tableRows.removeChild(child);
//             }
//             paginationService().hideCtrls();
//             setTableSize(data);
//         }
//     }
// }



// function errorService () {
//     let table = {
//         ERROR: {
//             GENERIC: "Sorry but you must have broken something init!"
//         },
//         SUCCESS: {
//             GENERIC: "Success!"
//         }
//     }
//     return {
//         getMsg: (key) => {
//             return flat(table)[key];
//         }
//     }
// }

// function alertService () {
//     return {
//         raise: (errorKey, options = {msg: "", type: ""}) => {
//             let errorMsg = "";
//             let type = options.type || errorKey.split(".")[0];

//             if (errorKey === "CUSTOM") {
//                 errorMsg = options.msg;
//             } else {
//                 errorMsg = errorService().getMsg(errorKey);
//             }

//             alert_box.classList.remove("pop", "error", "success");
//             alert_box.querySelector(".alert-msg").innerHTML = errorMsg;

//             alert_confirm_ctrl_cancel.classList.add("hidden");          

//             if (type.match(/error/i)) {              
//                 alert_box.classList.add("error");
//             } else if (type.match(/success/i)) {               
//                 alert_box.classList.add("success");
//             }
          
//             alert_screen.classList.add("active");
//             alert_box.classList.add("pop");          
//         },
//         dismiss: () => {
//             alert_screen.classList.remove("active");
//             alert_box.classList.remove("pop", "error", "success");
//         }
//     }
// }

// function confirmService () {
//     return {
//         raise: (msg, resolve, reject) => {

//             alert_box.classList.remove("pop", "error", "success");
//             alert_box.querySelector(".alert-msg").innerHTML = msg;

//             alert_confirm_ctrl_cancel.classList.remove("hidden");

//             alert_confirm_ctrl_ok.onclick = function () {
//                 alertService().dismiss();
//                 resolve();
//             };

//             alert_confirm_ctrl_cancel.onclick = function () {
//                 alertService().dismiss();
//                 reject();
//             };

//             alert_screen.classList.add("active");
//             alert_box.classList.add("pop");
//         }
//     }
// }

// function malenkyFileService () {
//     let writeLineToFile = (txt, scrollHeight, delay) => {
//         let part = document.createElement("TEXT");
//         part.innerHTML = txt;
//         setTimeout( () => {
//              paper_content.appendChild(part);
//              paper_content.scrollTop = scrollHeight;
//          }, delay);
//     }
//     let getContentHeight = (data) => {
//         paper_content.innerHTML = data;
//         return paper_content.scrollHeight;
//     }
//     let init = () => {
//         import_prompt.innerHTML = "Importing file";
//         paper_title.innerHTML = "";
//         paper_content.innerHTML = "";
//         loadingService().show();
//     }
//     return {
//         calculateContentHeight: (data) => {
//             paper_content.innerHTML = data;
//             return paper_content.scrollHeight;
//         },
//         build: (data, fileName) => {

//             data = JSON.stringify(data);
//             let delay = 500;
//             let delayAdd = 20;
//             let sliceTo = 50;
//             let sliceFrom = 0;
//             let snippet = data.length >= 5000 ? data.substr(0, 2500) + data.substr(-2500) : data;
//             let scrollHeight = getContentHeight(snippet);

//             init();

//             paper_title.innerHTML = fileName;

//             let numChars = snippet.length;
//             let iterations = numChars / sliceTo;
//             for (let i = 0; i < iterations; i++) {
//                 let line = snippet.slice(sliceFrom, sliceTo);
//                 writeLineToFile(line, scrollHeight, delay);
//                 delay += delayAdd;
//                 sliceFrom += 50;
//                 sliceTo += 50;
//             }
//             setTimeout( () => {
//                 import_prompt.innerHTML = "Done!";
//             }, delay);

//             loadingService().hide(delay + 1000);
//         }
//     }
// }

// const loadingService = (function(){
//     let isLoaded = true;
//     return function() {
//         return {
//             show: (delay = 0) => {
//                 setTimeout( () => {
//                     loading_screen.classList.add("active");
//                 }, delay);
//             },
//             hide: (delay = 0) => {
//                 setTimeout( () => {
//                     loading_screen.classList.remove("active");
//                     loadingService().setLoaded();
//                 }, delay);
//             },
//             isLoading: () => {
//                return isLoaded;
//             },
//             setLoaded: () => {
//                 return isLoaded = true;
//             },
//             setLoading: () => {
//                 return isLoaded = false;
//             }
//         }
//     }
// })();

// const fileService = (function () {
//     let file = null;
//     return function () {
//        return {
//             setFile(data) {
//                 file = data;
//                 console.log("file", file);
//             },
//             getFile() {
//                 console.log("file", file);
//                 return file;
//             },
//             getFileName() {
//                 if (file) {
//                     return file.name;
//                 }
//                 return localStorage.getItem("JTE_FILENAME");
//             }
//         }
//     }
// })();

// const localStorageService = (function () {
//     const getLocalStorage = () => {
//         return localStorage;
//     }
//     return function () {
//         return {
//            setLocalStorage: () => {

//                 return

//                 let localStorageObj = {}
//                 //localStorageObj["translationsTable"] = translationsService().getJSONTranslations();
//                 localStorageObj["exportedTranslations"] = JSON.stringify(translationsService().getExportedTranslations(), null, 4);
//                 localStorageObj["importedTranslations"] = JSON.stringify(translationsService().getImportedTranslations(), null, 4);
//                 localStorageObj["translations"] = JSON.stringify(translationsService().getTranslations(), null, 4);

//                 if (fileService().getFile()) {
//                     localStorageObj["fileName"] = fileService().getFile().name;
//                 }
//                 //localStorageObj["fileName"] = fileService().getFile() ? fileService.getFile().name : ;

//                 for (let key in localStorageObj) {
//                     localStorage.setItem(`jsonTranslationsEditor_${key}`, localStorageObj[key]);
//                 }

//                 // localStorage.setItem("jsonTranslationsEditor", localStorageObj);

//                 // localStorage.setItem("translationsTable", translationsService().getJSONTranslations());
//                 // localStorage.setItem("translations", JSON.stringify(translationsService().getTranslations(), null, 4));
//                 // localStorage.setItem("fileName", fileService().getFile().name);

//                 console.log("localStorage", localStorage);
//             },
//             setLocalStorageNEW: () => {
//                 let translations = translationsService().getTranslations();
//                 localStorage.translations = JSON.stringify(translations);
//                 console.log("localStorage:", localStorage);
//             },
//             setLocalStorageItem: (item, val) => {
//                 localStorage.setItem(item, val);
//             },
//             GetLocalStorage: () => {
//                 return getLocalStorage();
//                 // return localStorage;
//             },
//             isLocalStorageSet: () => {
//                 return getLocalStorage()["translations"];
//                 //return getLocalStorage()["jsonTranslationsEditor_exportedTranslations"] && getLocalStorage()["jsonTranslationsEditor_exportedTranslations"] != "{}";
//                 //return localStorageObj;
//             },
//             clear: () => {
//                 let prefix = "jsonTranslationsEditor_";
//                 let items = [`${prefix}importedTranslations`, `${prefix}exportedTranslations`, `${prefix}translations`, `${prefix}fileName`];
//                 for (let item of items) {
//                     localStorage.removeItem(item);
//                 }
//                 //return localStorage.clear();
//             }
//         }
//     }
// })();


// function isValidJSON (data) {
//     try {
//         JSON.parse(data);
//     }
//     catch (error) {
//         return {valid: false, error: error.message}
//     }
//     return {valid: true, error: null}
// }

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

                // console.log("data from localStorage:", data);

                let interval = setInterval(function(){
                    if (loadingService().isLoading()) {
                        translationsTableService().build(data);
                        clearInterval(interval);
                    }
                }, 10);

            }, function (reject) {

            });
        }
    }
}
