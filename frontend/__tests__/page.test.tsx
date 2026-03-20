import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home Page', () => {
  it('renders the main heading correctly', () => {
    // Basic test to ensure the page renders without crashing
    render(<Home />);
    expect(screen.getByText('Med-Sync')).toBeTruthy();
  });

  it('contains the file upload input', () => {
    render(<Home />);
    const fileInput = screen.getByLabelText(/Upload prescription image/i);
    expect(fileInput).toBeTruthy();
  });
});
