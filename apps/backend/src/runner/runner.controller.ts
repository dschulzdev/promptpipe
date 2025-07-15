import { Controller, MessageEvent, Post, Sse } from "@nestjs/common";
import { interval, map, Observable } from "rxjs";

@Controller("runner")
export class RunnerController {
	@Post("run")
	async run() {}

	@Sse("workflow")
	sse(): Observable<MessageEvent> {
		return interval(1000).pipe(map((_) => ({ data: { hello: "world" } })));
	}

	@Post("cancel")
	async cancel() {}
}
