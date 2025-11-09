import { XCircle, AlertCircle, CheckCircle } from "lucide-react";

const OutputPanel = ({ output }) => (
  <section className="h-full bg-base-100 flex flex-col">
    <h2 className="bg-base-200 text-sm font-semibold border-b border-b-base-300 px-4 py-2 flex items-center gap-2">
      <span>Output</span>
      {/* Status indicator */}
      {output !== null && (
        <span className="ml-auto">
          {output.success ? (
            <CheckCircle className="size-4 text-success" />
          ) : (
            <XCircle className="size-4 text-error" />
          )}
        </span>
      )}
    </h2>

    <div className="flex-1 overflow-auto p-4">
      {output === null ? (
        <div className="flex items-center gap-2 text-base-content/50 text-sm">
          <AlertCircle size={14} />

          <p>Click "Run" to see the output here...</p>
        </div>
      ) : output.success ? (
        <div className="space-y-2">
          {/* Success indicator */}
          <div className="flex items-center gap-2 text-success text-sm font-semibold mb-3">
            <CheckCircle size={14} />

            <span>Execution Successful</span>
          </div>

          {/* Output */}
          <pre className="font-mono text-base-content text-sm whitespace-pre-wrap wrap-break-word bg-base-200 p-3 rounded-lg border border-base-300">
            {output.output || output.stdout || "No output"}
          </pre>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Error indicator */}
          <div className="flex items-center gap-2 text-error text-sm font-semibold">
            <XCircle size={14} />

            <span>Execution Failed</span>

            {output.timedOut && (
              <span className="badge badge-error badge-sm ml-2">Timeout</span>
            )}
          </div>

          {/* stdout if available */}
          {output.output && output.output.trim() && (
            <div>
              <p className="text-xs text-base-content/60 font-semibold mb-1 uppercase">
                Output:
              </p>

              <pre className="font-mono text-base-content text-sm whitespace-pre-wrap wrap-break-word bg-base-200 p-3 rounded-lg border border-base-300">
                {output.output}
              </pre>
            </div>
          )}

          {/* Error */}
          {output.error && (
            <div>
              <p className="text-xs text-error/80 font-semibold mb-1 uppercase">
                Error:
              </p>

              <pre className="font-mono text-error text-sm whitespace-pre-wrap wrap-break-word bg-error/10 p-3 rounded-lg border border-error/20">
                {output.error}
              </pre>
            </div>
          )}

          {/* Exit code if non-zero */}
          {output.code !== null && output.code !== 0 && (
            <div className="text-xs text-base-content/60">
              Exit code:{" "}
              <span className="font-mono text-error">{output.code}</span>
            </div>
          )}
        </div>
      )}
    </div>
  </section>
);

export default OutputPanel;
