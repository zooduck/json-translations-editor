// DOM...
import {translations_table, table_rows, translations_table_row_TEMPLATE} from "./dom_service";
// Librarys...
import flat from "flat";
// Services...
import {paginationService} from "./pagination_service";
import {translationsService} from "./translations_service";
import {localStorageService} from "./local_storage_service";

export const translationsTableService = (function() {
    let rows = [];   
    const getRows = () => {
        return rows;
    };
    const addRow = (row) => {       
        rows.push(row);
    };
    const resetRows = () => {
        rows = [];
    };
    const setTableSize = (data = null) => {

        let space = window.innerHeight - translations_table.offsetTop - 100;

        if (table_rows.children.length === 0 && !data) {
           return;
        }

        if (!data) {            
            let h = `${space}px`;
            table_rows.style.height = h;
            return;
        }

        let keys = Object.keys(data);

        let h = keys.length < 10 ? "auto" : `${space}px`;
        table_rows.style.height = h;

    };
    const checkInterpolationChanges = (e, valueToCheck, interpolationMatches) => {

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
                interpolationChanged = true;
                break;
            }
        }

        let type = interpolationChanged ? "add" : "remove";
        e.target.classList[type]("interpolation-changed");
    };

    window.addEventListener("resize", function () {
        setTableSize();
    });

    return function () {
        return {
            GetRows: () => {
                return getRows();
            },
            filter: (e, data) => {
                
                let key = e.keyCode || e.charCode;
                
                if (key === 9) { // tab
                    return;
                }

                let pattern = new RegExp(data, "i");
                let rows = Array.from(getRows());
                let filteredRows = rows.filter(function(row) {             
                    return row.children[0].innerText.match(pattern);
                });
               
                if (data !== "") {
                    paginationService().filterApply();
                } else {
                    paginationService().filterRemove();
                }
                let animate = data === "" ? true : false;
                let filterCancelled = data === "" ? true : false;
                let page = filteredRows.length > 0 ? 1 : 0;
                let options = {page: page, animate: animate, filterCancelled: filterCancelled}

                paginationService().setPages(filteredRows, options);               
            },
            build: (data, lastViewedPage = data.page || 1) => {

                //lastViewedPage = data.page || lastViewedPage;

                console.log("START BUILD");
                console.log("USING DATA SET OF:", data);               

                let exportData = flat(data.export);
                let importData = flat(data.import);
              
                let commonKeyPattern = /^(@:)*COMMON\./;

                resetRows(); // empty rows array

                for (let prop in importData) {
                        let key = prop;                       
                        let en = importData[prop].toString();
                        let enPretty = en;
                        let interpolationPattern = /(one{|other{#?|plural,?|=0{|=1{|[a-zA-Z]+_[a-zA-Z]+[},]?|{{\w+}}|{\w+}|[{}])/g;                       

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
                            //localStorageService().setLocalStorage();
                        });

                        resetBtn.addEventListener("click", function (e) {
                          
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
                let options = {page: lastViewedPage, animate: true, filterCancelled: false}

                paginationService().SetLastViewedPage(lastViewedPage);
                paginationService().setPages(rows, options);

                console.log("END BUILD");

                console.log("lastViewedPage", lastViewedPage);
                console.log("paginationService().GetLastViewedPage()", paginationService().GetLastViewedPage());
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
})();
