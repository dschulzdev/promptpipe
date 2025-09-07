import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
	validateSearch: z.object({
		redirect: z.string().optional().catch(""),
	}),
	beforeLoad: async ({ search }) => {
		const { data } = await auth.getSession();

		if (data?.session) {
			throw redirect({ to: search.redirect });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const search = Route.useSearch();

	const handleGithubSignIn = async () => {
		try {
			await auth.signIn.social({
				provider: "github",
				callbackURL: `${import.meta.env.VITE_BASE_URL}/${search.redirect ?? ""}`, // Redirect here after success
			});
		} catch (error) {
			console.error("Error signing in with Github:", error);
		}
	};

	return (
		<div>
			<Button onClick={handleGithubSignIn}>Sign in with Github</Button>
		</div>
	);
}
