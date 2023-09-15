import { useEffect, useState } from "react";
import axios from "axios";
import { rootUrl } from "../login";
import { decryptData } from "../utils/utils";

interface taskType {
  assignedTo: number;
  assigneeName: string;
  createdBy: number;
  description: string;
  estimatedTime: string;
  flowStatusId: string;
  id: number;
  orderIndex: any;
  sprintId: number;
  tagId: number;
  taskPriorityColor: string;
  taskPriorityIcon: string;
  taskPriorityId: number;
  taskPriorityName: string;
  taskTypeId: number;
  title: string;
  trackingStatusId: number;
}
interface propsType{
  isProjectSelected?:boolean
  projectId?:number
  setProjectData:(id:any)=>void
  projectData:any
  handleClick:(id:number)=>void
}
export const SelectTaskPage = ({projectId, isProjectSelected,projectData,setProjectData ,handleClick}:propsType) => {
  const authToken = decryptData("authToken");
  const [allTask, setAllTask] = useState<
    Array<{
      assignedTo: number;
      assigneeName: string;
      createdBy: number;
      description: string;
      estimatedTime: string;
      flowStatusId: string;
      id: number;
      orderIndex: any;
      sprintId: number;
      tagId: number;
      taskPriorityColor: string;
      taskPriorityIcon: string;
      taskPriorityId: number;
      taskPriorityName: string;
      taskTypeId: number;
      title: string;
      trackingStatusId: number;
    }>
  >([]);
  
  const fetchProject = async () => {
    const response = await axios.get(`${rootUrl}/api/projects`, {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.data.data;
    setProjectData(data);
  };

  const fetchUserTask = async () => {
    const response = await axios.get(
      `${rootUrl}/api/task/board-tasks?ProjectId=${projectId}&IsActive=true`,
      {
        headers: {
          authorization: `Bearer ${authToken}`,
          Projectid: projectId,
        },
      }
    );
    const data = await response.data.data;
    setAllTask(data);
  };

 
  useEffect(() => {
    fetchProject();
  }, []);
  console.log(projectId);

  useEffect(() => {
    if (projectId) {
      fetchUserTask();
    }
  }, [projectId]);

  const userData = decryptData("userData");

  return (
    <div className="main-wrapper">
      {isProjectSelected ? (
        <>
          <div className="p-3">
            <h6 style={{ fontSize: "18px" }} className="fw-bold mb-3">
              Please select task
            </h6>
            <div className="mb-3 max-ul-h">
              <ul className="list-group">
                {allTask &&
                  allTask.length &&
                  allTask
                    .filter((task: taskType) => task.assignedTo === userData.id)
                    .map((task: taskType) => {
                      return <li className="list-group-item p-2" key={task.id}>{task.title}</li>;
                    })}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="p-3">
          <h6 style={{ fontSize: "18px" }} className="fw-bold mb-3">
            Please select project
          </h6>
          <div className="mb-3 max-ul-h">
            <ul className="list-group">
              {projectData &&
                projectData.map((data: any) => {
                  return (
                    <li className="list-group-item p-2" key={data.id} onClick={() => handleClick(data.id)}>
                      {data.name}
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
