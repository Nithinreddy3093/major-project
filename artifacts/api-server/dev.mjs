import { spawnSync } from "node:child_process";

const env = { ...process.env, NODE_ENV: "development" };
const pnpmCandidates =
  process.platform === "win32"
    ? [
        { command: "pnpm.cmd", prefixArgs: [] },
        { command: "corepack.cmd", prefixArgs: ["pnpm"] },
      ]
    : [
        { command: "pnpm", prefixArgs: [] },
        { command: "corepack", prefixArgs: ["pnpm"] },
      ];

function runPnpm(args) {
  let lastResult = null;

  for (const candidate of pnpmCandidates) {
    const result = spawnSync(
      candidate.command,
      [...candidate.prefixArgs, ...args],
      {
        stdio: "inherit",
        env,
      },
    );

    lastResult = result;

    if (result.error?.code === "ENOENT") {
      continue;
    }

    return result;
  }

  return lastResult;
}

for (const args of [["run", "build"], ["run", "start"]]) {
  const result = runPnpm(args);

  if (result?.error) {
    console.error(result.error);
  }

  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}
