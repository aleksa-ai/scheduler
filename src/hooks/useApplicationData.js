import { useState, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData(initial) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  // Load information from database on pageload
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(all => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    });
  }, []);

  //Updating Spots Remaining On Client Side
  function getDaysWithUpdatedSpots(appointmentsList, dayName) {
    return state.days.map((day) => {
      if (day.name === dayName){
        let freeSpots = day.appointments.filter((id) => !appointmentsList[id].interview).length;
        return {...day, spots: freeSpots}
      } else {
        return day
      }
    })
  };
  
  // On click of the Save button in form
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };    

    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
        setState(prev => ({
          ...prev,
          appointments,
          days: getDaysWithUpdatedSpots(appointments, state.day)
        }))
    });
  };

  // On click of the Confirm button Delete confirmation
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`).then(() => {
        setState(prev => ({
          ...prev,
          appointments,
          days: getDaysWithUpdatedSpots(appointments, state.day)
        }))
    });
  };

  return { state, setDay, bookInterview, cancelInterview };
}; 