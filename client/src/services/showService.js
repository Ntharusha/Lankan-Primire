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
