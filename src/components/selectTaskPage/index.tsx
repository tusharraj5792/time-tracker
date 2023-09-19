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
  setAllProjects: (id: any) => void;
  allProjects: any;
  handleSelectProject: (id: number) => void;
  handleSelectTask: (task: { taskName: string; taskId: number }) => void;
  setIsProjectSelected: (isProjectSelected: boolean) => void;
}
export const SelectTaskPage = ({
  projectId,
  isProjectSelected,
  allProjects,
  setAllProjects,
  handleSelectProject,
  handleSelectTask,
  setIsProjectSelected,
}: propsType) => {
  const [allTasks, setAllTasks] = useState<
    Array<{
      assignedTo: number;
      id: number;
      title: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filteredTasks, setFilteredTasks] = useState<
    { assignedTo: number; id: number; title: string }[]
  >([]);
  const getProjects = async () => {
    const data = await ApiService.getData("api/projects", null);
    if (data.data.length) {
      setAllProjects(data.data);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  };

  const getTasks = async (id: number | null) => {
    setIsLoading(true)
    const data = await ApiService.getData(
      `api/task/board-tasks?ProjectId=${id}&IsActive=true`,
      id
    );
    if (data.data.length) {
      setIsLoading(false);
      setAllTasks(data.data);
    } else {
      setIsLoading(true);
    }
  };
  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    if (projectId) {
      getTasks(projectId);
    }
  }, [projectId]);

  const userData = decryptData("userData");

  useEffect(() => {
    if (allTasks && allTasks.length) {
      const filterTask = allTasks.filter(
        (task: taskType) => task.assignedTo === userData.id
      );
      setFilteredTasks(filterTask);
    }
  }, [allTasks]);

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
                  {filteredTasks && filteredTasks.length ? (
                    filteredTasks.map((task: taskType) => {
                      return (
                        <li
                          className="list-group-item p-2"
                          key={task.id}
                          onClick={() => {
                            handleSelectTask({
                              taskName: task.title,
                              taskId: task.id,
                            });
                          }}
                        >
                          {task.title}
                        </li>
                      );
                    })
                  ) : (
                    <h1>No Task Assigned </h1>
                  )}

                  <button onClick={() => setIsProjectSelected(false)}>
                    Back
                  </button>
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
                {!!allProjects &&
                  !!allProjects.length &&
                  allProjects.map((data: any) => {
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
