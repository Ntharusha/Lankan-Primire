import logo from './logo.svg'
import marvelLogo from './marvelLogo.svg'
import googlePlay from './googlePlay.svg'
import appStore from './appStore.svg'
import screenImage from './screenImage.svg'
import profile from './profile.png'

export const assets = {
    logo,
    marvelLogo,
    googlePlay,
    appStore,
    screenImage,
    profile
}

export const dummyTrailers = [
    {
        image: "https://img.youtube.com/vi/kPummbLKlts/maxresdefault.jpg",
        videoUrl: 'https://www.youtube.com/watch?v=kPummbLKlts' // Moda Tharindu
    },
    {
        image: "https://img.youtube.com/vi/wZq_svKB0KQ/maxresdefault.jpg",
        videoUrl: 'https://www.youtube.com/watch?v=wZq_svKB0KQ' // Father
    },
    {
        image: "https://img.youtube.com/vi/ztTmdYoNsxA/maxresdefault.jpg",
        videoUrl: 'https://www.youtube.com/watch?v=ztTmdYoNsxA' // Neera
    },
    {
        image: "https://img.youtube.com/vi/O3d5JQzWnq4/maxresdefault.jpg",
        videoUrl: 'https://www.youtube.com/watch?v=O3d5JQzWnq4' // OIC Gadafi
    },
]

const dummyCastsData = [
    { "name": "Ranjan Ramanayake", "profile_path": "https://image.tmdb.org/t/p/original/6Ksb8ANhhoWWGnlM6O1qrySd7e1.jpg", },
    { "name": "Uddika Premarathna", "profile_path": "https://image.tmdb.org/t/p/original/snk6JiXOOoRjPtHU5VMoy6qbd32.jpg", },
    { "name": "Shanudrie Priyasad", "profile_path": "https://image.tmdb.org/t/p/original/usWnHCzbADijULREZYSJ0qfM00y.jpg", },
    { "name": "Dilhani Ekanayake", "profile_path": "https://image.tmdb.org/t/p/original/lJm89neuiVlYISEqNpGZA5kTAnP.jpg", },
    { "name": "Jagath Chamila", "profile_path": "https://image.tmdb.org/t/p/original/mGAPQG2OKTgdKFkp9YpvCSqcbgY.jpg", }
]

export const dummyShowsData = [
    {
        "_id": "s001",
        "id": 1001,
        "title": "Moda Tharindu (මෝඩ තරිඳු)",
        "overview": "A compelling story directed by Thisara Imbulana, exploring modern social themes in Sri Lanka.",
        "poster_path": "https://img.youtube.com/vi/kPummbLKlts/hqdefault.jpg",
        "backdrop_path": "https://img.youtube.com/vi/kPummbLKlts/maxresdefault.jpg",
        "genres": [
            { "id": 18, "name": "Drama" },
            { "id": 35, "name": "Comedy" }
        ],
        "casts": dummyCastsData,
        "release_date": "2025-08-22",
        "original_language": "si",
        "tagline": "Releasing Soon in Cinemas!",
        "vote_average": 8.2,
        "vote_count": 1200,
        "runtime": 125,
    },
    {
        "_id": "s002",
        "id": 1002,
        "title": "Father (ෆාදර්)",
        "overview": "A gripping dramatic film featuring Saumya Liyanage and Dilhani Ekanayake.",
        "poster_path": "https://img.youtube.com/vi/wZq_svKB0KQ/hqdefault.jpg",
        "backdrop_path": "https://img.youtube.com/vi/wZq_svKB0KQ/maxresdefault.jpg",
        "genres": [
            { "id": 18, "name": "Drama" }
        ],
        "casts": dummyCastsData,
        "release_date": "2025-09-05",
        "original_language": "si",
        "tagline": "විනිශ්චය අවි-නිශ්චිතය !",
        "vote_average": 7.5,
        "vote_count": 850,
        "runtime": 118,
    },
    {
        "_id": "s003",
        "id": 1003,
        "title": "Neera (නීරා)",
        "overview": "A romantic tale starring Shanudrie Priyasad and Zenith, bringing a fresh perspective to love.",
        "poster_path": "https://img.youtube.com/vi/ztTmdYoNsxA/hqdefault.jpg",
        "backdrop_path": "https://img.youtube.com/vi/ztTmdYoNsxA/maxresdefault.jpg",
        "genres": [
            { "id": 10749, "name": "Romance" },
            { "id": 18, "name": "Drama" }
        ],
        "casts": dummyCastsData,
        "release_date": "2025-07-04",
        "original_language": "si",
        "tagline": "ප්‍රේමයේ අලුත්ම අත්දැකීම.",
        "vote_average": 7.9,
        "vote_count": 940,
        "runtime": 130,
    }
]

export const dummyDateTimeData = {
    "2025-08-24": [
        { "time": "2025-08-24T10:30:00.000Z", "showId": "s001" },
        { "time": "2025-08-24T14:30:00.000Z", "showId": "s002" }
    ],
    "2025-08-25": [
        { "time": "2025-08-25T10:30:00.000Z", "showId": "s003" }
    ]
}

export const dummyDashboardData = {
    "totalBookings": 42,
    "totalRevenue": 25000,
    "totalUser": 120,
    "activeShows": [
        {
            "_id": "show_001",
            "movie": dummyShowsData[0],
            "showDateTime": "2025-08-24T10:30:00.000Z",
            "showPrice": 800,
            "occupiedSeats": { "A1": "user_1", "A2": "user_1" },
        }
    ]
}

export const dummyBookingData = [
    {
        "_id": "b001",
        "user": { "name": "SriLankanFan", },
        "show": {
            _id: "show_001",
            movie: dummyShowsData[0],
            showDateTime: "2025-08-24T10:30:00.000Z",
            showPrice: 800,
        },
        "amount": 1600,
        "bookedSeats": ["A1", "A2"],
        "isPaid": true,
    }
]