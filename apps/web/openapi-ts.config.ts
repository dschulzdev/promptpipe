import { defineConfig } from "@hey-api/openapi-ts";
import "dotenv/config";

export default defineConfig({
	input: `${process.env.VITE_SERVER_URL}/api-yaml`,
	output: {
		lint: "biome",
		format: "biome",
		path: "src/api-client",
	},
	plugins: ["zod", "@tanstack/react-query"],
});
