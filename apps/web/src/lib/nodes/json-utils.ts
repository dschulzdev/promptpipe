import Ajv from "ajv";

const ajv = new Ajv();

export function isValidJsonSchema(schemaString: string): boolean {
	try {
		const schema = JSON.parse(schemaString);
		ajv.compile(schema);
		return true;
	} catch (error) {
		console.error("Invalid schema:", error);
		return false;
	}
}
