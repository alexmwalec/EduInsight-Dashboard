//I have used react calendar 
import React, { useState } from "react";
import { Calendar } from "react-calendar";
import { render } from "react-dom";
import "react-calendar/dist/Calendar.css"; 

const ReactCalendar = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">Calendar</h2>
        <Calendar onChange={onChange} value={date} className="react-calendar" />
        <p className="mt-4 text-center text-gray-600">
          Selected Date: <span className="font-medium">{date.toDateString()}</span>
        </p>
      </div>
    </div>
  );
};

render(<ReactCalendar />, document.querySelector("#root"));
