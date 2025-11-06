import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import {
  CodeEditor,
  OutputPanel,
  ProblemInfo,
  ProtectedRouteNavbar,
} from "../components";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { executeUserCode } from "../lib/piston";
import toast from "react-hot-toast";
import { normalize } from "../lib/utils";
import confetti from "canvas-confetti";

function ProblemDetailsPage() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [currentProblemId, setCurrentProblemId] = useState(problemId);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [userCode, setUserCode] = useState(
    PROBLEMS[problemId].starterCode.javascript
  );
  const [isRunning, setIsRunning] = useState(false);
  const [codeRunResult, setCodeRunResult] = useState(null);

  const currentProblem = PROBLEMS[currentProblemId || "two-sum"];

  // Update problem whenever problemId and selected language change
  useEffect(() => {
    if (problemId && PROBLEMS[problemId]) {
      setCurrentProblemId(problemId);
      setUserCode(PROBLEMS[problemId].starterCode[selectedLanguage]);
      setCodeRunResult(null);
      setIsRunning(false);
    }
  }, [problemId, selectedLanguage]);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleProblemChange = (problemId) => {
    navigate(`/problems/${problemId}`);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setCodeRunResult(null);

    try {
      const result = await executeUserCode(selectedLanguage, userCode);
      setCodeRunResult(result);

      if (result.success) {
        const expectedOutput = currentProblem.expectedOutput[selectedLanguage];

        if (testsPassed(result.output, expectedOutput)) {
          toast.success("All tests passed. Yay!");
          triggerConfetti();
        } else {
          toast.error("One or more tests failed! Check your output.");
        }
      } else {
        toast.error("Code execution failed!");
      }
    } catch (error) {
      console.error("Error running user's code:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const testsPassed = (actualOutput, expectedOutput) => {
    return normalize(actualOutput) === normalize(expectedOutput);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  return (
    <main className="h-screen bg-base-100 flex flex-col">
      <ProtectedRouteNavbar />

      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left panel - problem info */}
          <Panel defaultSize={40} minSize={30} maxSize={70}>
            <ProblemInfo
              problemId={currentProblemId}
              problem={currentProblem}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 cursor-col-resize transition-colors hover:bg-primary focus-within:bg-primary" />

          {/* Right panel - code editor & output panel */}
          <Panel defaultSize={60} minSize={30} maxSize={70}>
            <PanelGroup direction="vertical">
              {/* Top panel - code editor */}
              <Panel defaultSize={70} minSize={30} maxSize={90}>
                <CodeEditor
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                  userCode={userCode}
                  onUserCodeChange={setUserCode}
                  isRunning={isRunning}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 cursor-row-resize transition-colors hover:bg-primary focus-within:bg-primary" />

              {/* Bottom panel - output panel */}
              <Panel defaultSize={30} minSize={10} maxSize={70}>
                <OutputPanel output={codeRunResult} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </main>
  );
}

export default ProblemDetailsPage;
