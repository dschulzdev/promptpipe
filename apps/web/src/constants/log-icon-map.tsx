import {
	AlertCircle,
	CheckCheck,
	CheckCircle,
	Circle,
	Loader2,
	Logs,
} from "lucide-react";

export const logsIconMap: Record<string, React.ReactNode> = {
	waiting: <Circle className="h-4 w-4 text-gray-400" />,
	log: <Logs className="h-4 w-4 text-blue-400" />,
	progress_node: <Loader2 className="h-4 w-4 text-yellow-600" />,
	in_progress: <Loader2 className="h-4 w-4 text-yellow-600" />,
	success_node: <CheckCircle className="h-4 w-4 text-green-400" />,
	result_success: <CheckCheck className="h-4 w-4 text-green-700" />,
	completed: <CheckCheck className="h-4 w-4 text-green-700" />,
	failed: <AlertCircle className="h-4 w-4 text-red-400" />,
};
