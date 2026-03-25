import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecentlyViewedCarousel from '../RecentlyViewedCarousel';

describe('RecentlyViewedCarousel', () => {
    it('returns null if there are no recently viewed movies', () => {
        const { container } = render(
            <BrowserRouter>
                <RecentlyViewedCarousel />
            </BrowserRouter>
        );
        expect(container.firstChild).toBeNull();
    });
});
