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

  // State to track window size for responsive layout
  const [isOnSmScreen, setIsOnSmScreen] = useState(window.innerWidth < 992);

  // Early redirect if invalid problem ID
  useEffect(() => {
    if (!PROBLEMS[problemId]) {
      navigate("/problems/two-sum");
    }
  }, [problemId, navigate]);

  // Listen for window resize to update layout
  useEffect(() => {
    const handleResize = () => {
      setIsOnSmScreen(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [currentProblemId, setCurrentProblemId] = useState(problemId);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [userCode, setUserCode] = useState(
    PROBLEMS[problemId]?.starterCode?.javascript || ""
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
          toast.error("One or more tests failed! Check your output.", {
            duration: 4000,
          });
        }
      } else {
        if (result.timedOut) {
          toast.error("Code execution timed out!", { duration: 4000 });
        } else {
          toast.error("Code execution failed!", { duration: 4000 });
        }
      }
    } catch (error) {
      console.error("Error running user's code:", error);
      toast.error("An unexpected error occurred! Please try again.", {
        duration: 4000,
      });
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
        {/* Layout: vertical on small screens, horizontal on desktop */}
        <PanelGroup direction={isOnSmScreen ? "vertical" : "horizontal"}>
          {/* Problem info panel */}
          <Panel
            defaultSize={isOnSmScreen ? 50 : 40}
            minSize={isOnSmScreen ? 20 : 30}
            maxSize={isOnSmScreen ? 80 : 70}
          >
            <ProblemInfo
              problemId={currentProblemId}
              problem={currentProblem}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          {/* Responsive resize handle */}
          <PanelResizeHandle
            className={`${
              isOnSmScreen ? "h-2 cursor-row-resize" : "w-2 cursor-col-resize"
            } bg-base-300 transition-colors hover:bg-primary focus-within:bg-primary`}
          />

          {/* Code editor & output panel */}
          <Panel
            defaultSize={isOnSmScreen ? 50 : 60}
            minSize={isOnSmScreen ? 20 : 30}
            maxSize={isOnSmScreen ? 80 : 70}
          >
            <PanelGroup direction="vertical">
              {/* Code editor */}
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

              {/* Output panel */}
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
