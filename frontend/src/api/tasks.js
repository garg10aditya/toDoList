import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

export const fetchTasks = async () => {
  console.log("Fetching tasks from:", API_URL);
  try {
    const response = await axios.get(API_URL);
    console.log("Response received:", response);
    return response.data;
  } catch (error) {
    console.error("Fetch error details:", error);
    throw error;
  }
};


export const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData);
  return response.data;
};

// Update existing task
export const updateTask = async (taskId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${taskId}`, updatedData);
    return response.data; // Should return updated task
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update task");
  }
};

// Delete task
export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${API_URL}/${taskId}`);
    return taskId; // Return deleted task ID
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete task");
  }
};

