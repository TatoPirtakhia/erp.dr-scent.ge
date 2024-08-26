import cryptoRandomString from 'crypto-random-string';
const generateRandomString = (
  length,
  includeUpperCase,
  includeLowerCase,
  includeNumbers
) => {
  const characters = []
  if (includeUpperCase) {
    characters.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
  }
  if (includeLowerCase) {
    characters.push("abcdefghijklmnopqrstuvwxyz")
  }
  if (includeNumbers) {
    characters.push("0123456789")
  }

  if (characters.length === 0) {
    return ""
  }
  const combinedCharacters = characters.join("")
  const seed = new Date().getTime()
  const currentSeconds = Math.floor(seed / 1000)
  const randomString = cryptoRandomString({
    length,
    characters: combinedCharacters,
    currentSeconds,
  })

  return randomString
}

export default generateRandomString
