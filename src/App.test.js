import { render, screen } from '@testing-library/react';
import Scatterplotb from './Scatterplotb';

test('renders learn react link', () => {
  render(<Scatterplotb />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
