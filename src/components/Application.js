import React, { useState, useEffect } from "react";

import axios from 'axios';

import "components/Application.scss";
import "components/Appointment"

import DayList from "components/DayList"
import Appointment from "components/Appointment";

import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors"

export default function Application() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  console.log("State!", state)

  const dailyAppointments = getAppointmentsForDay(state, state.day)

  const setDay = day => setState(prev => ({ ...prev, day }));
  
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      console.log(all)
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    });
  },[]);

  // On click of the Save button in form
  const bookInterview = (id, interview) => {
    //To replace current value of interview key with new value
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    //Use this updated pattern to replace the existing record with matching id
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    //Update function to call setState with new state object
    setState({
      ...state,
      appointments
    });

    //Request to API to update appointment with interview
    return axios.put(`/api/appointments/${id}`, { interview }).then(response => {
    });
  }

  const schedule = dailyAppointments.map((appointment) =>{
    const interview = getInterview(state, appointment.interview);
    return(<Appointment 
      key={appointment.id} 
      id={appointment.id}
      time={appointment.time}
      interviewers = {getInterviewersForDay(state, state.day)}
      bookInterview={bookInterview}
      interview={interview} 
      />)
  });

  return (
    <main className="layout">
      <section className="sidebar">
      <img
  className="sidebar--centered"
  src="images/logo.png"
  alt="Interview Scheduler"
/>
<hr className="sidebar__separator sidebar--centered" />
<nav className="sidebar__menu">
<DayList
  days={state.days}
  day={state.day}
  setDay={setDay}
/>
</nav>
<img
  className="sidebar__lhl sidebar--centered"
  src="images/lhl.png"
  alt="Lighthouse Labs"
/>
      </section>
      <section className="schedule">
        {schedule}
        
      </section>
    </main>
  );
}
