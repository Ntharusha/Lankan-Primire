import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VibeQuiz from '../VibeQuiz';

const mockMovies = [
    { _id: '1', title: 'Action Movie', poster_path: '/poster1.jpg' },
    { _id: '2', title: 'Comedy Movie', poster_path: '/poster2.jpg' }
];

describe('VibeQuiz Component', () => {
    it('renders the first question properly on load', () => {
        render(
            <BrowserRouter>
                <VibeQuiz movies={mockMovies} onClose={vi.fn()} />
            </BrowserRouter>
        );
        
        expect(screen.getByText('Your ideal snack for today?')).toBeInTheDocument();
    });

    it('navigates to the next question when an option is selected', async () => {
        render(
            <BrowserRouter>
                <VibeQuiz movies={mockMovies} onClose={vi.fn()} />
            </BrowserRouter>
        );

        // Click on the first option
        const option = screen.getByText('Spicy Volcano Ramen');
        fireEvent.click(option);

        // Assert that state progresses
        await waitFor(() => {
            expect(screen.getByText("How's the energy level?")).toBeInTheDocument();
        });
    });

    it('calls onClose callback when the X button is clicked', () => {
        const handleClose = vi.fn();
        render(
            <BrowserRouter>
                <VibeQuiz movies={mockMovies} onClose={handleClose} />
            </BrowserRouter>
        );

        // The X button should have an accessible element to close, usually a button with standard class or SVG but we can query by nearest class
        // Since VibeQuiz has a <button onClick={onClose}> with an X icon, we can query by role
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]); // X is the first button typically
        
        expect(handleClose).toHaveBeenCalled();
    });
});
