/* eslint-disable testing-library/render-result-naming-convention */
import { fakerFR as faker } from '@faker-js/faker';
import { ProfileType } from '@prisma/client';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AddProfileForm } from '../add-profile-form';

const mockSubmit = jest.fn();

// setup userEvent
function setup(jsx: JSX.Element | React.ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

const buildForm = (overrides?: object) => ({
  name: faker.internet.displayName(),
  ...overrides,
});

describe('Add new profile form', () => {
  it('should render on the screen', () => {
    setup(
      <AddProfileForm
        onSubmit={mockSubmit}
        isLoading={false}
        error={null}
        selectedProfile={ProfileType.CUSTOMER}
      />
    );
    const formElement = screen.getByLabelText(/add_profile_form_test_id/i);
    expect(formElement).toBeInTheDocument();
  });

  it('should disabled the profile type section initially', () => {
    setup(
      <AddProfileForm
        onSubmit={mockSubmit}
        isLoading={false}
        error={null}
        selectedProfile={ProfileType.CUSTOMER}
      />
    );

    const radioGroupElements = screen.getAllByRole('radio', {
      name: /radio_profile_item/i,
    });
    expect(radioGroupElements[0]).toBeDisabled();
    expect(radioGroupElements[1]).toBeDisabled();
  });

  it('should disabled the form submit button when isLoading = true and the form is submitted', async () => {
    setup(
      <AddProfileForm
        onSubmit={mockSubmit}
        isLoading={true}
        error={null}
        selectedProfile={ProfileType.CUSTOMER}
      />
    );

    const user = userEvent.setup();
    const buttonElement = screen.getByRole('button', {
      name: /Créer un nouveau profil/i,
    });

    await user.click(buttonElement);
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should submit the form when passing the profile type and the name', async () => {
    const { user } = setup(
      <AddProfileForm
        onSubmit={mockSubmit}
        isLoading={false}
        error={null}
        selectedProfile={ProfileType.CUSTOMER}
      />
    );
    const { name } = buildForm();
    const profile_type = ProfileType.CUSTOMER;

    await user.type(screen.getByRole('textbox'), name);
    await user.click(
      screen.getByRole('button', {
        name: /Créer un nouveau profil/i,
      })
    );
    expect(mockSubmit).toHaveBeenCalledWith({ name, profile_type });
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});
