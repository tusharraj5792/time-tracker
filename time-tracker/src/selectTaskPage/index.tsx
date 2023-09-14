import React from "react";

export const SelectTaskPage = () => {
  return (
    <div className="main-wrapper">
      <div className="p-3">
        <h6 style={{ fontSize: "18px" }} className="fw-bold mb-3">
          Please select project then task in project todo
        </h6>
        <div className="mb-3">
          <label htmlFor="project" className="mb-1">Project</label>
          <select className="form-control" id="project">
            <option>all</option>
          </select>
        </div>

        <div>
          <label htmlFor="task" className="mb-1">Task</label>
          <select className="form-control" id="task">
            <option>all</option>
          </select>
        </div>

      </div>
    </div>
  );
};
