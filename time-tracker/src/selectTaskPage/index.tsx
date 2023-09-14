import React from "react";

export const SelectTaskPage = () => {
  return (
    <div>
      <span style={{ fontSize: "18px", padding: "18px" }}>
        Please select project then task in project todo
      </span>
      <label htmlFor="project">Select Project</label>
      <select id="project">
        <option>all</option>
      </select>

      <label htmlFor="task">Select Task</label>
      <select id="task">
        <option>all</option>
      </select>
    </div>
  );
};
