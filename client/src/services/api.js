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


api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
    }, error => {
    return Promise.reject(error);
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



export const getAllMyRecipes = async () => {
    try {
        const response = await api.get('/profile');
        return response.data.recipes;
    } catch (error) {
        console.error('Error fetching all my recipes:', error);
        throw error;
    }
}

export const createRecipe = async (recipeData) => {
    try {
        const response = await api.post('/recipes', recipeData);
        return response.data;
    } catch (error) {
        console.error('Error creating recipe:', error);
        throw error;
    }
};


export const updateRecipe = async (id, recipeData) => {
    try {
        const response = await api.put(`/recipes/${id}`, recipeData);
        return response.data;
    } catch (error) {
        console.error('Error updating recipe:', error);
        throw error;
    }
};



export const deleteRecipe = async (id) => {
    try {
        const response = await api.delete(`/recipes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting recipe:', error);
        throw error;
    }
};



export const rateRecipe = async (id, rating) => {
    try {
        const response = await api.post(`/recipes/${id}/rate`, { rating });
        return response.data;
    } catch (error) {
        console.error('Error rating recipe:', error);
        throw error;
    }
};



export const shareRecipe = async (id, recipientEmail) => {
    try {
        const response = await api.post(`/recipes/${id}/share`, { recipientEmail });
        return response.data;
    } catch (error) {
        console.error('Error sharing recipe:', error);
        throw error;
    }
};

export const toggleFavorite = async (id) => {
    try {
        const response = await api.post(`/recipes/${id}/favorite`);
        return response.data;
    } catch (error) {
        console.error('Error toggling favorite:', error);
        throw error;
    }
};

export const getFavoriteRecipes = async () => {
    try {
        const response = await api.get('/favorites');
        return response.data;
    } catch (error) {
        console.error('Error fetching favorite recipes:', error);
        throw error;
    }
};

export const checkFavoriteStatus = async (id) => {
    try {
        const response = await api.get(`/recipes/${id}/favorite-status`);
        return response.data;
    } catch (error) {
        console.error('Error checking favorite status:', error);
        throw error;
    }
};


export default api;


