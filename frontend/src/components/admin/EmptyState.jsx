import { FaComments } from "react-icons/fa";

const EmptyState = () => {
  return (
    <div className="flex-1 flex items-center justify-center w-full">
      <div className="text-center space-y-4 max-w-md">
        <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
          <FaComments className="text-indigo-600 text-2xl" />
        </div>

        <h2 className="text-lg font-semibold text-slate-700">
          No conversation selected
        </h2>

        <p className="text-sm text-slate-500">
          Select a chat from the left panel to view messages and respond to users.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;

