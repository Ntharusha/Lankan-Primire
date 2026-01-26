import logo from './logo.png'
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
        videoUrl: 'https://www.youtube.com/watch?v=kPummbLKlts'
    },
    {
        image: "https://img.youtube.com/vi/wZq_svKB0KQ/maxresdefault.jpg",
        videoUrl: 'https://www.youtube.com/watch?v=wZq_svKB0KQ'
    },
    {
        image: "https://img.youtube.com/vi/ztTmdYoNsxA/maxresdefault.jpg",
        videoUrl: 'https://www.youtube.com/watch?v=ztTmdYoNsxA'
    },
    {
        image: "https://img.youtube.com/vi/O3d5JQzWnq4/maxresdefault.jpg",
        videoUrl: 'https://www.youtube.com/watch?v=O3d5JQzWnq4'
    },
]

const dummyCastsData = [
    { "name": "Ranjan Ramanayake", "profile_path": "https://image.tmdb.org/t/p/original/6Ksb8ANhhoWWGnlM6O1qrySd7e1.jpg" },
    { "name": "Uddika Premarathna", "profile_path": "https://image.tmdb.org/t/p/original/snk6JiXOOoRjPtHU5VMoy6qbd32.jpg" },
    { "name": "Shanudrie Priyasad", "profile_path": "https://image.tmdb.org/t/p/original/usWnHCzbADijULREZYSJ0qfM00y.jpg" },
    { "name": "Dilhani Ekanayake", "profile_path": "https://image.tmdb.org/t/p/original/lJm89neuiVlYISEqNpGZA5kTAnP.jpg" },
    { "name": "Jagath Chamila", "profile_path": "https://image.tmdb.org/t/p/original/mGAPQG2OKTgdKFkp9YpvCSqcbgY.jpg" }
]

export const dummyShowsData = [
    {
        "_id": "s001",
        "id": 1001,
        "title": "Moda Tharindu",
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
        "title": "Father",
        "overview": "A gripping dramatic film featuring Saumya Liyanage and Dilhani Ekanayake.",
        "poster_path": "https://img.youtube.com/vi/wZq_svKB0KQ/hqdefault.jpg",
        "backdrop_path": "https://img.youtube.com/vi/wZq_svKB0KQ/maxresdefault.jpg",
        "genres": [
            { "id": 18, "name": "Drama" }
        ],
        "casts": dummyCastsData,
        "release_date": "2025-09-05",
        "original_language": "si",
        "tagline": "A gripping story of judgment and uncertainty",
        "vote_average": 7.5,
        "vote_count": 850,
        "runtime": 118,
    },
    {
        "_id": "s003",
        "id": 1003,
        "title": "Neera",
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
        "tagline": "A new experience in love",
        "vote_average": 7.9,
        "vote_count": 940,
        "runtime": 130,
    },
    {
        "_id": "s004",
        "id": 1004,
        "title": "OIC Gadafi",
        "overview": "A heartwarming story about family bonds and tradition in rural Sri Lanka.",
        "poster_path": "https://img.youtube.com/vi/O3d5JQzWnq4/hqdefault.jpg",
        "backdrop_path": "https://img.youtube.com/vi/O3d5JQzWnq4/maxresdefault.jpg",
        "genres": [
            { "id": 18, "name": "Drama" },
            { "id": 10749, "name": "Romance" }
        ],
        "casts": dummyCastsData,
        "release_date": "2025-06-15",
        "original_language": "si",
        "tagline": "A story that transcends time",
        "vote_average": 8.5,
        "vote_count": 2100,
        "runtime": 140,
    },
    {
        "_id": "s005",
        "id": 1005,
        "title": "Sanda Pidu",
        "overview": "An action-packed thriller set in the beautiful landscapes of Sri Lanka.",
        "poster_path": "https://img.youtube.com/vi/kPummbLKlts/hqdefault.jpg",
        "backdrop_path": "https://img.youtube.com/vi/kPummbLKlts/maxresdefault.jpg",
        "genres": [
            { "id": 28, "name": "Action" },
            { "id": 53, "name": "Thriller" }
        ],
        "casts": dummyCastsData,
        "release_date": "2025-05-20",
        "original_language": "si",
        "tagline": "Under the moonlight",
        "vote_average": 7.8,
        "vote_count": 1500,
        "runtime": 135,
    },
    {
        "_id": "s006",
        "id": 1006,
        "title": "Hiru Maliga",
        "overview": "A beautiful story about a flower seller who changes lives.",
        "poster_path": "https://img.youtube.com/vi/wZq_svKB0KQ/hqdefault.jpg",
        "backdrop_path": "https://img.youtube.com/vi/wZq_svKB0KQ/maxresdefault.jpg",
        "genres": [
            { "id": 18, "name": "Drama" },
            { "id": 35, "name": "Comedy" }
        ],
        "casts": dummyCastsData,
        "release_date": "2025-04-10",
        "original_language": "si",
        "tagline": "A new day with the sun flower",
        "vote_average": 8.0,
        "vote_count": 1800,
        "runtime": 125,
    },
    {
        "_id": "s007",
        "id": 1007,
        "title": "Paya Enna",
        "overview": "A touching story about sacrifice and love in Sri Lankan society.",
        "poster_path": "https://img.youtube.com/vi/ztTmdYoNsxA/hqdefault.jpg",
        "backdrop_path": "https://img.youtube.com/vi/ztTmdYoNsxA/maxresdefault.jpg",
        "genres": [
            { "id": 18, "name": "Drama" }
        ],
        "casts": dummyCastsData,
        "release_date": "2025-03-25",
        "original_language": "si",
        "tagline": "The gift given for the bite",
        "vote_average": 8.3,
        "vote_count": 2200,
        "runtime": 145,
    },
    {
        "_id": "s008",
        "id": 1008,
        "title": "Ran Sevanella",
        "overview": "A magical fantasy adventure for the whole family.",
        "poster_path": "https://img.youtube.com/vi/O3d5JQzWnq4/hqdefault.jpg",
        "backdrop_path": "https://img.youtube.com/vi/O3d5JQzWnq4/maxresdefault.jpg",
        "genres": [
            { "id": 14, "name": "Fantasy" },
            { "id": 10751, "name": "Family" }
        ],
        "casts": dummyCastsData,
        "release_date": "2025-02-14",
        "original_language": "si",
        "tagline": "Golden Sevanella tonight",
        "vote_average": 7.6,
        "vote_count": 1600,
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
        "user": { "name": "SriLankanFan" },
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
