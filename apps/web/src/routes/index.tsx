import { createFileRoute } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	const newLocal = "mailto:dominik@dschulz.dev";
	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<header className="flex h-14 items-center justify-between px-4 lg:px-6">
				<img
					src="/android-chrome-512x512.png"
					alt="Logo"
					className="mr-4 h-8 w-8"
				/>
				{/** biome-ignore lint/a11y/useValidAnchor: its fine here, will be replaced in the future */}
				<a className="flex items-center justify-center" href="#">
					<span className="font-bold text-2xl text-primary">PromptPipe</span>
				</a>
				<nav className="ml-auto flex gap-4 sm:gap-6">
					<a
						className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
						href="/app"
					>
						Request Demo
					</a>
				</nav>
			</header>
			<main className="flex-1">
				<section className="flex w-full items-center justify-center py-12 md:py-24 lg:py-32 xl:py-48">
					<div className="container px-4 md:px-6">
						<div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
							<div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
								<div className="space-y-2">
									<h1 className="animate-fade-in-up font-bold text-4xl tracking-tighter sm:text-5xl xl:text-6xl/none">
										The Ultimate Visual Workflow Builder for LLMs
									</h1>
									<p className="animation-delay-200 mx-auto max-w-[600px] animate-fade-in-up text-muted-foreground md:text-xl lg:mx-0">
										Create, evaluate, and share complex AI-powered workflows
										with an intuitive drag-and-drop interface. Go from idea to
										production in minutes, not weeks.
									</p>
								</div>
								<div className="animation-delay-400 flex animate-fade-in-up flex-col justify-center gap-2 lg:justify-start min-[400px]:flex-row">
									<a
										className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 font-medium text-primary-foreground text-sm shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
										href="/app"
									>
										Request Demo
									</a>
									<a
										className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 font-medium text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
										href={newLocal}
									>
										Contact Us
									</a>
								</div>
							</div>
							<div className="flex justify-center lg:justify-end">
								<img
									src="https://images.unsplash.com/photo-1696258685005-e1541647b813?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzU3MzZ8MHwxfHNlYXJjaHwxfHxBSV93b3JrZmxvd3xlbnwwfHx8fDE3MTk5MjY1NDd8MA&ixlib=rb-4.0.3&q=80&w=400"
									width="500"
									height="400"
									alt="AI Workflow Editor"
									className="animation-delay-600 mx-auto aspect-video animate-fade-in-up overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
								/>
							</div>
						</div>
					</div>
				</section>
				<section className="flex w-full items-center justify-center bg-secondary py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="font-bold text-3xl tracking-tighter sm:text-5xl">
									Build at the Speed of Thought
								</h2>
								<p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									Our visual editor makes it easy to connect LLMs, data sources,
									and custom logic to create powerful AI workflows.
								</p>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
							<img
								src="https://images.unsplash.com/photo-1696258685005-e1541647b813?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzU3MzZ8MHwxfHNlYXJjaHwxfHxBSV93b3JrZmxvd3xlbnwwfHx8fDE3MTk5MjY1NDd8MA&ixlib=rb-4.0.3&q=80&w=400"
								width="500"
								height="400"
								alt="Visual Workflow Builder"
								className="mx-auto aspect-video animate-fade-in-up overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
							/>
							<div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
								<ul className="grid gap-6">
									<li>
										<div className="grid gap-1">
											<h3 className="font-bold text-xl">
												Drag & Drop Interface
											</h3>
											<p className="text-muted-foreground">
												Simply drag and drop nodes to build your workflow. No
												code required.
											</p>
										</div>
									</li>
									<li>
										<div className="grid gap-1">
											<h3 className="font-bold text-xl">
												Real-time Evaluation
											</h3>
											<p className="text-muted-foreground">
												Evaluate your workflow's performance in real-time with
												our built-in evaluation tools.
											</p>
										</div>
									</li>
									<li>
										<div className="grid gap-1">
											<h3 className="font-bold text-xl">Share with a Click</h3>
											<p className="text-muted-foreground">
												Share your workflows with your team or the world with a
												single click.
											</p>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</section>
				<section className="flex w-full items-center justify-center py-12 md:py-24 lg:py-32">
					<div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
						<div className="space-y-3">
							<h2 className="font-bold text-3xl tracking-tighter md:text-4xl/tight">
								Frequently Asked Questions
							</h2>
							<p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Find answers to common questions about PromptPipe.
							</p>
						</div>
						<div className="mx-auto mt-8 w-full max-w-3xl">
							<Collapsible className="w-full space-y-4">
								<CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-accent px-4 py-3 text-left font-medium text-lg hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
									Why isn't the full application accessible?
									<ChevronDownIcon className="h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-180" />
								</CollapsibleTrigger>
								<CollapsibleContent className="px-4 py-2 text-left text-muted-foreground">
									Running powerful AI models costs money. To protect the solo
									developer behind this project, which currently does not earn
									any revenue, the demo version of PromptPipe can only utilize
									free models. This means that while you can explore the visual
									workflow builder and spectate features like evaluations in
									action, you cannot create accounts or perform other actions
									that would incur costs. We appreciate your understanding as
									the project develops. Maybe in the future, we can offer more
									features to our users.
								</CollapsibleContent>
							</Collapsible>
						</div>
					</div>
				</section>
				<section className="flex w-full items-center justify-center py-12 md:py-24 lg:py-32">
					<div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
						<div className="space-y-3">
							<h2 className="font-bold text-3xl tracking-tighter md:text-4xl/tight">
								Ready to Build?
							</h2>
							<p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Start building your first AI-powered workflow today.
							</p>
						</div>
						<div className="flex flex-col justify-center gap-2 min-[400px]:flex-row">
							<a
								className="inline-flex h-10 items-center justify-center rounded-md px-8 font-medium text-primary-foreground text-sm shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
								href="/app"
								style={{ backgroundColor: "var(--primary)" }}
							>
								Request Demo
							</a>
							<a
								className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 font-medium text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
								href="mailto:dominik@dschulz.dev"
							>
								Contact Us
							</a>
						</div>
					</div>
				</section>
			</main>
			<footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
				<p className="text-muted-foreground text-xs">
					© 2025 PromptPipe. All rights reserved.
				</p>
			</footer>
		</div>
	);
}
