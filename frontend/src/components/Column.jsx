import TaskCard from "./TaskCard";

const columnColors = {
  "To Do": "from-green-400 to-green-600",
  "In Progress": "from-yellow-400 to-yellow-600",
  Done: "from-red-400 to-red-600",
};

export default function Column({ title, tasks, onTaskUpdate, onTaskDelete }) {
  return (
    <div className="flex-1 min-w-[380px] max-w-[500px] bg-white rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden transition-all">
      {/* Accent Bar */}
      <div
        className={`h-2 w-full bg-gradient-to-r ${
          columnColors[title] || "from-gray-300 to-gray-400"
        }`}
      />
      <div className="p-6 flex flex-col gap-5">
        <h2 className="text-2xl font-bold mb-2 text-gray-700 tracking-wide">
          {title}
        </h2>
        <div className="flex flex-col gap-5">
          {tasks.length === 0 && (
            <div className="text-gray-400 text-sm italic text-center py-8">
              No tasks yet.
            </div>
          )}
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onTaskUpdate}
              onDelete={onTaskDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
