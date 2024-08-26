import axios from "axios"

const getIPAddress = async () => {
    try {
        const { data } = await axios.get("https://api64.ipify.org?format=json")
        return data
    } catch (error) {
        console.log(error)
    }
}

export default getIPAddress