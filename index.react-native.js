
const core = require('./flagsmith-core');
export default core({});
export const createFlagsmithInstance = ()=>{
    return core({})
}
