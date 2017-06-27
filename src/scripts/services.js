import flat from "flat";

const thumbnail_file = document.getElementById("thumbnailFile");
const progress = document.getElementById("progress");
const translations_table = document.getElementById("translationsTable");
const table_rows = translations_table.querySelector(".table-rows");
const translations_table_row_TEMPLATE = document.getElementById("translationsTableRow_TEMPLATE");
const alert_bar = document.getElementById("alertBar");
const translations_console = document.getElementById("translationsConsole");
const paper_content = document.getElementById("paperContent");
const paper_title = document.getElementById("paperTitle");
const file_name = document.getElementById("fileName");

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
// function addRow (row, delay) {
//     setTimeout(() => {
//         translations_table.appendChild(row);
//     }, delay);
// }
// function emptyTranslationsTable () {
//     for (let child of Array.from(translations_table.children)) {
//         // console.log("child", child);
//         if (!child.className.match(/tr/)) {
//             continue;
//         }
//         translations_table.removeChild(child);
//     }
// }
const translationsService = (function(){
    let translations = {}
    let textData = "";
    return function () {
        return {
            setTranslations: (e) => {
                let key = e.target.getAttribute("key");
                let val = e.target.value;
                if (val !== "") {
                    translations[key] = val;
                } else {
                    delete translations[key];
                }
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
            generateJSON: () => {
                return JSON.stringify(flat.unflatten(translations), null, 4);
            },
            init: (e) => {
                translations = {}
            }
        }
    }
})();
function translationsTableService () {
    let addRow = (row, delay) => {
        setTimeout(() => {
            translations_table.children[1].appendChild(row);
        }, delay);
    }
    let setTableSize = (data) => {

        if (table_rows.children.length === 0 && !data) {
           return;
        }

        if (!data) {
             table_rows.style.height = `${(window.innerHeight - translations_table.offsetTop - 50)}px`;
             return;
        }

        let keys = Object.keys(flat.flatten(JSON.parse(data)));
        let space = window.innerHeight - translations_table.offsetTop - 50;
        let h = keys.length < 10 ? "auto" : `${space}px`;
        table_rows.style.height = h;

    }
    return {
        build: (data) => {
            console.log("START BUILD");
            let obj = JSON.parse(data);
            obj = flat(obj); // flatten
            let delay = 0;
            let numKeys = Object.keys(obj).length;
            //let delayAdd = 1000 / numKeys;
            let delayAdd = 150;
            let commonKeyPattern = /^@:/;

            for (let prop in obj) {
                    let key = prop;
                    let en = obj[prop].toString();

                    let row = translations_table_row_TEMPLATE.cloneNode(true);
                    row.classList.remove("template");

                    row.querySelectorAll(".td")[0].innerHTML = key;
                    row.querySelectorAll(".td")[1].innerHTML = en;

                    if (en.match(commonKeyPattern)) {
                        let commonVal = obj[en.substr(2)];
                        let commonKey = en;
                        row.querySelectorAll(".td")[1].innerHTML += ` (${commonVal})`;
                    }

                    row.querySelector("textarea").setAttribute("key", key);
                    row.querySelector("textarea").addEventListener("keydown", (e) => {
                        let key = e.keyCode || e.charCode;
                        if (key === 13) {
                            e.preventDefault();
                        }
                    });
                    row.querySelector("textarea").addEventListener("blur", (e) => {
                        let key = e.keyCode || e.charCode;
                        if (key === 13) {
                            e.preventDefault();
                        }
                        if (e.target.value != "") {
                            e.target.parentNode.previousElementSibling.classList.add("line-through");
                        } else {
                            e.target.parentNode.previousElementSibling.classList.remove("line-through");
                        }

                        translationsService().setTranslations(e);

                        // let translations = translationsService().getTranslations();

                        // let arr = [];
                        // for (let key in translations) {
                        //  arr.push(`${key}:${translations[key]}`);
                        // }
                        // translationsConsoleService().clear(1);
                        // translationsConsoleService().log(arr, {delay: 0, pause: 0, pre: translations_console.querySelectorAll("pre")[1]});
                        // console.log(translationsService().getTranslations());
                    });


                    addRow(row, delay);


                    delay += delay < 1200? delayAdd : 0;

            }
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
                // console.log(child);
                tableRows.removeChild(child);
            }
            setTableSize(data);
        }
    }
}
// function buildTranslationsTable (jsonData) {
//     let obj = JSON.parse(jsonData);
//     obj = flat(obj); // flatten
//     let delay = 0;
//     let numKeys = Object.keys(obj).length;
//     //let delayAdd = 1000 / numKeys;
//     let delayAdd = 150;
//     let commonKeyPattern = /^@:/;

//     for (let prop in obj) {
//             let key = prop;
//             let en = obj[prop].toString();

//             let row = translations_table_row_TEMPLATE.cloneNode(true);
//             row.classList.remove("template");

//             row.querySelectorAll(".td")[0].innerHTML = key;
//             row.querySelectorAll(".td")[1].innerHTML = en;

//             if (en.match(commonKeyPattern)) {
//                 let commonVal = obj[en.substr(2)];
//                 let commonKey = en;
//                 row.querySelectorAll(".td")[1].innerHTML += ` (${commonVal})`;
//             }

//             row.querySelector("textarea").setAttribute("key", key);
//             row.querySelector("textarea").addEventListener("keydown", (e) => {
//                 let key = e.keyCode || e.charCode;
//                 if (key === 13) {
//                     e.preventDefault();
//                 }
//             });
//             row.querySelector("textarea").addEventListener("blur", (e) => {
//                 let key = e.keyCode || e.charCode;
//                 if (key === 13) {
//                     e.preventDefault();
//                 }
//                 if (e.target.value != "") {
//                     e.target.parentNode.previousElementSibling.classList.add("line-through");
//                 } else {
//                     e.target.parentNode.previousElementSibling.classList.remove("line-through");
//                 }

//                 translationsService().update(e);

//                 // let translations = translationsService().getTranslations();

//                 // let arr = [];
//                 // for (let key in translations) {
//                 //  arr.push(`${key}:${translations[key]}`);
//                 // }
//                 // translationsConsoleService().clear(1);
//                 // translationsConsoleService().log(arr, {delay: 0, pause: 0, pre: translations_console.querySelectorAll("pre")[1]});
//                 // console.log(translationsService().getTranslations());
//             });

//             addRow(row, delay);

//             delay += delay < 1200? delayAdd : 0;
//             console.log(delay);
//     }
// }
function translationsConsoleService () {
    return {
        log: (msgArray = null, options = {delay: 50, pause: 1000, pre: translations_console.querySelector("pre")}) => {
            translations_console.classList.remove("data-analysis-mode");
            console.log(options);
            let messages = msgArray || [
                "Ready!",
                "You can now edit translations in the table below."
            ];
            let delay = 0;
            let pause = options.pause || 0;
            for (let msg of Array.from(messages)) {
                let chars = msg.split("");
                // console.log("index: ", messages.indexOf(msg));
                if (messages.indexOf(msg) !== 0) {
                    chars.unshift("\n\n");
                }
                for (let char of chars) {
                    setTimeout(function(){
                        options.pre.innerHTML += char;
                    }, delay);
                    delay += options.delay || 0;
                }
                delay += pause;
            }
        },
        clear: (preIndex = 0) => {
            translations_console.querySelectorAll("pre")[preIndex].innerHTML = "";
        }
    }
}
function createThumbnailTextFile (textData, fileName) {
    // thumbnail_file.classList.remove("json-parsed", "expand");

    thumbnail_file.classList.remove("print", "push");

    // translations_console.classList.add("data-analysis-mode");


    let h4 = thumbnail_file.querySelector("h4");
    let pre = thumbnail_file.querySelector("pre");
    let console_pre = translations_console.querySelector("pre");


    // ############################################
    // NEW LOGIC FOR SCAN FILE ANIMATION (TODO!)
    translationsConsoleService().clear();
    translationsConsoleService().log(["Scanning file...", "Done!"], {delay: 50, pause: 2000, pre: console_pre});
    pre.innerHTML = textData;
    h4.innerHTML = `# ${fileName}`;
    setTimeout( () => {
        thumbnail_file.classList.add("push");
    }, 10);
    // thumbnail_file.classList.add("print-feed");
    setTimeout( function () {
        thumbnail_file.classList.remove("print-feed", "push");
        thumbnail_file.classList.add("print");
    }, 500);


    // END NEW LOGIC (TODO!)
    // ##############################################

    return;


    h4.innerHTML = `# ${fileName}`;
    let delay = 0;
    let delayAdds = [];
    let totalDelay = 0;
    let iterations = 50;
    for (let i = 0; i < iterations; i++) {
        let delayAdd = Math.floor(Math.random() * 100) % 2 == 0? 40 : 100;
        delayAdds.push(delayAdd);
        totalDelay += delayAdd;
    }
    for (let i = 0; i < iterations; i++) {
        let shuffledText = textShuffle(textData);
        applyShuffledText(shuffledText, console_pre, delay, totalDelay);
        delay += delayAdds.pop();
    }

    setTimeout(() => {
        // thumbnail_file.classList.add("json-parsed");
        thumbnail_file.classList.add("print");
    }, totalDelay);

    setTimeout(function(){
        pre.innerHTML = textData;
        //console_pre.innerHTML = "Ready!\n\nThe JSON file you uploaded is displayed on the left.\n\nEdit translations in the table below.";
        translationsConsoleService().clear();
        translationsConsoleService().log();

        setProgress("100%");
        // thumbnail_file.classList.add("json-parsed");
        buildTranslationsTable(textData);
    }, totalDelay + 250);
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

            alert_bar.querySelector("h2").innerHTML = errorMsg;

            alert_bar.classList.remove("active", "error", "success");

            if (type.match(/error/i)) {
                alert_bar.classList.add("error");
            } else if (type.match(/success/i)) {
                alert_bar.classList.add("success");
            }

            alert_bar.classList.add("active");

            setTimeout(() => {
                alert_bar.classList.remove("active");
            }, 2500);
        }
    }
}
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
        // paper_content.parentNode.parentNode.classList.remove("file-add");
        let files = this.files;
        for (let file of files) {
            let reader = new FileReader();
            reader.onload = (e) => {
                let textData = e.target.result;
                let checkValid = isValidJSON(textData);
                if (checkValid.valid) {

                    // emptyTranslationsTable();

                   

                    // console.log(e.target);


                    file_name.innerHTML = file.name;

                    translationsService().setTextData(textData);

                    //buildMalenkyFile(file.name, textData.substr(0, 1000), 500);
                    translationsTableService().init(textData);
                    translationsTableService().build(textData);




                    // console.log(translationsService().getTextData());

                    // setTimeout(function() {
                    //       paper_content.parentNode.parentNode.classList.add("file-add");
                    // }, 10);

                    // setTimeout( () => {
                    //      paper_content.parentNode.parentNode.classList.add("file-add");
                    // }, 10);


                    return

                    createThumbnailTextFile(textData, file.name);
                } else {
                    alertService().raise("CUSTOM", {msg: checkValid.error, type: "ERROR"});
                }

            }
            reader.readAsText(file);
        }
    },
    ThumbnailFileExpand(e) {
        e.target.parentNode.classList.toggle("expand");
    },
    // saveTranslationsToJSON () {

    //  let json = translationsService().generateJSON();
    //  console.log(json);

    //  // let translations = flat.unflatten(translationsService().getTranslations());
    //  // let translationsJson = JSON.stringify(translations, null, 4);

    //  // console.log(translationsJson);
    //  //console.log(translationsService().getTranslations());
    // },
    TranslationsTableService() {
        return translationsTableService();
    }
    // toggleConsoleView(e) {
    //  translations_console.classList.toggle("open");
    // },
    // translationService() {
    //  return {
    //      update: (e) => {
    //          console.log(e.target.value);
    //      },
    //      reset: () => {

    //      }
    //  }
    // }
}
