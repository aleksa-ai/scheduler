import React from "react";

import "components/DayListItem.scss";

import classNames from 'classnames/bind';


export default function DayListItem(props) {
  const dayclass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });

  const daysremaining = function (spots) {
    if (spots === 0) return "no spots remaining"
    if (spots === 1) return "1 spot remaining"
    return `${spots} spots remaining`

  }

  return (
    <li className = {dayclass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{daysremaining(props.spots)}</h3>
    </li>
  );
}