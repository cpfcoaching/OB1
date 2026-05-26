import { i as defineEventHandler } from "../../_libs/h3+rou3+srvx.mjs";
import { r as FatalError, t as start } from "../../_libs/@workflow/core+[...].mjs";
import "../../_libs/workflow.mjs";
//#region workflows/user-signup.ts
async function handleUserSignup(email) {
	throw new Error("You attempted to execute workflow handleUserSignup function directly. To start a workflow, use start(handleUserSignup) from workflow/api");
}
handleUserSignup.workflowId = "workflow//./workflows/user-signup//handleUserSignup";
async function createUser(email) {
	console.log(`Creating user with email: ${email}`);
	return {
		id: Math.random().toString(36).substring(7),
		email
	};
}
createUser.stepId = "step//./workflows/user-signup//createUser";
async function sendWelcomeEmail(user) {
	console.log(`Sending welcome email to user: ${user.id}`);
	if (Math.random() < .3) throw new Error("Retryable!");
}
sendWelcomeEmail.stepId = "step//./workflows/user-signup//sendWelcomeEmail";
async function sendOnboardingEmail(user) {
	if (!user.email.includes("@")) throw new FatalError("Invalid Email");
	console.log(`Sending onboarding email to user: ${user.id}`);
}
sendOnboardingEmail.stepId = "step//./workflows/user-signup//sendOnboardingEmail";
//#endregion
//#region api/signup.post.ts
var signup_post_default = defineEventHandler(async ({ req }) => {
	const { email } = await req.json();
	await start(handleUserSignup, [email]);
	return { message: "User signup workflow started" };
});
//#endregion
export { signup_post_default as default };
