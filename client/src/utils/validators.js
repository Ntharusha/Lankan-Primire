export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone.replace(/[^\d]/g, ''))
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateMovieTitle = (title) => {
  return title.trim().length > 0 && title.length <= 100
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(price)
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-LK').format(new Date(date))
}
