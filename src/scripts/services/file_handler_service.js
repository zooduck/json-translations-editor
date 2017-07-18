// DOM...
import {file_name} from "./dom_service";
// Services...
import {isValidJSON} from "./json_validation_service";
import {loadingService} from "./loading_service";
import {fileService} from "./file_service";
import {translationsService} from "./translations_service";
import {translationsTableService} from "./translations_table_service";
import {localStorageService} from "./local_storage_service";
import {alertService} from "./alert_service";
import {malenkyFileService} from "./malenky_file_service";

export const fileHandlerService = function (e) {

    e.preventDefault();  

    loadingService().setLoading();

    let files = e.target.files;
    for (let file of files) {
        
        let reader = new FileReader();
        
        reader.onload = (e) => {
 
            let textData = e.target.result;
            let exportedTextData = e.target.result;
            let importedTextData = e.target.result;
            
            let checkValid = isValidJSON(textData);

            if (checkValid.valid) {

                fileService().setFile(file);

                file_name.innerHTML = fileService().getFile().name;

                translationsService().pushFile(file);
                translationsService().setTranslations(textData, true);          

                translationsTableService().init(textData);

                localStorageService().clear();
                localStorageService().setLocalStorage();
                localStorageService().setLocalStorageItem("JTE_FILENAME", file.name);
                
                malenkyFileService().build(translationsService().getTranslations().export, file.name);

                let interval = setInterval(function(){
                if (loadingService().isLoading()) {                     
                        translationsTableService().build(translationsService().getTranslations());
                        clearInterval(interval);
                    }
                }, 10);
            } else {
                alertService().raise("CUSTOM", {msg: `${checkValid.error}`, type: "ERROR"});   
            }
        }        
        reader.readAsText(file);
    }
};
