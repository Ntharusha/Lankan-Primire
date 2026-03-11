import apiClient from './api';

export const getAllMovies = async () => {
    const response = await apiClient.get('/movies');
    return response;
};

export const getMovieById = async (id) => {
    const response = await apiClient.get(`/movies/${id}`);
    return response;
};
