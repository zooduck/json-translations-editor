import {paper_content, paper_title, import_prompt} from "./dom_service";
import {loadingService} from "./loading_service";

import {translationsService} from "./translations_service";

export function malenkyFileService () {
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

            data = JSON.stringify(data);
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

            console.log(translationsService().getTranslations());
            debugger

            loadingService().hide(delay + 1000);
        }
    }
}