import Editor from "@monaco-editor/react";
import { Loader2, Play } from "lucide-react";
import { LANGUAGE_CONFIGS } from "../data/problems";

const CodeEditor = ({
  selectedLanguage,
  onLanguageChange,
  userCode,
  onUserCodeChange,
  isRunning,
  onRunCode,
}) => (
  <div className="h-full bg-base-300 flex flex-col">
    <div className="bg-base-100 border-t border-t-base-300 px-4 py-3 flex flex-wrap justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <img
          src={LANGUAGE_CONFIGS[selectedLanguage].imgSrc}
          alt={`${LANGUAGE_CONFIGS[selectedLanguage].name} icon`}
          className="size-6"
        />

        <select
          value={selectedLanguage}
          onChange={(event) => onLanguageChange(event.target.value)}
          className="select select-sm"
        >
          {Object.entries(LANGUAGE_CONFIGS).map(([langKey, langConfig]) => (
            <option key={langKey} value={langKey}>
              {langConfig.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onRunCode}
        disabled={isRunning}
        className="btn btn-primary btn-sm"
      >
        {isRunning ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Running...
          </>
        ) : (
          <>
            <Play size={16} />
            Run
          </>
        )}
      </button>
    </div>

    <div className="flex-1">
      <Editor
        height="100%"
        language={LANGUAGE_CONFIGS[selectedLanguage].monacoLang}
        value={userCode}
        onChange={onUserCodeChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: true,
          automaticLayout: true,
          minimap: { enabled: false },
          fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
          fontLigatures: true,
          wordWrap: "on",
          tabSize: 2,
          renderWhitespace: "selection",
          cursorBlinking: "smooth",
          smoothScrolling: true,
        }}
      />
    </div>
  </div>
);

export default CodeEditor;
