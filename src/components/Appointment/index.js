import React from "react";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';


import "./styles.scss";

import useVisualMode from "../../hooks/useVisualMode"

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";


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

  const cancel = () => {
    transition(DELETING);
    props.cancelInterview(props.id).then(() => transition(EMPTY));
  }

  return(
    <article className="appointment">
      <Header time={props.time}/>
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SAVING && <Status message={'Saving'} />}
        {mode === DELETING && <Status message={'Deleting'} />}
        {mode === CONFIRM && (
        <Confirm
          message={'Are you sure you would like to delete?'}
          onConfirm={cancel}
          onCancel={() => back()}
        />
      )}
        {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
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
