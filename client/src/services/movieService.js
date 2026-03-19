import apiClient from './api';

export const getAllMovies = async (params = {}) => {
    const response = await apiClient.get('/movies', { params });
    return response;
};

export const getMovieById = async (id) => {
    const response = await apiClient.get(`/movies/${id}`);
    return response;
};
