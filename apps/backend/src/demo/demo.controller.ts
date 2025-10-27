import { Workflow } from "@generated/prisma";
import { Controller, Get, Post } from "@nestjs/common";
import { WorkflowDto } from "../workflow/dto/workflow.dto";

const demoWorkflow: Workflow = {
	id: "demo",
	name: "Demo Workflow",
	nodes: [
		{
			id: "b399df89-2f7a-471f-94f1-3c899b6ca8bf",
			data: {},
			type: "basic_start",
			position: {
				x: -103,
				y: 67.5,
			},
		},
		{
			id: "09585fa2-4ae8-45ab-8a1b-11084c4a00a7",
			data: {
				role: "user",
				prompt: "Why is the banana yellow?",
			},
			type: "text_input",
			position: {
				x: 98.97456895134582,
				y: -12.94860291341544,
			},
		},
		{
			id: "2eb16475-0edd-4e83-936d-38f76f0b5fbf",
			data: {
				llmModel: "moonshotai/kimi-k2:free",
				llmProvider: "openrouter",
			},
			type: "llm",
			position: {
				x: 113.626546754944,
				y: -264.868188223558,
			},
		},
		{
			id: "d017f237-8e27-4685-b388-472e386564d7",
			data: {
				response: [
					{
						role: "user",
						content: "Why is the banana yellow?",
					},
					{
						role: "assistant",
						content:
							'{"explanation":"The yellow color of bananas is due to pigments called carotenoids, primarily beta-carotene and xanthophylls. As a banana ripens, chlorophyll, which gives it a green color, breaks down. This allows the yellow carotenoid pigments to become visible, resulting in the characteristic yellow color of a ripe banana."}',
					},
				],
			},
			type: "text_output",
			position: {
				x: 1088.532471762677,
				y: -299.868188223558,
			},
		},
		{
			id: "444793b2-5c43-4e18-b200-53cfcdc9e570",
			data: {},
			type: "text_generation",
			position: {
				x: 613.1796611158966,
				y: -190.6820548984613,
			},
		},
	],
	connections: [
		{
			id: "xy-edge__b399df89-2f7a-471f-94f1-3c899b6ca8bfstart-09585fa2-4ae8-45ab-8a1b-11084c4a00a7",
			sourceNodeId: "b399df89-2f7a-471f-94f1-3c899b6ca8bf",
			targetNodeId: "09585fa2-4ae8-45ab-8a1b-11084c4a00a7",
			sourceNodeHandleId: "start",
		},
		{
			id: "xy-edge__2eb16475-0edd-4e83-936d-38f76f0b5fbf-79a80e86-2c52-4939-a86c-4d9ba562a903llm",
			sourceNodeId: "2eb16475-0edd-4e83-936d-38f76f0b5fbf",
			targetNodeId: "444793b2-5c43-4e18-b200-53cfcdc9e570",
			targetNodeHandleId: "llm",
		},
		{
			id: "xy-edge__09585fa2-4ae8-45ab-8a1b-11084c4a00a7-79a80e86-2c52-4939-a86c-4d9ba562a903prompt",
			sourceNodeId: "09585fa2-4ae8-45ab-8a1b-11084c4a00a7",
			targetNodeId: "444793b2-5c43-4e18-b200-53cfcdc9e570",
			targetNodeHandleId: "prompt",
		},
		{
			id: "xy-edge__79a80e86-2c52-4939-a86c-4d9ba562a903-d017f237-8e27-4685-b388-472e386564d7",
			sourceNodeId: "444793b2-5c43-4e18-b200-53cfcdc9e570",
			targetNodeId: "d017f237-8e27-4685-b388-472e386564d7",
		},
	],
	createdAt: new Date("2025-10-06T19:07:37.355Z"),
	updatedAt: new Date("2025-10-22T07:09:11.638Z"),
	applicationUserId: "demo",
};

@Controller("demo")
export class DemoController {
	@Get()
	getDemo(): WorkflowDto {
		return demoWorkflow;
	}

	@Post("run")
	async runDemoWorkflow() {
		// Logic to run a demo workflow
		return { message: "Demo workflow started" };
	}
}
