export function isValidJSON (data) {
    try {
        JSON.parse(data);
    }
    catch (error) {
        return {valid: false, error: error.message}
    }
    return {valid: true, error: null}
}
