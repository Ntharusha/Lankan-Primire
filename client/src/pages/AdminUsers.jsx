import React, { useState, useEffect } from 'react'
import apiClient from '../services/api'
import {
    Users,
    Mail,
    Trash2,
    Shield,
    Activity,
    Calendar,
    Search,
    Filter
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const AdminUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState('all')

    const fetchUsers = async () => {
        try {
            const data = await apiClient.get('/users')
            setUsers(data)
        } catch (error) {
            console.error('Failed to load users', error)
            toast.error('Failed to load patrons')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to remove this patron? This action cannot be undone.')) {
            try {
                await apiClient.delete(`/users/${id}`)
                setUsers(users.filter(u => u._id !== id))
                toast.success('Patron removed successfully')
            } catch (error) {
                toast.error(error.message || 'Failed to remove patron')
            }
        }
    }

    const handleRoleChange = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin'
        if (window.confirm(`Are you sure you want to make this user an ${newRole}?`)) {
            try {
                await apiClient.put(`/users/${user._id}/role`, { role: newRole })
                setUsers(users.map(u => u._id === user._id ? { ...u, role: newRole } : u))
                toast.success(`User role updated to ${newRole}`)
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to update role')
            }
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filter === 'all' || user.role === filter
        return matchesSearch && matchesFilter
    })

    if (loading) return <div className="p-24 text-center text-primary font-black animate-pulse uppercase tracking-[0.5em]">Synchronizing Patrons...</div>

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Member Registry</span>
                    </div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter italic">Cinema <span className="text-gradient">Patrons</span></h1>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Name or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full glass-card pl-16 pr-6 py-5 rounded-[2rem] border-white/5 outline-none font-black uppercase text-xs tracking-widest placeholder:text-gray-700"
                    />
                </div>

                <div className="lg:w-64 relative group">
                    <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={20} />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full glass-card pl-16 pr-6 py-5 rounded-[2rem] border-white/5 outline-none font-black uppercase text-xs tracking-widest appearance-none cursor-pointer"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admins</option>
                        <option value="user">Standard</option>
                    </select>
                </div>
            </div>

            <div className="glass-card rounded-[3rem] overflow-hidden border-white/5 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-600 uppercase tracking-widest bg-white/[0.01]">
                                <th className="px-10 py-8 text-left">Patron ID</th>
                                <th className="px-10 py-8 text-left">Identity</th>
                                <th className="px-10 py-8 text-left">Access Level</th>
                                <th className="px-10 py-8 text-left">Joined</th>
                                <th className="px-10 py-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {filteredUsers.map((user) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key={user._id}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-10 py-8 whitespace-nowrap text-xs font-black text-gray-500 tracking-widest">#{user._id.slice(-8).toUpperCase()}</td>
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center border border-primary/20">
                                                    <span className="text-primary font-black uppercase">{user.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white group-hover:text-primary transition-colors uppercase tracking-tight italic">{user.name}</p>
                                                    <p className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest border ${user.role === 'admin'
                                                    ? 'bg-primary/10 text-primary border-primary/20'
                                                    : 'bg-nebula-accent/10 text-nebula-accent border-nebula-accent/20'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase">
                                                <Calendar size={14} className="text-primary" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleRoleChange(user)}
                                                    className="p-3 glass-card rounded-xl hover:text-white transition-colors border-none"
                                                    title={`Change to ${user.role === 'admin' ? 'User' : 'Admin'}`}
                                                >
                                                    <Shield size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="p-3 glass-card rounded-xl hover:text-red-500 transition-colors border-none"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminUsers
