import React from "react";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from './Form';
import Status from './Status';


import "./styles.scss";

import useVisualMode from "../../hooks/useVisualMode"

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";


export default function Appointment(props){
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };

    //Show SAVING indicator before calling props.bookInterview
    transition(SAVING);

    props.bookInterview(props.id, interview).then(() => transition(SHOW));

  } 

  return(
    <article className="appointment">
      <Header time={props.time}/>
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SAVING && <Status message={'Saving'} />}
        {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer}
        />
        )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave= {save}
          onCancel={() => back()}
        />
      )}  
    </article>
  );
}
