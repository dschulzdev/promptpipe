import Ajv from "ajv";

const ajv = new Ajv();

export function isValidJsonSchema(schemaString: string): boolean {
	try {
		const schema = JSON.parse(schemaString);
		ajv.compile(schema);
		return true;
	} catch (error) {
		if (
			error &&
			typeof error === "object" &&
			"errors" in error &&
			// biome-ignore lint/suspicious/noExplicitAny: any is okay for the validation here, we don't need the specific type here
			Array.isArray((error as any).errors)
		) {
			console.error("Invalid schema. Validation errors:");
			// biome-ignore lint/suspicious/noExplicitAny: any is okay for the validation here, we don't need the specific type here
			for (const err of (error as any).errors) {
				console.error(`- ${err.instancePath || err.dataPath}: ${err.message}`);
			}
		} else {
			console.error("Invalid schema:", error);
		}
		return false;
	}
}
