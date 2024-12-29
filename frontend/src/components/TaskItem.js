import WhatsAppButton from "./WhatsAppButton";

function TaskItem({ task }) {
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h3 className="font-bold">{task.title}</h3>
      <p>{task.description}</p>
      <div className="mt-4 flex gap-2">
        {/* Your existing buttons */}
        <WhatsAppButton task={task} />
      </div>
    </div>
  );
}

export default TaskItem;
