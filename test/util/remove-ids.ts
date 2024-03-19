export default function removeIds(obj: Record<string, any>) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    const newObj:Record<string, any> = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (key !== 'id') {
                newObj[key] = removeIds(obj[key]);
            }
        }
    }

    return newObj;
}
