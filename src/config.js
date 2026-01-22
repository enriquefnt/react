// src/config.js

// const CONFIG = {
//     API_URL: "https://aerosamec.saltaped.com/api"
// };
const isDev = import.meta.env.DEV;

const CONFIG = {
    API_URL: isDev 
        ? "http://localhost/api-equipo" 
        : "https://aerosamec.saltaped.com/api",
};
export default CONFIG;