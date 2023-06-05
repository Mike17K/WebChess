// Helper Functions
export function validateObj(obj, fields = []) {
    // This function checks for fields in the request
    let containsAllFields = true;
    let notFoundFields = [];
    fields.forEach(field => {
        if (obj[field] === undefined) {
            containsAllFields = false;
            notFoundFields.push(field);
        }
    })
    if (containsAllFields) {
        return true;
    } else {
        console.log("Not found fields: ", notFoundFields);
        return false;
    }
}
