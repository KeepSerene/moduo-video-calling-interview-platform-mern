import { getFileExtension } from "./utils";

const PISTON_API_BASE_URL = "https://emkc.org/api/v2/piston";

const LANGUAGES = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};

/**
 * Execute user's code using the Piston (emkc) API.
 *
 * Note: This helper is intentionally defensive:
 *  - Validates language against a small known set
 *  - Sends files as an array (required by Piston)
 *  - Supports optional stdin, args, and timeout
 *  - Normalizes response fields (stdout, stderr, output, exit code)
 *
 * @async
 * @param {string} language - Programming language (e.g. `"javascript"`, `"python"`, `"java"`)
 * @param {string} userCode - The source code to execute
 * @param {Object} [options] - Optional settings
 * @param {string} [options.stdin] - Text to pass to program's stdin
 * @param {string[]} [options.args] - Command-line arguments for the program
 * @param {number} [options.timeout=10000] - Max time in ms to wait before aborting the request
 *
 * @returns {Promise<{
 *   success: boolean,
 *   stdout?: string,
 *   stderr?: string,
 *   output?: string,
 *   error?: string,
 *   code?: number|null,
 *   timedOut?: boolean
 * }>}
 */
export async function executeUserCode(language, userCode, options = {}) {
  const { stdin = "", args = [], timeout = 10000 } = options;

  const langKey = (language || "").toLowerCase();
  const languageConfig = LANGUAGES[langKey];

  if (!languageConfig) {
    return {
      success: false,
      error: `Unsupported language: ${language}`,
    };
  }

  if (typeof userCode !== "string" || userCode.trim() === "") {
    return {
      success: false,
      error: "userCode must be a non-empty string",
    };
  }

  const filename = `main.${getFileExtension(langKey)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const body = {
      language: languageConfig.language,
      version: languageConfig.version,
      files: [
        {
          name: filename,
          content: userCode,
        },
      ],
      stdin,
      args,
      // compile timeout to prevent hanging on compilation errors
      compile_timeout: 10000,
      run_timeout: 3000,
    };

    const response = await fetch(`${PISTON_API_BASE_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");

      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}${
          errorText ? ` - ${errorText}` : ""
        }`,
      };
    }

    const data = await response.json();

    // Handle compilation errors
    const compile = data.compile || {};

    if (compile.code !== undefined && compile.code !== 0) {
      return {
        success: false,
        error: compile.stderr || compile.output || "Compilation failed",
        output: compile.stdout || "",
        stderr: compile.stderr || "",
        code: compile.code,
      };
    }

    const run = data.run || {};
    // Piston responses can include output (combined) or separate stdout/stderr fields
    const stdout = run.stdout ?? "";
    const stderr = run.stderr ?? "";
    const output = run.output ?? stdout;
    const code = typeof run.code === "number" ? run.code : null;
    const timedOut = !!run.signal || !!run.killed;

    // Success if: exit code is 0 AND no stderr (or stderr is just warnings)
    const hasNonZeroExit = code !== null && code !== 0;
    const hasRunFailureStatus =
      typeof run.status === "string" && run.status.trim().length > 0;
    const hasStderr = stderr.trim().length > 0;

    if (timedOut || hasNonZeroExit || hasRunFailureStatus) {
      return {
        success: false,
        stdout,
        stderr,
        output: output || stdout,
        error:
          (timedOut ? "Execution timed out" : "") ||
          (hasRunFailureStatus ? run.message || "Execution failed" : "") ||
          (code !== null
            ? `Process exited with code ${code}`
            : hasStderr
            ? stderr.trim()
            : "Execution failed"),
        code,
        timedOut,
      };
    }

    return {
      success: true,
      stdout,
      output: output || stdout || "No output",
      stderr: "",
      code,
    };
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      return {
        success: false,
        error: `Execution timed out after ${Math.ceil(timeout / 1000)}s`,
        timedOut: true,
      };
    }

    if (err.name === "TypeError" && err.message.includes("fetch")) {
      return {
        success: false,
        error:
          "Network error: Unable to reach code execution service. Please check your connection.",
      };
    }

    return {
      success: false,
      error: `Failed to execute code: ${err.message}`,
    };
  } finally {
    clearTimeout(timer);
  }
}
