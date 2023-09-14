import React, { useEffect, useState } from "react";
import axios from "axios";
import { rootUrl } from "../login";
import { decryptData } from "../utils/utils";
export const SelectTaskPage = () => {
  const authToken = decryptData("authToken");
  const [projectData, setProjectData] = useState([]);

  const windnowObj: any = window;
  const fetchProject = async () => {
    const response = await axios.get(`${rootUrl}/api/projects`, {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.data.data;
    setProjectData(data);
  };
  const handleChange = (e: any) => {
    const id = e.target.value;
    const projectName =
      e.target.selectedOptions[0].getAttribute("data-project-name");
    windnowObj.selectedProject = { id: id, name: projectName };
  };

  useEffect(() => {
    fetchProject();
  }, []);
  return (
    <div className="main-wrapper">
      <div className="p-3">
        <h6 style={{ fontSize: "18px" }} className="fw-bold mb-3">
          Please select project then task in project todo
        </h6>
        <div className="mb-3">
          <label htmlFor="project" className="mb-1">
            Project
          </label>
          <select className="form-control" id="project" onChange={handleChange}>
            <option value={""}>Select Project</option>
            {projectData &&
              projectData.map((data: any) => {
                return (
                  <option value={data.id} data-project-name={data.name}>
                    {data.name}
                  </option>
                );
              })}
          </select>
        </div>

        <div>
          <label htmlFor="task" className="mb-1">
            Task
          </label>
          <select className="form-control" id="task" disabled>
            <option>all</option>
          </select>
        </div>
      </div>
    </div>
  );
};
