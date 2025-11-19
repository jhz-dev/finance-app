import { render, screen } from '@tests/test-utils';
import { describe, it, expect } from 'vitest';
import { ProfilePage } from '../../routes/ProfilePage';

describe('ProfilePage', () => {
  it('should render the profile page', async () => {
    await render({ component: ProfilePage });
    expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });
});
