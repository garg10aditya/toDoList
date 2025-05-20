import { useEffect, useState } from "react";
import Column from "./Column";
import { fetchTasks, updateTask, deleteTask } from "../api/tasks";

export default function TaskBoard({ refreshTrigger }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load tasks");
        setLoading(false);
      }
    };
    loadTasks();
  }, [refreshTrigger]);

  const handleUpdate = async (taskId, updatedData) => {
    try {
      const updatedTask = await updateTask(taskId, updatedData);
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? updatedTask : task))
      );
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      throw new Error(err.message);
    }
  };

  if (loading) return <div className="p-4">Loading tasks...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  return (
    <div className="w-full min-h-[80vh] py-8 px-2 md:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex flex-col md:flex-row gap-8 justify-center items-start w-full max-w-[1600px] mx-auto">
        <Column
          title="To Do"
          tasks={tasks.filter((task) => task.status === "To Do")}
          onTaskUpdate={handleUpdate}
          onTaskDelete={handleDelete}
        />
        <Column
          title="In Progress"
          tasks={tasks.filter((task) => task.status === "In Progress")}
          onTaskUpdate={handleUpdate}
          onTaskDelete={handleDelete}
        />
        <Column
          title="Done"
          tasks={tasks.filter((task) => task.status === "Done")}
          onTaskUpdate={handleUpdate}
          onTaskDelete={handleDelete}
        />
      </div>
    </div>
  );
}
