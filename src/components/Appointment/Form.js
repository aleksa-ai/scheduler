import React, {useState} from 'react'

import InterviewerList from "../InterviewerList"

import Button from "../Button"

export default function Form(props){
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState('');
  const reset = () => {
    props.onCancel();
    setName("");
    setInterviewer(null);
  }

  function validate() {
    if (name === '') {
      setError('Student name cannot be blank');
      return;
    }

    props.onSave(name, interviewer);
  }

  return(
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            data-testid="student-name-input"
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={(event) => setName(event.target.value)}          
          />
        </form>
        <section className='appointment__validation'>{error}</section>
        <InterviewerList 
          interviewers={props.interviewers} 
          value={interviewer} 
          onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={reset}>Cancel</Button>
          <Button confirm onClick={() => validate()}>Save</Button>
        </section>
      </section>
    </main>
  );
}