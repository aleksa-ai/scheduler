export function getAppointmentsForDay(state, day) {
  const stateDay = state.days.find((d) => d.name === day);
  if (state.days.length === 0) return [];
  if (stateDay === undefined) return [];
  const dayAppointments = stateDay.appointments.map(
    (id) => state.appointments[id]
  );
  return dayAppointments;
}

export function getInterview(state, interview) {
  if (!interview) return null;
  return {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer],
  };
}

export function getInterviewersForDay(state, day) {
  const stateDay = state.days.find((d) => d.name === day);
  if (state.days.length === 0) return [];
  if (stateDay === undefined) return [];
  const dayInterviewers = stateDay.interviewers.map(
    (id) => state.interviewers[id]
  );
  return dayInterviewers;
}
