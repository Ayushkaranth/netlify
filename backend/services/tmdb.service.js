// import axios from "axios";
// import { ENV_VARS } from "../config/envVars.js";

// export const fetchFromTMDB = async (url) => {
//     const options = {
//         headers: {
//           accept: 'application/json',
//           Authorization: 'Bearer '+ENV_VARS.TMDB_API_KEY,
//         }
//       };
      
//     const response = await axios.get(url,options)

//     if(response.status !==200){
//         throw new Error("failed to fetch the data from TMDB"+response.statusText);
//     }

//     return response.data;
// };

// import axios from "axios";
// import { ENV_VARS } from "../config/envVars.js";

// export const fetchFromTMDB = async (url) => {
//     const options = {
//         headers: {
//             accept: 'application/json',
//             Authorization: 'Bearer ' + ENV_VARS.TMDB_API_KEY,
//         },
//         timeout: 10000, // Set a timeout of 10 seconds
//     };

//     try {
//         const response = await axios.get(url, options);

//         if (response.status !== 200) {
//             throw new Error(`Failed to fetch the data from TMDB: ${response.statusText}`);
//         }

//         return response.data;
//     } catch (error) {
//         if (error.code === 'ECONNRESET') {
//             console.error("Connection was reset while fetching data from TMDB:", error.message);
//         } else if (error.response && error.response.status === 429) {
//             console.error("Rate limit exceeded:", error.response.data);
//         } else {
//             console.error("Error fetching data from TMDB:", error.message);
//         }
//         throw error; // Re-throw the error to the controller for proper response handling
//     }
// };

import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

export const fetchFromTMDB = async (url) => {
    const options = {
        headers: {
            accept: "application/json",
            Authorization: "Bearer " + ENV_VARS.TMDB_API_KEY,
        },
        timeout: 10000, // Timeout of 10 seconds
    };

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const response = await axios.get(url, options);

            if (response.status !== 200) {
                throw new Error(`Failed to fetch data from TMDB: ${response.statusText}`);
            }

            return response.data; // Return the data if successful
        } catch (error) {
            if (error.code === "ECONNRESET") {
                console.error(`Connection was reset. Retrying (${attempt + 1}/${maxRetries})...`);
                attempt++;
                await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
            } else {
                console.error("Error fetching data from TMDB:", error.message);
                throw error; // Re-throw for non-retryable errors
            }
        }
    }

    throw new Error("Failed to fetch data from TMDB after multiple retries.");
};

export const fetchFromTMDBWithCache = async (url) => {
    const cachedData = cache.get(url);
    if (cachedData) {
        console.log(`Cache hit for URL: ${url}`);
        return cachedData;
    }

    console.log(`Cache miss for URL: ${url}. Fetching from TMDB...`);
    const data = await fetchFromTMDB(url);
    cache.set(url, data);
    return data;
};