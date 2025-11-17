import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { ProfilePage } from '../../routes/ProfilePage';

describe('ProfilePage', () => {
  it('should render the profile page', async () => {
    await render(<ProfilePage />);
    expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });
});
