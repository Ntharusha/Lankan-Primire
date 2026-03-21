const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

export const getPosterUrl = (path) => {
    if (!path) return 'https://placehold.co/500x750?text=No+Poster';
    if (path.startsWith('http') || path.startsWith('/assets/')) return path;
    return `${TMDB_IMAGE_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const getBackdropUrl = (path) => {
    if (!path) return 'https://placehold.co/1920x1080?text=No+Backdrop';
    if (path.startsWith('http') || path.startsWith('/assets/')) return path;
    return `${TMDB_BACKDROP_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const handleImageError = (e) => {
    const placeholder = 'https://placehold.co/500x750?text=No+Poster';
    if (e.target.src !== placeholder) {
        e.target.src = placeholder;
    }
};
