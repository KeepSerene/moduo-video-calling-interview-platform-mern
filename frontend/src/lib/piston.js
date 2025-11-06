import { getFileExtension } from "./utils";

const PISTON_BASE_API_URL = "https://emkc.org/api/v2/piston";

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
    };

    const response = await fetch(`${PISTON_BASE_API_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error while executing code: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();

    const run = data.run || {};
    // Piston responses can include output (combined) or separate stdout/stderr fields
    const stdout = run.stdout ?? "";
    const stderr = run.stderr ?? "";
    const output = run.output ?? stdout;
    const code = typeof run.code === "number" ? run.code : null;
    const timedOut = !!run.timedOut || !!run.killed;

    // If there was runtime stderr, non-zero exit code, or timed out — indicate failure but return details
    if (timedOut || (code !== null && code !== 0) || stderr) {
      return {
        success: false,
        stdout,
        stderr,
        output,
        error:
          stderr ||
          (code !== null
            ? `Process exited with code ${code}`
            : "Execution failed"),
        code,
        timedOut,
      };
    }

    return {
      success: true,
      stdout,
      output: output || "No output",
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

    return {
      success: false,
      error: `Failed to execute code: ${err.message}`,
    };
  } finally {
    clearTimeout(timer);
  }
}
