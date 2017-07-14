// DOM...
import {translations_table, table_rows, translations_table_row_TEMPLATE} from "./dom_service";
// Librarys...
import flat from "flat";
// Services...
import {paginationService} from "./pagination_service";
import {translationsService} from "./translations_service";
import {localStorageService} from "./local_storage_service";

export function translationsTableService () {
    let rows = [];
    let getRows = () => {
        return rows;
    };
    let addRow = (row) => {
        rows.push(row);
    };
    let setTableSize = (data = null) => {

        let space = window.innerHeight - translations_table.offsetTop - 100;

        if (table_rows.children.length === 0 && !data) {
           return;
        }

        if (!data) {
            //let h = table_rows.children.length < 10 ? "auto" : `${space}px`;
            let h = `${space}px`;
            table_rows.style.height = h;
            return;
        }

        // let keys = Object.keys(flat.flatten(JSON.parse(data)));
        let keys = Object.keys(data);

        let h = keys.length < 10 ? "auto" : `${space}px`;
        table_rows.style.height = h;

    };
    let checkInterpolationChanges = (e, valueToCheck, interpolationMatches) => {

        if (valueToCheck == "") {
            e.target.classList.remove("interpolation-changed");
            return
        }

        let interpolationChanged = false;
        for (let match of Array.from(interpolationMatches)){

            console.log("matching " + match + " against >>>", valueToCheck);

            if (valueToCheck.match(match)) {
                valueToCheck = valueToCheck.replace(match, "");
            } else if (!valueToCheck.match(match)) {

                //alert("INTERPOLATION CHANGE DETECTED FOR: "+match);

                interpolationChanged = true;
                break;

                //e.target.classList.add("interpolation-changed");

                // let imported_interpolation_value = translationsService().getImportedTranslations()[e.target.getAttribute("key")];
                // this.value = imported_interpolation_value;
                // this.parentNode.previousElementSibling.classList.remove("line-through");
            }
        }

        let type = interpolationChanged ? "add" : "remove";
        e.target.classList[type]("interpolation-changed");
    };

    window.addEventListener("resize", function () {
        setTableSize();
    });

    return {
        filter: (data) => {
            let pattern = new RegExp(data, "i");
            for (let child of Array.from(translations_table.querySelector(".table-rows").children)) {
                if (!child.querySelector(".td").innerHTML.match(pattern)) {
                    child.classList.add("hidden");
                } else {
                    child.classList.remove("hidden");
                }
            }
        },
        filterAll: (data) => {
            let pattern = new RegExp(data, "i");
            let collections = paginationService().GetPages().collections;
            for (let collection of Array.from(collections)) {
                for (let row of collection) {
                    let key = row.firstElementChild.innerText;
                    if (key.match(pattern)) {
                        console.log("match found for key: ", key);
                    }
                }
            }   
            //console.table(paginationService().GetPages().collections);
        },
        build: (data) => {
            console.log("START BUILD");
            console.log("USING DATA SET OF >>>>>>>>>", data);
            // debugger
            // let obj = JSON.parse(data);


            let exportData = flat(data.export);
            let importData = flat(data.import);



            // let obj = data;
            // obj = flat(obj); // flatten

            // let numKeys = Object.keys(obj).length;

            let commonKeyPattern = /^(@:)*COMMON\./;

            for (let prop in importData) {
                    let key = prop;
                    // console.log("obj[prop]", obj[prop]);
                    let en = importData[prop].toString();
                    let enPretty = en;
                    let interpolationPattern = /(one{|other{#?|plural,?|=0{|=1{|[a-zA-Z]+_[a-zA-Z]+[},]?|{{\w+}}|{\w+}|[{}])/g;

                    // let interpolationMatches = en.match(interpolationPattern);

                    // console.log("checking: ", key, "in", translationsService().getTranslations().import);
                    //debugger

                    let interpolationMatches = translationsService().getTranslations().import[key].match(interpolationPattern);

                     // do not prettify EN field (replacement with span tags is not yet reliable)

                    // let patternsMatched = [];
                    // if (interpolationMatches && !en.match(/@:/)) {
                    //     for (let match of interpolationMatches) {
                    //         let pattern = new RegExp(match, "g");
                    //         let alreadyMatched = false;
                    //         for (let patternMatched of patternsMatched) {
                    //             if (pattern === patternMatched) {
                    //                 alreadyMatched = true;
                    //             }
                    //         }
                    //         if (!alreadyMatched) {

                    //             enPretty = enPretty.replace(pattern, `<span class=\"interpolation\">${match}</span>`);
                    //             patternsMatched.push(pattern);
                    //         }
                    //     }
                    // }

                    let row = translations_table_row_TEMPLATE.cloneNode(true);
                    let translationTextarea = row.querySelector("textarea");
                    let keyTD = row.querySelectorAll(".td")[0];
                    let enTD = row.querySelectorAll(".td")[1];
                    let resetBtn = row.querySelector(".reset-value");

                    row.removeAttribute("id");
                    row.classList.remove("template");

                    keyTD.innerHTML = `<span>${key}</span>`;

                    enTD.querySelector("span").innerHTML = enPretty;

                    enTD.setAttribute("plain-text-value", en);
                    enTD.setAttribute("key", key);

                    translationTextarea.setAttribute("key", key);
                    
                    if (importData[key] !== exportData[key]) {
                        translationTextarea.value = exportData[key];
                        enTD.querySelector("span").classList.add("line-through");
                    }                    


                    if (key.match(commonKeyPattern)) {
                        translationsService().setCommonKey(key, en);
                    }

                    if (en.match(commonKeyPattern)) {
                         row.querySelectorAll(".td")[1].setAttribute("common-key", "");
                    }

                    if (interpolationMatches && !en.match(/@:/)) {

                        enTD.setAttribute("interpolation", interpolationMatches);
                        // enTD.setAttribute("plain-text-value", translationsService().getTranslations().import[key]); // use imported interpolation value

                         // enTD.innerHTML += `<div class="interpolation-warning">This translation contains interpolation. Changing text inside curly braces or text with underscores is not recommended.</div>`;
                         // enTD.innerHTML += `<div class="interpolation-warning">Use caution when editing this field.</div>`;

                         enTD.querySelector(".interpolation-warning").innerHTML = "Use caution when editing this field";
                         enTD.querySelector(".interpolation-warning").classList.add("active");

                         translationTextarea.addEventListener("keyup", function (e) {

                            let keyPressed = e.keyCode || e.charCode;

                            let interpolationMatches = enTD.getAttribute("interpolation").split(",");
                            let valueToCheck = this.value;

                            checkInterpolationChanges(e, valueToCheck, interpolationMatches);
                         });
                    }

                    if (en.match(commonKeyPattern)) {
                        let commonVal = exportData[en.substr(2)];
                        let commonKey = en;
                        // enTD.innerHTML += `<div class="common-value">${commonVal}</div>`;
                        enTD.querySelector(".common-value").innerHTML = commonVal;
                        enTD.querySelector(".common-value").classList.add("active");
                    }



                    translationTextarea.addEventListener("keydown", function (e) {
                        let key = e.keyCode || e.charCode;
                        if (key === 13) {
                            e.preventDefault();
                        }
                    });

                    translationTextarea.addEventListener("click", function (e) {
                        let en = this.parentNode.parentNode.querySelectorAll(".td")[1];
                        if (en.hasAttribute("interpolation") && this.value === "") {
                            // let exportedInterpolationValue = translationsService().getExportedTranslations()[this.getAttribute("key")];
                            let exportedInterpolationValue = translationsService().getTranslations().export[this.getAttribute("key")];
                            this.value = exportedInterpolationValue;
                            this.parentNode.previousElementSibling.classList.remove("line-through");
                        }

                        if (enTD.hasAttribute("interpolation-matches")) {
                            let interpolationMatches = enTD.getAttribute("interpolation").split(",");
                            checkInterpolationChanges(e, this.value, interpolationMatches);
                        }


                    });

                    translationTextarea.addEventListener("keyup", function (e) {
                        let keyPressed = e.keyCode || e.charCode;
                        let keyAttr = this.getAttribute("key");
                        let val = this.value;

                        if (keyPressed === 13) {
                            e.preventDefault();
                            return
                        }

                        if (val != "" && val != this.parentNode.previousElementSibling.getAttribute("plain-text-value")) {
                            this.parentNode.previousElementSibling.querySelector("span").classList.add("line-through");
                        } else {
                            this.parentNode.previousElementSibling.querySelector("span").classList.remove("line-through");
                        }

                        translationsService().SyncCommonKeyValues(keyAttr, val);

                    });

                    translationTextarea.addEventListener("change", function (e) {

                        translationsService().UpdateTranslations();
                        localStorageService().setLocalStorage();
                    });

                    resetBtn.addEventListener("click", function (e) {
                        // let key = this.parentNode.getAttribute("key");
                        let en = translationsService().resetTranslationKey(key);

                        this.parentNode.querySelector(".common-value").classList.remove("active");

                        this.parentNode.querySelector("span").innerHTML = en;
                        this.parentNode.querySelector("span").classList.remove("line-through");

                        this.parentNode.nextElementSibling.querySelector("textarea").value = "";

                        if (en.match(commonKeyPattern)) {                            
                            this.parentNode.querySelector(".common-value").innerHTML = translationsService().getTranslations().import[en.substr(2)];
                            this.parentNode.querySelector(".common-value").classList.add("active");
                        }

                    });

                    addRow(row);
            }

            let rows = getRows();
            paginationService().setPages(rows);

            console.log("END BUILD");
        },
        resize: () => {
            setTableSize();
        },
        init: (data) => {
            let tableRows = translations_table.querySelector(".table-rows");
            for (let child of Array.from(tableRows.children)) {
                if (!child.className.match(/tr/)) {
                    continue;
                }
                tableRows.removeChild(child);
            }
            paginationService().hideCtrls();
            setTableSize(data);
        }
    }
}
