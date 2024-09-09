import { parsePhoneNumberFromString } from 'libphonenumber-js';

export default function getPhoneRegex(countryCode) {
  try {
    const exampleNumber = parsePhoneNumberFromString('1234567890', countryCode);
    return new RegExp(exampleNumber.formatNational().replace(/\d/g, '\\d'));
  } catch (e) {
    return null;
  }
}