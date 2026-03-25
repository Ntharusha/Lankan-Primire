import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import { useAuth } from '../../context/AuthContext';

vi.mock('../../context/AuthContext', () => ({
    useAuth: vi.fn()
}));

const renderWithContext = (component, user) => {
    useAuth.mockReturnValue({
        user,
        logout: vi.fn(),
        login: vi.fn()
    });
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('AdminLayout Component', () => {
    it('renders the sidebar navigation items', () => {
        renderWithContext(<AdminLayout />, { name: 'Admin User', role: 'admin' });
        
        // Assertions for standard links
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Movies')).toBeInTheDocument();
        expect(screen.getByText('Shows')).toBeInTheDocument();
        expect(screen.getByText('Patrons')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('displays the Lankan HQ branding correctly', () => {
        renderWithContext(<AdminLayout />, { name: 'Admin', role: 'admin' });
        expect(screen.getByText('Command Center')).toBeInTheDocument();
    });
});
