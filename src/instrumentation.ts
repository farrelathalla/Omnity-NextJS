export async function register() {
  // Node runtime only (not the edge runtime), and only when explicitly enabled.
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.AUTO_MIGRATE !== "1") return;
  const { runStartupTasks } = await import("./lib/startup");
  await runStartupTasks();
}
