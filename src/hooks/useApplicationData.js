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
      return axios.get('/api/days').then((resp) => {
        setState(prev => ({
          ...prev,
          appointments,
          days: resp.data
        }))
      })
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
      return axios.get('/api/days').then((resp) => {
        setState(prev => ({
          ...prev,
          appointments,
          days: resp.data
        }))
      })
    });
  };

  return { state, setDay, bookInterview, cancelInterview };
}; 