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
import { client } from "@/api-client/client.gen";

export type RouterAppContext = {
	queryClient: QueryClient;
};

client.setConfig({
	baseUrl: import.meta.env.VITE_SERVER_URL,
});

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{
				title: "My App",
			},
			{
				name: "description",
				content: "My App is a web application",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.ico",
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
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				{isFetching ? <Loader /> : <Outlet />}
				<Toaster richColors />
			</ThemeProvider>
			<Toaster />
			<TanStackRouterDevtools position="bottom-left" />
		</>
	);
}
