const OutputPanel = ({ output }) => (
  <section className="h-full bg-base-100 flex flex-col">
    <h2 className="bg-base-200 text-sm font-semibold border-b border-b-base-300 px-4 py-2">
      Output
    </h2>

    <div className="flex-1 overflow-auto p-4">
      {output === null ? (
        <p className="text-base-content/50 text-sm">
          Click "Run" to see the output here...
        </p>
      ) : output.success ? (
        <pre className="font-mono text-success text-sm whitespace-pre-wrap">
          {output.output}
        </pre>
      ) : (
        <div>
          {output.output && (
            <pre className="font-mono text-base-content text-sm whitespace-pre-wrap mb-2">
              {output.output}
            </pre>
          )}

          <pre className="font-mono text-error text-sm whitespace-pre-wrap">
            {output.error}
          </pre>
        </div>
      )}
    </div>
  </section>
);

export default OutputPanel;
