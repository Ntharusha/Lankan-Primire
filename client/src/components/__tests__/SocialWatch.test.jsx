import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SeatMap from '../SeatMap';

describe('SeatMap Social Watch Parties Component', () => {
    it('ranks friend seats with a visual indicator and name', () => {
        const mockSeatGrid = [[
            { seatNumber: 'A1', isAvailable: true, isLocked: false, category: 'ODC' },
            { seatNumber: 'A2', isAvailable: false, isLocked: false, category: 'ODC' }
        ]];
        
        const mockFriends = [
            { seatNumber: 'A2', friendName: 'Ntharusha' }
        ];

        // Since it's SVG, we check for text mapping in the component
        const { container } = render(
            <SeatMap 
                seatGrid={mockSeatGrid} 
                selectedSeats={[]} 
                onSeatClick={vi.fn()} 
                friendsSeats={mockFriends} 
            />
        );

        // Check if friend name 'Ntharusha' is rendered in the SVG
        expect(screen.getByText('Ntharusha')).toBeInTheDocument();
        
        // Find the 'Friend' legend
        expect(screen.getByText('Friend')).toBeInTheDocument();
    });
});
