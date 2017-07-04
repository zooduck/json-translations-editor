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
                if (file) {
                    return file.name;
                }
                return localStorage.getItem("JSON_TRANSLATIONS_EDITOR_FILENAME");
            }
        }
    }
})();