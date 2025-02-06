import axios from "axios";

export const BASE_URL = "https://youtube-v31.p.rapidapi.com/";

const options = {
  params: {
    maxResults: "48",
  },
  headers: {
    "x-rapidapi-key": process.env.REACT_APP_RAPID_API_KEY,
    "x-rapidapi-host": "youtube-v31.p.rapidapi.com",
  },
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, retries = 3, backoff = 300) => {
  try {
    const response = await axios.get(url, options);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      await delay(backoff);
      return fetchWithRetry(url, retries - 1, backoff * 2);
    }
    throw error;
  }
};

export const fetchFromAPI = async (url) => {
  try {
    const data = await fetchWithRetry(`${BASE_URL}/${url}`);
    return data;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
};
