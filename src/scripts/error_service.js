export function errorService () {
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