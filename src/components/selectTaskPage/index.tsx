import { useEffect, useState } from "react";
import axios from "axios";
import { rootUrl } from "../../screens/login";
import { decryptData } from "../../utils/utils";
import { Loader } from "../loader";

interface taskType {
  assignedTo: number;
  id: number;
  title: string;
}
interface propsType {
  isProjectSelected?: boolean;
  projectId?: number;
  setProjectData: (id: any) => void;
  projectData: any;
  handleSelectProject: (id: number) => void;
  handleSelectTask: (task:{taskName:string,taskId:number} ) => void;
}
export const SelectTaskPage = ({
  projectId,
  isProjectSelected,
  projectData,
  setProjectData,
  handleSelectProject,
  handleSelectTask,
}: propsType) => {
  const authToken = decryptData("authToken");
  const [allTask, setAllTask] = useState<
    Array<{
      assignedTo: number;
      id: number;
      title: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProject = async () => {
    const response = await axios.get(`${rootUrl}/api/projects`, {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.data.data;
    if (data) {
      setIsLoading(false);
    }
    setProjectData(data);
  };

  const fetchUserTask = async () => {
    setIsLoading(true)
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
    if (data) {
      setIsLoading(false);
    }
    setAllTask(data);
  };
  useEffect(() => {
    fetchProject();
  }, []);

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
              {isLoading ? (
                <Loader />
              ) : (
                <ul className="list-group">
                  {allTask &&
                    allTask.length &&
                    allTask
                      .filter(
                        (task: taskType) => task.assignedTo === userData.id
                      )
                      .map((task: taskType) => {
                        return (
                          <li
                            className="list-group-item p-2"
                            key={task.id}
                            onClick={() => {
                              handleSelectTask({taskName:task.title,taskId:task.id});
                            }}
                          >
                            {task.title}
                          </li>
                        );
                      })}
                </ul>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="p-3">
          <h6 style={{ fontSize: "18px" }} className="fw-bold mb-3">
            Please select project
          </h6>
          <div className="mb-3 max-ul-h">
            {isLoading ? (
              <Loader />
            ) : (
              <ul className="list-group">
                {projectData &&
                  projectData.map((data: any) => {
                    return (
                      <li
                        className="list-group-item p-2"
                        key={data.id}
                        onClick={() => handleSelectProject(data.id)}
                      >
                        {data.name}
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
