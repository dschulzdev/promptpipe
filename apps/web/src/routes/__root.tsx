import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Loader from "@/components/loader";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "../index.css";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { client } from "@/api-client/client.gen";

export type RouterAppContext = {
	queryClient: QueryClient;
};

client.setConfig({
	baseUrl: import.meta.env.VITE_SERVER_URL,
	credentials: "include", // Add this to include cookies in all API requests
});

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{
				title: "PromptPipe",
			},
			{
				name: "description",
				content: "The easiest way to build and run AI workflows.",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.ico",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon-16x16.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "manifest",
				href: "/site.webmanifest",
			},
		],
	}),
});

function RootComponent() {
	const isFetching = useRouterState({
		select: (s) => s.isLoading,
	});

	return (
		<>
			<HeadContent />
			<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
				{isFetching ? <Loader /> : <Outlet />}
				<Toaster richColors />
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} />

			<TanStackRouterDevtools position="bottom-left" />
		</>
	);
}
