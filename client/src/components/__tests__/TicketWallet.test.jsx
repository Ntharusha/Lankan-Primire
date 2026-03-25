import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TicketWallet from '../TicketWallet';

describe('TicketWallet Live Canteen Tracker Component', () => {
    it('renders the delivery status correctly based on booking payload', async () => {
        const mockBooking = {
            _id: 'BK12345',
            show: {
                movie: { title: 'Delivery Movie', poster_path: '', backdrop_path: '' },
                showDateTime: new Date().toISOString(),
                theater: 'Screen 1'
            },
            bookedSeats: ['B1', 'B2'],
            canteenOrder: [
                { id: '1', name: 'Popcorn', quantity: 2, price: 500 }
            ],
            canteenStatus: 'delivering'
        };

        render(
            <TicketWallet booking={mockBooking} onClose={vi.fn()} />
        );

        // Click to view Canteen Pass
        const toggleButton = screen.getByText('View Canteen Pass');
        fireEvent.click(toggleButton);

        // Assert tracker points
        await waitFor(() => {
            expect(screen.getByText('En Route')).toBeInTheDocument();
            expect(screen.getByText('Live Seat Delivery Tracker')).toBeInTheDocument();
        });
    });
});
