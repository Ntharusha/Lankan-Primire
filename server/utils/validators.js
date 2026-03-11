const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone.replace(/[^\d]/g, ''))
}

const validatePassword = (password) => {
  return password.length >= 6
}

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword,
}
