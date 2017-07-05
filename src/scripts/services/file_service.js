import {localStorageService} from "./local_storage_service";

export const fileService = (function () {
    let file = null;
    return function () {
       return {
            setFile(data) {
                file = data;
                console.log("file", file);
            },
            getFile() {
                console.log("file", file);
                return file;
            },
            getFileName() {
                // console.log("file", file);
                // console.log("localStorage", localStorage);
                if (file) {
                    return file.name;
                }
                return localStorageService().GetLocalStorage().getItem("JTE_FILENAME");
            }
        }
    }
})();
