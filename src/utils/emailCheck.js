import { debounce } from "lodash";

const debouncedValidateEmail = debounce((rule, value, message, resolve, reject) => {
    if(!value) {
        resolve()
    }
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (isValidEmail) {
        resolve();
    } else {
        reject(message);
    }
}, 1000);

export default debouncedValidateEmail