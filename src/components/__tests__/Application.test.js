import React from "react";

import {
  render,
  cleanup,
  act,
  getByText,
  waitForElement,
  fireEvent,
  getAllByTestId,
  prettyDOM,
  getByAltText,
  getByPlaceholderText
} from '@testing-library/react';

import Application from "components/Application";

afterEach(cleanup);

describe('Application', () => {
  it('defaults to Monday and changes the schedule when a new day is selected', () => {
    
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText('Monday')).then(() => {
      fireEvent.click(getByText('Tuesday'));
      expect(getByText('Leopold Silvers')).toBeInTheDocument();
    });
  });

  it('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    
    //Render the Application.
    const { container } = render(<Application />);

    //Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    //Search for 1st element in appointments in  container (Store returned value locally)
    const appointment = getAllByTestId(container, 'appointment')[0];

    //Click the "Add" button on the first empty appointment.
    fireEvent.click(getByAltText(appointment, 'Add'));

    //Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter Student Name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });

    //Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    //Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, 'Save'));

    //Check that the element with the text "Saving" is displayed.
    console.log(prettyDOM(appointment));
  });
});