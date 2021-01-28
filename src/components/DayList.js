import React from "react";

import DayListItem from "./DayListItem";

export default function DayList(props) {
  const days = props.days.map((day) => {
    return (
      <DayListItem
        name={day.name}
        spots={day.spots}
        key={day.id}
        selected={day.name === props.day}
        setDay={props.setDay}
      ></DayListItem>
    );
  });
  return <ul>{days}</ul>;
}
