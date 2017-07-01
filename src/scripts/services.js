import flat from "flat";

const thumbnail_file = document.getElementById("thumbnailFile");
const progress = document.getElementById("progress");
const translations_table = document.getElementById("translationsTable");
const table_rows = translations_table.querySelector(".table-rows");
const translations_table_row_TEMPLATE = document.getElementById("translationsTableRow_TEMPLATE");
const translations_console = document.getElementById("translationsConsole");
const paper_content = document.getElementById("paperContent");
const paper_title = document.getElementById("paperTitle");
const file_name = document.getElementById("fileName");
const import_prompt = document.getElementById("importPrompt");
const loading_screen = document.getElementById("loadingScreen");
const pagination_ctrls = document.getElementById("paginationCtrls");

// const alert_bar = document.getElementById("alertBar");

const alert_screen = document.getElementById("alertScreen");
const alert_box = document.getElementById("alertBox");


function buildMalenkyFile (fileName, txt, delay = 0) {

    paper_title.innerHTML = "";
    paper_content.innerHTML = "";

    paper_content.parentNode.parentNode.classList.remove("file-add");

    setTimeout( () => {
        paper_content.parentNode.parentNode.classList.add("file-add");
    }, 10);

    setTimeout( () => {
         paper_title.innerHTML = fileName;
         paper_content.innerHTML = txt;;
    }, delay);
}

function textShuffle(txt) {
    let chars = txt.substr(0, 1000).split("");
    let newChars = [];
    for (let i = 0, l = chars.length; i < l; i++) {
        let rand = Math.floor(Math.random() * l);
        newChars.push(chars[rand]);
    }
    return newChars.join(" ");
}

function applyShuffledText (txt, el, delay, totalDelay) {
    setTimeout(function(){
        el.innerHTML = txt;
        setProgress(`${(delay / totalDelay) * 100}%`);
    }, delay);
}

function setProgress (percent = "0%") {
    progress.querySelector(".progress-bar").style.width = percent;
    let pretext = parseInt(percent) < 50? "Reading file..." : "Converting...";
    if (parseInt(percent) >= 100) {
        progress.querySelector(".before").innerHTML = "Done!";
    } else {
        progress.querySelector(".before").innerHTML = `${pretext} ${Math.floor(parseInt(percent))}%`;
    }
}

const translationsService = (function(){
    let importedTranslations = {}
    let translations = {}
    let jsonTranslations = "{}";
    let commonKeys = {}
    let textData = "";
    let importedFiles = [];
    let getFiles = () => {
        return importedFiles;
    };
    let getCommonKey = (key) => {
        return commonKeys[key];
    };
    let syncCommonKeyValues = (key, val) => {
        let commonKeyPattern = /^COMMON\./;
        if (key.match(commonKeyPattern)) {
            // update all hints relating to this key
            for (let row of Array.from(table_rows.children)) {
                let en = row.querySelectorAll(".td")[1];
                if (en.hasAttribute("common-key")) {
                    if (en.innerHTML.match(key)) {
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
    const setTranslationsAsJSON = (data = null) => {
        if (data) { // init
            return jsonTranslations = data;
        }
        // update
        let obj = JSON.parse(jsonTranslations);
        for (let key in translations) {
            obj[key] = translations[key];
        }
        return Object.keys(translations).length > 0 ? jsonTranslations = JSON.stringify(obj, null, 4) : jsonTranslations = JSON.stringify(importedTranslations, null, 4);
    }
    return function () {
        return {
            setImportedTranslations: (data) => {
                let obj = JSON.parse(data);
                importedTranslations = obj;
            },
            getImportedTranslations: () => {
                return importedTranslations;
            },
            SetTranslationsAsJSON: (data) => {
                return setTranslationsAsJSON(data);
            },
            setTranslations: (e) => {
                let key = e.target.getAttribute("key");
                let val = e.target.value;

                syncCommonKeyValues(key, val);

                if (val !== "") {
                    translations[key] = val;
                } else {
                    delete translations[key];
                }
                console.log(setTranslationsAsJSON());
                return translations;
            },
            getTranslations: () => {
                return translations;
            },
            setTextData: (data) => {
                textData = data;
            },
            getTextData: () => {
                return textData;
            },
            setCommonKey: (key, val) => {
                commonKeys[key] = val;
            },
            saveJSON: (link) => {
                if (link) {
                    let jsonData = JSON.stringify(flat.unflatten(translations), null, 4);
                    let textData = new Blob([jsonData], {type: "text/plain"});
                    let file = window.URL.createObjectURL(textData);
                    link.download = `${getFiles()[0].name}_EDIT.${getFiles()[0].ext}`;
                    link.href = file;

                    console.log("output: ", jsonData);
                }
            },
            saveProgress: (link) => {
                if (link) {
                    let textData = new Blob([jsonTranslations], {type: "text/plain"});
                    link.download = `test.json`;
                    let file = window.URL.createObjectURL(textData);
                    link.href = file;

                    console.log("output: ", textData);
                }
            },
            pushFile: (file) => {
                console.log(file);
                importedFiles.push({
                    name: file.name.split(".")[0],
                    ext: file.name.split(".")[1]
                });
            },
            init: (e) => {
                translations = {}
            }
        }
    }
})();

const paginationService = (function() {
    let pagination = {}
    let currentPage = 1;
    let itemsPerPage = 50;
    const updateCurrentPage = (page) => {
        currentPage = page;
    };
    const showCtrls = () => {
        pagination_ctrls.classList.add("active");
    };
    const loadPage = (page = 1) => {
        let pageToLoad = pagination.collections[page - 1];
        if (pageToLoad) {
            showCtrls();
            pagination_ctrls.querySelector(".pagination-info").innerHTML = `page ${page} of ${pagination.collections.length}`;
            for (let row of Array.from(table_rows.children)) {
                row.parentNode.removeChild(row);
            }
            for (let row of pageToLoad) {
                table_rows.appendChild(row);
            }
            updateCurrentPage(page);
        }
    };
    const getPages = () => {
        return pagination;
    };
    return function () {
        return {
            setPages: (rows) => {
                pagination.collections = [];
                let collectionsAmount = rows.length / itemsPerPage;
                for (let i = 0; i < collectionsAmount; i++) {
                    pagination.collections.push(rows.splice(0, itemsPerPage));
                }
                console.log("pagination.collections:", pagination.collections);
                loadPage(); // load first page

                let shutterInDelays = 100 * 11; // there is a 100ms compounded animation-delay on first 10 rows
                setTimeout(function() {
                   console.log(getPages());
                   for (let collection of getPages().collections) {
                        for (let row of collection) {
                            row.classList.remove("shutter-in");
                        }
                   }
                }, (shutterInDelays));
            },
            loadNextPage: () => {
                return loadPage(currentPage + 1);
            },
            loadPreviousPage: () => {
                return loadPage(currentPage - 1);
            },
            showCtrls: () => {
                return showCtrls();
            },
            hideCtrls: () => {
                pagination_ctrls.classList.remove("active");
            }
        }
    }
})();

function translationsTableService () {
    let rows = [];
    let getRows = () => {
        return rows;
    };
    let addRow = (row) => {
        rows.push(row);
    };
    let setTableSize = (data) => {

        let space = window.innerHeight - translations_table.offsetTop - 50;

        if (table_rows.children.length === 0 && !data) {
           return;
        }

        if (!data) {
            let h = table_rows.children.length < 10 ? "auto" : `${space}px`;
            table_rows.style.height = h;
            // table_rows.style.height = `${(window.innerHeight - translations_table.offsetTop - 50)}px`;
            return;
        }

        let keys = Object.keys(flat.flatten(JSON.parse(data)));
        // let space = window.innerHeight - translations_table.offsetTop - 50;

        let h = keys.length < 10 ? "auto" : `${space}px`;
        table_rows.style.height = h;
    };
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
        build: (data) => {
            console.log("START BUILD");
            let obj = JSON.parse(data);
            obj = flat(obj); // flatten

            let numKeys = Object.keys(obj).length;
            //let delayAdd = 1000 / numKeys;

            // let delay = 0;
            // let delayAdd = 150;

            let commonKeyPattern = /^(@:)*COMMON\./;

            for (let prop in obj) {
                    let key = prop;
                    let en = obj[prop].toString();
                    let enPretty = en;

                    //let interpolationPattern = /{{.[^}]+}+|{\w+,\s{0,1}plural,\s*|(\=0|\=1|one|other){|[{}]|[A-Z]+_[A-Z]+|(?<={)#/g; js not supports lookbehind so this can't be used
                    // let interpolationPattern = /{{.[^}]+}+|{\w+,\s{0,1}plural,\s*|(\=0|\=1|one|other){#*|[{}]|{+.*[A-Z]+_[A-Z]+.+}/g
                    // let interpolationPattern = /{[A-Z]+_[A-Z]+[\s,]*}|{{.[^}]+}+|{\w+,\s{0,1}plural,\s*|(\=0|\=1|one|other){#*|[{}]/g;
                    let interpolationPattern = /{\s?[a-zA-Z]+_[a-zA-Z]+[,\s]?|{{.[^}]+}+|plural,\s?|(\=0|\=1|one|other){#*|[{}]|plural\s?=\d/g;


                    let interpolationMatches = en.match(interpolationPattern);
                    if (interpolationMatches && !en.match(/@:/)) {
                        for (let match of interpolationMatches) {
                            let pattern = new RegExp(match, "g");
                            enPretty = enPretty.replace(pattern, `<span class=\"interpolation\">${match}</span>`);
                        }
                    }

                    let row = translations_table_row_TEMPLATE.cloneNode(true);
                    let translationTextarea = row.querySelector("textarea");
                    let keyTD = row.querySelectorAll(".td")[0];
                    let enTD = row.querySelectorAll(".td")[1];

                    row.removeAttribute("id");
                    row.classList.remove("template");


                    keyTD.innerHTML = key;
                    enTD.innerHTML = enPretty;
                    enTD.setAttribute("plain-text-value", en);

                    if (key.match(commonKeyPattern)) {
                        translationsService().setCommonKey(key, en);
                    }

                    if (en.match(commonKeyPattern)) {
                         row.querySelectorAll(".td")[1].setAttribute("common-key", "");
                    }

                    if (interpolationMatches) {
                         enTD.setAttribute("interpolation", interpolationMatches);
                         enTD.innerHTML += `<div class="interpolation-warning">Highlighted text CANNOT be changed!</div>`;

                         translationTextarea.addEventListener("keyup", function () {
                            let interpolationMatches = enTD.getAttribute("interpolation").split(",");
                            console.log("interpolationMatches", interpolationMatches);
                            let valueToCheck = this.value;
                            for (let match of Array.from(interpolationMatches)){
                                console.log("matching " + match + " against >>>", valueToCheck);
                                if (valueToCheck.match(match)) {
                                    valueToCheck = valueToCheck.replace(match, "");
                                } else if (!valueToCheck.match(match)) {
                                    let imported_interpolation_value = translationsService().getImportedTranslations()[this.getAttribute("key")];
                                    this.value = imported_interpolation_value;
                                    this.parentNode.previousElementSibling.classList.remove("line-through");
                                }
                            }
                         });
                    }

                    if (en.match(commonKeyPattern)) {
                        let commonVal = obj[en.substr(2)];
                        let commonKey = en;
                        enTD.innerHTML += `<div class="common-value">${commonVal}</div>`;
                    }

                    translationTextarea.setAttribute("key", key);

                    translationTextarea.addEventListener("keydown", function (e) {
                        let key = e.keyCode || e.charCode;
                        if (key === 13) {
                            e.preventDefault();
                        }
                    });

                    translationTextarea.addEventListener("click", function (e) {
                        let en = this.parentNode.parentNode.querySelectorAll(".td")[1];
                        if (en.hasAttribute("interpolation") && this.value === "") {
                            let imported_interpolation_value = translationsService().getImportedTranslations()[this.getAttribute("key")];
                            this.value = imported_interpolation_value;
                            this.parentNode.previousElementSibling.classList.remove("line-through");
                        }
                    });

                    translationTextarea.addEventListener("keyup", function (e) {
                        let key = e.keyCode || e.charCode;
                        if (key === 13) {
                            e.preventDefault();
                        }
                        if (this.value != "" && this.value != this.parentNode.previousElementSibling.getAttribute("plain-text-value")) {
                            this.parentNode.previousElementSibling.classList.add("line-through");
                        } else {
                            this.parentNode.previousElementSibling.classList.remove("line-through");
                        }
                        translationsService().setTranslations(e);
                    });

                    //addRow(row, delay);
                    addRow(row);

                    // delay += delay < 1200? delayAdd : 0;
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

function isValidJSON (data) {
    try {
        JSON.parse(data);
    }
    catch (error) {
        return {valid: false, error: error.message}
    }
    return {valid: true, error: null}
}

function errorService () {
    let table = {
        ERROR: {
            GENERIC: "Sorry but you must have broken something init!"
        },
        SUCCESS: {
            GENERIC: "Success!"
        }
    }
    return {
        getMsg: (key) => {
            return flat(table)[key];
        }
    }
}

function alertService () {
    return {
        raise: (errorKey, options = {msg: "", type: ""}) => {
            let errorMsg = "";
            let type = options.type || errorKey.split(".")[0];

            if (errorKey === "CUSTOM") {
                errorMsg = options.msg;
            } else {
                errorMsg = errorService().getMsg(errorKey);
            }

            alert_screen.querySelector(".alert-msg").innerHTML = errorMsg;
            alert_box.classList.remove("pop", "error", "success");

            alert_box.querySelector(".alert-msg").innerHTML = errorMsg;


            // alert_bar.querySelector("h2").innerHTML = errorMsg;

            // alert_bar.classList.remove("active", "error", "success");

            if (type.match(/error/i)) {
                // alert_bar.classList.add("error");
                alert_box.classList.add("error");
            } else if (type.match(/success/i)) {
                // alert_bar.classList.add("success");
                alert_box.classList.add("success");
            }

            // alert_bar.classList.add("active");

            alert_screen.classList.add("active");
            alert_box.classList.add("pop");

            // setTimeout(() => {
            //     alert_bar.classList.remove("active");
            // }, 2500);
        },
        dismiss: () => {
            alert_screen.classList.remove("active");
            alert_box.classList.remove("pop", "error", "success");
        }
    }
}

function malenkyFileService () {
    let writeLineToFile = (txt, scrollHeight, delay) => {
        let part = document.createElement("TEXT");
        part.innerHTML = txt;
        setTimeout( () => {
             paper_content.appendChild(part);
             paper_content.scrollTop = scrollHeight;
         }, delay);
    }
    let getContentHeight = (data) => {
        paper_content.innerHTML = data;
        return paper_content.scrollHeight;
    }
    let init = () => {
        import_prompt.innerHTML = "Importing file";
        paper_title.innerHTML = "";
        paper_content.innerHTML = "";
        loadingService().show();
    }
    return {
        calculateContentHeight: (data) => {
            paper_content.innerHTML = data;
            return paper_content.scrollHeight;
        },
        build: (data, fileName) => {

            let delay = 500;
            let delayAdd = 20;
            let sliceTo = 50;
            let sliceFrom = 0;
            let snippet = data.length >= 5000 ? data.substr(0, 2500) + data.substr(-2500) : data;
            let scrollHeight = getContentHeight(snippet);

            init();

            paper_title.innerHTML = fileName;

            let numChars = snippet.length;
            let iterations = numChars / sliceTo;
            for (let i = 0; i < iterations; i++) {
                let line = snippet.slice(sliceFrom, sliceTo);
                writeLineToFile(line, scrollHeight, delay);
                delay += delayAdd;
                sliceFrom += 50;
                sliceTo += 50;
            }
            setTimeout( () => {
                import_prompt.innerHTML = "Done!";
            }, delay);

            loadingService().hide(delay + 1000);
        }
    }
}

const loadingService = (function(){
    let isLoaded = true;
    return function() {
        return {
            show: (delay = 0) => {
                setTimeout( () => {
                    loading_screen.classList.add("active");
                }, delay);
            },
            hide: (delay = 0) => {
                setTimeout( () => {
                    loading_screen.classList.remove("active");
                    loadingService().setLoaded();
                }, delay);
            },
            isLoading: () => {
               return isLoaded;
            },
            setLoaded: () => {
                return isLoaded = true;
            },
            setLoading: () => {
                return isLoaded = false;
            }
        }
    }
})();

export default {
    log() {
        console.log("services.js log() method called");
    },
    es6BabelTest() {
        console.log("services.js es6BabelTest() method called");
        const ES6_ARROW_FN = () => console.log(ES6_ARROW_FN)
        console.log("babel converted ES6_ARROW_FN = () => console.log(ES6_ARROW_FN) to:");
        console.log(ES6_ARROW_FN);
    },
    FileHandler() {

        loadingService().setLoading();

        let files = this.files;
        for (let file of files) {
            let reader = new FileReader();
            reader.onload = (e) => {
                let textData = e.target.result;
                let checkValid = isValidJSON(textData);
                if (checkValid.valid) {

                    file_name.innerHTML = file.name;

                    translationsService().setImportedTranslations(textData);
                    console.log(translationsService().SetTranslationsAsJSON(textData));

                    translationsService().setTextData(textData);
                    translationsService().pushFile(file);

                    malenkyFileService().build(textData, file.name);

                    translationsTableService().init(textData);

                    let interval = setInterval(function(){
                        if (loadingService().isLoading()) {
                            translationsTableService().build(textData);
                            clearInterval(interval);
                        }
                    }, 10);
                } else {
                    alertService().raise("CUSTOM", {msg: `<i class="ion-md-warning">INVALID FILE.</i><div>${checkValid.error}</div>`, type: "ERROR"});
                }
            }
            reader.readAsText(file);
        }
    },
    TranslationsTableService() {
        return translationsTableService();
    },
    TranslationsService() {
        return translationsService();
    },
    AlertService() {
        return alertService();
    },
    PaginationService() {
        return paginationService();
    }
}
