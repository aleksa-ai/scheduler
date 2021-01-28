import React from "react";
import axios from 'axios';


import {
  render,
  cleanup,
  act,
  getByText,
  queryByText,
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
    
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment')[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter Student Name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });

    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, 'Lydia Miller-Jones'));

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();
  });

  it('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(
      container,
      'appointment'
    ).find(appointment => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, 'Are you sure you would like to delete?')
    ).toBeInTheDocument();

    // 5. Click the "Confirm button".
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, 'Add'));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();
  });

  it('loads data, edits an interview and keeps the spots remaining for Monday the same', async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(
      container,
      'appointment'
    ).find(appointment => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(getByAltText(appointment, 'Edit'));

    // 4. Change the name to Lydia Miller-Jones.
    fireEvent.change(getByPlaceholderText(appointment, /enter Student Name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });

    // 5. Change the interviewer to Tori Malcom
    fireEvent.click(getByAltText(appointment, 'Tori Malcolm'));

    // // 6. Click the "Save" button.
    fireEvent.click(getByText(appointment, 'Save'));

    // // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    // 8. Wait until the appointment with 'Lydia Miller-Jones is displayed.
    await waitForElement(() => queryByText(appointment, 'Lydia Miller-Jones'));

    // 9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });

  it('shows the save error when failing to save an appointment', async () => {
    axios.put.mockRejectedValueOnce();

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment')[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter Student Name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });

    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, 'Error'));

    fireEvent.click(getByAltText(appointment, 'Close'));

    expect(getByAltText(appointment, 'Add')).toBeInTheDocument();
  });

  it('shows the delete error when failing to delete an existing appointment', async () => {
    axios.delete.mockRejectedValueOnce();

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(
      container,
      'appointment'
    ).find(appointment => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(getByAltText(appointment, 'Delete'));

    expect(
      getByText(appointment, 'Are you sure you would like to delete?')
    ).toBeInTheDocument();

    fireEvent.click(getByText(appointment, 'Confirm'));

    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, 'Error'));

    fireEvent.click(getByAltText(appointment, 'Close'));

    expect(getByText(appointment, 'Archie Cohen')).toBeInTheDocument();
  });
});