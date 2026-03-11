// import { useContext } from 'react'
// import { AuthContext } from '../context/AuthContext'

export const useAuth = () => {
  // const auth = useContext(AuthContext)
  // if (!auth) {
  //   throw new Error('useAuth must be used within AuthProvider')
  // }
  // return auth

  // Placeholder until AuthContext is created
  return {
    user: null,
    loading: false,
    login: async () => { },
    logout: async () => { },
    isAuthenticated: false,
  }
}
