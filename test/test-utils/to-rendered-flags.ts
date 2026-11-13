// `useFlags` projects a subset of each stored flag (see UseFlagsReturn in react.tsx):
// `id` and `name` are internal to the flag store and are not rendered. Strip them so
// state fixtures can be compared against what the hook actually returns.
const NOT_PROJECTED_BY_USE_FLAGS = ['id', 'name'];

export default function toRenderedFlags(obj: Record<string, any>) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    const newObj: Record<string, any> = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (!NOT_PROJECTED_BY_USE_FLAGS.includes(key)) {
                newObj[key] = toRenderedFlags(obj[key]);
            }
        }
    }

    return newObj;
}
