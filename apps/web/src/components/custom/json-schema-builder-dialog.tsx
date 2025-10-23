import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { isValidJsonSchema } from "@/lib/nodes/json-utils";
import JsonSchemaBuilder, { type Property } from "./json-schema-builder";

interface JsonSchemaBuilderDialogProps {
	open: boolean;
	onError: (b: boolean) => void;
	onOpenChange: (open: boolean) => void;
	onSave: (schema: object) => void;
	initialSchema: string;
}

const JsonSchemaBuilderDialog = ({
	open,
	onOpenChange,
	onSave,
	onError,
	initialSchema,
}: JsonSchemaBuilderDialogProps) => {
	const [visualSchema, setVisualSchema] = useState({});
	const [codeSchema, setCodeSchema] = useState(initialSchema);
	const [initialProperties, setInitialProperties] = useState<Property[]>([]);
	const [activeTab, setActiveTab] = useState("visual");
	const [error, setError] = useState<string | null>(null);

	const parseSchemaToProperties = (schema: any): Property[] => {
		if (!schema || !schema.properties) return [];

		return Object.entries(schema.properties).map(
			([name, prop]: [string, any]) => {
				let type: Property["type"] = "string";
				let isArray = false;
				let properties: Property[] | undefined;

				if (prop.type === "array") {
					isArray = true;
					if (prop.items.type === "object") {
						type = "object";
						properties = parseSchemaToProperties(prop.items);
					} else {
						type = prop.items.type;
					}
				} else if (prop.type === "object") {
					type = "object";
					properties = parseSchemaToProperties(prop);
				} else {
					type = prop.type;
				}

				return {
					id: crypto.randomUUID(), // Generate a guaranteed unique ID
					name,
					type,
					isArray,
					properties,
				};
			},
		);
	};

	useEffect(() => {
		if (initialSchema) {
			try {
				const parsedSchema = JSON.parse(initialSchema);
				const properties = parseSchemaToProperties(parsedSchema);
				setInitialProperties(properties);
				setVisualSchema(parsedSchema);
				setCodeSchema(initialSchema);
			} catch (error) {
				console.error("Error parsing initial schema:", error);
				setInitialProperties([]);
				setVisualSchema({});
				setCodeSchema("");
			}
		} else {
			setInitialProperties([]);
			setVisualSchema({});
			setCodeSchema("");
		}
	}, [initialSchema, parseSchemaToProperties]);

	const handleVisualSchemaChange = (schema: object) => {
		setVisualSchema(schema);
		setCodeSchema(JSON.stringify(schema, null, 2));
	};

	const handleCodeSchemaChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		const newCode = e.target.value;
		setCodeSchema(newCode);
		try {
			const parsedSchema = JSON.parse(newCode);
			setVisualSchema(parsedSchema);
			setInitialProperties(parseSchemaToProperties(parsedSchema));
		} catch (_error) {
			// Invalid JSON, do not update visual schema
		}
	};

	const handleSave = () => {
		if (activeTab === "code") {
			try {
				const parsedSchema = JSON.parse(codeSchema);
				if (!isValidJsonSchema(parsedSchema)) {
					throw new Error("Schema must be a valid JSON Schema object");
				}
				onSave(parsedSchema);
				setError(null);
				onError(false);
				onOpenChange(false);
			} catch (error) {
				console.error("Invalid JSON in code editor, cannot save:", error);
				setError(
					"Invalid JSON Schema. Please correct the errors and try again.",
				);
				onError(true);
			}
		} else {
			onSave(visualSchema);
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>JSON Schema Builder</DialogTitle>
				</DialogHeader>
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="visual">Visual Editor</TabsTrigger>
						<TabsTrigger value="code">Code Editor</TabsTrigger>
					</TabsList>
					<TabsContent value="visual">
						<JsonSchemaBuilder
							initialProperties={initialProperties}
							onSchemaChange={handleVisualSchemaChange}
						/>
					</TabsContent>
					<TabsContent value="code">
						<Textarea
							value={codeSchema}
							onChange={handleCodeSchemaChange}
							className="min-h-[300px] font-mono"
						/>
						{error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
					</TabsContent>
				</Tabs>
				<DialogFooter>
					<Button onClick={() => onOpenChange(false)} variant="outline">
						Cancel
					</Button>
					<Button onClick={handleSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default JsonSchemaBuilderDialog;
