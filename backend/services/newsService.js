const axios = require("axios");

async function getIndianBusinessNews() {
    const response = await axios.get("https://gnews.io/api/v4/top-headlines", {
        params: {
            country: "in",
            topic: "business",
            max: 5,
            lang: "en",
            apikey: process.env.GNEWS_API
        }
    }
    )
    return response.data.articles;
}

module.exports = { getIndianBusinessNews };