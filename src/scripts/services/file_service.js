import {localStorageService} from "./local_storage_service";

export const fileService = (function () {
    let file = null;
    return function () {
       return {
            setFile(data) {
                file = data;
            },
            getFile() {
                return file;
            },
            getFileName() {
                if (file) {
                    return file.name;
                }
                return localStorageService().GetLocalStorage().getItem("JTE_FILENAME");
            }
        }
    }
})();
