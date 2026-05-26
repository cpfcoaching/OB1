import { sleep, FatalError } from "workflow";
export async function handleUserSignup(email) {
    "use workflow";
    const user = await createUser(email);
    await sendWelcomeEmail(user);
    await sleep("5s"); // Pause for 5s - doesn't consume any resources
    await sendOnboardingEmail(user);
    return { userId: user.id, status: "onboarded" };
}
async function createUser(email) {
    "use step";
    console.log(`Creating user with email: ${email}`);
    // Full Node.js access - database calls, APIs, etc.
    return { id: Math.random().toString(36).substring(7), email };
}
async function sendWelcomeEmail(user) {
    "use step";
    console.log(`Sending welcome email to user: ${user.id}`);
    if (Math.random() < 0.3) {
        // By default, steps will be retried for unhandled errors
        throw new Error("Retryable!");
    }
}
async function sendOnboardingEmail(user) {
    "use step";
    if (!user.email.includes("@")) {
        // To skip retrying, throw a FatalError instead
        throw new FatalError("Invalid Email");
    }
    console.log(`Sending onboarding email to user: ${user.id}`);
}
//# sourceMappingURL=user-signup.js.map