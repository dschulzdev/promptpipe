import { Brackets, PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export interface Property {
	id: string;
	name: string;
	type: "string" | "number" | "boolean" | "object";
	isArray: boolean;
	properties?: Property[];
}

const PropertyRow = ({
	property,
	updateProperty,
	removeProperty,
	addNestedProperty,
}: {
	property: Property;
	updateProperty: (
		id: string,
		updatedProperty: Partial<Property>,
		parentId?: string,
	) => void;
	removeProperty: (id: string, parentId?: string) => void;
	addNestedProperty: (id: string) => void;
}) => {
	return (
		<div className="mb-2 flex flex-col gap-2 border-gray-200 border-l-2 pl-4">
			<div className="flex items-center gap-2">
				<Input
					placeholder="Property name"
					value={property.name}
					onChange={(e) =>
						updateProperty(property.id, { name: e.target.value })
					}
				/>
				<Select
					value={property.type}
					onValueChange={(value: Property["type"]) =>
						updateProperty(property.id, {
							type: value,
							properties: value === "object" ? [] : undefined,
						})
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="string">string</SelectItem>
						<SelectItem value="number">number</SelectItem>
						<SelectItem value="boolean">boolean</SelectItem>
						<SelectItem value="object">object</SelectItem>
					</SelectContent>
				</Select>
				<Button
					variant={property.isArray ? "secondary" : "ghost"}
					size="icon"
					onClick={() =>
						updateProperty(property.id, { isArray: !property.isArray })
					}
				>
					<Brackets className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => removeProperty(property.id)}
				>
					<TrashIcon className="h-4 w-4" />
				</Button>
			</div>
			{property.type === "object" && (
				<div>
					{property.properties?.map((p) => (
						<PropertyRow
							key={p.id}
							property={p}
							updateProperty={(id, updatedProp) =>
								updateProperty(id, updatedProp, property.id)
							}
							removeProperty={(id) => removeProperty(id, property.id)}
							addNestedProperty={addNestedProperty}
						/>
					))}
					<Button
						variant="outline"
						size="sm"
						onClick={() => addNestedProperty(property.id)}
					>
						<PlusIcon className="mr-2 h-4 w-4" />
						Add Nested Property
					</Button>
				</div>
			)}
		</div>
	);
};

const JsonSchemaBuilder = ({
	initialProperties,
	onSchemaChange,
}: {
	initialProperties: Property[];
	onSchemaChange: (schema: object) => void;
}) => {
	const [properties, setProperties] = useState<Property[]>(initialProperties);

	useEffect(() => {
		setProperties(initialProperties);
	}, [initialProperties]);

	useEffect(() => {
		onSchemaChange(generateSchema(properties));
	}, [properties]);

	const addProperty = () => {
		setProperties([
			...properties,
			{ id: Date.now().toString(), name: "", type: "string", isArray: false },
		]);
	};

	const removeProperty = (id: string, parentId?: string) => {
		if (parentId) {
			setProperties(
				properties.map((p) =>
					p.id === parentId
						? {
								...p,
								properties: p.properties?.filter((nested) => nested.id !== id),
							}
						: p,
				),
			);
		} else {
			setProperties(properties.filter((p) => p.id !== id));
		}
	};

	const updateProperty = (
		id: string,
		updatedProperty: Partial<Property>,
		parentId?: string,
	) => {
		if (parentId) {
			setProperties(
				properties.map((p) =>
					p.id === parentId
						? {
								...p,
								properties: p.properties?.map((nested) =>
									nested.id === id ? { ...nested, ...updatedProperty } : nested,
								),
							}
						: p,
				),
			);
		} else {
			setProperties(
				properties.map((p) => (p.id === id ? { ...p, ...updatedProperty } : p)),
			);
		}
	};

	const addNestedProperty = (id: string) => {
		setProperties(
			properties.map((p) => {
				if (p.id === id) {
					return {
						...p,
						properties: [
							...(p.properties || []),
							{
								id: Date.now().toString(),
								name: "",
								type: "string",
								isArray: false,
							},
						],
					};
				}
				return p;
			}),
		);
	};

	const generateSchema = (currentProperties: Property[]): object => {
		const schema: {
			type: "object";
			properties: { [key: string]: any };
			required: string[];
		} = { type: "object", properties: {}, required: [] };

		const buildProperties = (props: Property[]) => {
			const result: { properties: { [key: string]: any }; required: string[] } =
				{ properties: {}, required: [] };
			for (const prop of props) {
				if (prop.name) {
					result.required.push(prop.name);
					let propSchema: any = {};
					if (prop.type === "object") {
						const nested = buildProperties(prop.properties || []);
						propSchema = {
							type: "object",
							properties: nested.properties,
							required: nested.required,
						};
					} else {
						propSchema = { type: prop.type };
					}

					if (prop.isArray) {
						result.properties[prop.name] = { type: "array", items: propSchema };
					} else {
						result.properties[prop.name] = propSchema;
					}
				}
			}
			return result;
		};

		const topLevel = buildProperties(currentProperties);
		schema.properties = topLevel.properties;
		schema.required = topLevel.required;

		return schema;
	};

	return (
		<div>
			{properties.map((p) => (
				<PropertyRow
					key={p.id}
					property={p}
					updateProperty={updateProperty}
					removeProperty={removeProperty}
					addNestedProperty={addNestedProperty}
				/>
			))}
			<Button onClick={addProperty}>Add property</Button>
		</div>
	);
};

export default JsonSchemaBuilder;
