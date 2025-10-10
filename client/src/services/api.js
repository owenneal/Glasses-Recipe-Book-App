//  api for client to back end server communication
// using axios for HTTP requests
// end point functions would go here




import axios from 'axios';

// this is to handle different base URLs for local dev and production
// caused a lot of headache trying to figure out why requests were failing when testing after running in docker
const getApiBaseUrl = () => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:5000';
    }
    return process.env.REACT_APP_API_URL;
}


const api = axios.create({
    baseURL: `${getApiBaseUrl()}/api`,
    headers: { 'Content-Type': 'application/json' }
});


// example API function
export const fetchExampleData = async () => {
    try {
        const response = await api.get('/example');
        return response.data;
    } catch (error) {
        console.error('Error fetching example data:', error);
        throw error;
    }
};

export default api;


