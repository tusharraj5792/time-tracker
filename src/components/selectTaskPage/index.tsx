import { useEffect, useState } from "react";
import { decryptData } from "../../utils/utils";
import { Loader } from "../loader";
import { ApiService } from "../../utils/api.services";

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
  const [allTask, setAllTask] = useState<
    Array<{
      assignedTo: number;
      id: number;
      title: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getProjects = async () => {
    const data = await ApiService.getData('api/projects',null);
    if (data.data.length) {
      setProjectData(data.data);
      setIsLoading(false);
    }else{
      setIsLoading(true)
    }
  };

  const getTasks = async (id:number|null) => {
    const data = await ApiService.getData(`api/task/board-tasks?ProjectId=${id}&IsActive=true`,id)
    if (data.data.length) {
      setIsLoading(false);
      setAllTask(data.data);
    }else{
      setIsLoading(true)
    }
  };
  useEffect(() => {
    getProjects()
  }, []);

  useEffect(() => {
    if (projectId) {
      getTasks(projectId);
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
                  {!!allTask && !!allTask.length && allTask
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
                {!!projectData && !!projectData.length && 
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
