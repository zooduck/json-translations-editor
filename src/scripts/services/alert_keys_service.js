import flat from "flat";

export function alertKeysService () {
    let table = {
        ERROR: {
            GENERIC: "Sorry but you must have broken something init!",
            NO_TRANSLATIONS_TO_SAVE: "There are no translations to save!"
        },
        SUCCESS: {
            GENERIC: "Success!"
        }
    }
    return {
        getMsg: (key) => {
            return flat(table)[key];
            
            // let prefix = "";
            // if (key.match(/ERROR/)) {
            //     prefix = "<i class=\"ion-md-warning\">ERROR!</i>";
            // }
            // if (key.match(/SUCCESS/)) {
            //     prefix = "<i class=\"ion-md-information-circle\">SUCCESS!</i>";
            // }
            // return `${prefix}<div>${flat(table)[key]}</div>`;
        }
    }
}