import apiClient from './api';

export const getShowById = async (id) => {
    const response = await apiClient.get(`/shows/${id}`);
    return response;
};

export const getAllShows = async () => {
    const response = await apiClient.get('/shows');
    return response;
};

export const getShowsByMovieId = async (movieId) => {
    const response = await apiClient.get(`/shows/movie/${movieId}`);
    return response;
};

export const createShow = async (showData) => {
    const response = await apiClient.post('/shows', showData);
    return response;
};

export const updateShow = async (id, showData) => {
    const response = await apiClient.put(`/shows/${id}`, showData);
    return response;
};

export const deleteShow = async (id) => {
    const response = await apiClient.delete(`/shows/${id}`);
    return response;
};
