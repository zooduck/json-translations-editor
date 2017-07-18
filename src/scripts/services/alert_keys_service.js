import flat from "flat";

export function alertKeysService () {
    let table = {
        ERROR: {
            GENERIC: "Sorry but you must have broken something init!",
            NO_TRANSLATIONS_TO_SAVE: "There are no translations to save!",
            NO_TRANSLATIONS_TO_EXPORT: "There are no translations to export!"
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