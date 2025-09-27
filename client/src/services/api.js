//  api for client to back end server communication
// using axios for HTTP requests
// end point functions would go here




import axios from 'axios';

const base = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const api = axios.create({
    baseURL: `${base}/api`,
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