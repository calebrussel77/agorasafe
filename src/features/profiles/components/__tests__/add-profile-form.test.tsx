import { render, screen } from '@testing-library/react';

import { AddProfileForm } from '../add-profile-form';

const onSubmit = jest.fn();

describe('Add new profile - test', () => {
  it('should render on the screen', () => {
    render(
      <AddProfileForm
        onSubmit={onSubmit}
        isLoading={false}
        error={null}
        selectedProfile="CUSTOMER"
      />
    );
    const formElement = screen.getByLabelText(/add_profile_form_test_id/);
    expect(formElement).toBeInTheDocument();
  });
});
