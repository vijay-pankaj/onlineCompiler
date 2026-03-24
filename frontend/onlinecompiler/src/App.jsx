import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const LANGUAGES = [
  { value: "python",     label: "Python",      icon: "🐍", color: "text-green-400",  border: "border-green-500",  bg: "bg-green-500/10" },
  { value: "cpp",        label: "C++",         icon: "⚙️", color: "text-purple-400", border: "border-purple-500", bg: "bg-purple-500/10" },
  { value: "java",       label: "Java",        icon: "☕", color: "text-orange-400", border: "border-orange-500", bg: "bg-orange-500/10" },
  { value: "javascript", label: "JavaScript",  icon: "🟨", color: "text-yellow-400", border: "border-yellow-500", bg: "bg-yellow-500/10" },
];

function App() {
  const [code, setCode] = useState("# Write your code here\nprint('Hello, World!')");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [runTime, setRunTime] = useState(null);

  const activeLang = LANGUAGES.find((l) => l.value === language);

  const runCode = async () => {
    setLoading(true);
    setOutput("");
    setError("");
    setRunTime(null);
    const start = Date.now();
    try {
      const res = await axios.post("http://3.25.155.213:5000/run", { code, language });
      setRunTime(((Date.now() - start) / 1000).toFixed(2));
      if (res.data.error) setError(res.data.error);
      else setOutput(res.data.output);
    } catch (err) {
      setError("Server error: " + err.message);
    }
    setLoading(false);
  };

  const clearCode = () => {
    setCode("");
    setOutput("");
    setError("");
    setRunTime(null);
  };

  const defaultCode = {
    python:     "# Python\nprint('Hello, World!')",
    cpp:        '#include<iostream>\nusing namespace std;\nint main(){\n    cout<<"Hello, World!";\n    return 0;\n}',
    java:       'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    javascript: "// JavaScript\nconsole.log('Hello, World!');",
  };

  const handleLangChange = (val) => {
    setLanguage(val);
    setCode(defaultCode[val]);
    setOutput("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-blue-400 text-xl font-bold tracking-tight">⚡ CodeRun</span>
          <span className="text-gray-600 text-sm hidden sm:block">Online Compiler</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full border ${activeLang.border} ${activeLang.bg} ${activeLang.color} font-medium`}>
            {activeLang.icon} {activeLang.label}
          </span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

        <div className="flex flex-col flex-1 min-w-0">

          <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center gap-2 flex-wrap">

            <div className="flex gap-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => handleLangChange(lang.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${
                    language === lang.value
                      ? `${lang.bg} ${lang.border} ${lang.color}`
                      : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {lang.icon} {lang.label}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={clearCode}
                className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-800 transition-all border border-transparent hover:border-gray-700"
              >
                Clear
              </button>
              <button
                onClick={runCode}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:text-blue-400 text-white text-sm font-semibold px-5 py-1.5 rounded-lg transition-all active:scale-95"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Running...
                  </>
                ) : (
                  <>▶ Run</>
                )}
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-[300px]">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              onChange={(val) => setCode(val || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "JetBrains Mono, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                roundedSelection: true,
                padding: { top: 16 },
                renderLineHighlight: "all",
              }}
            />
          </div>
        </div>

        {/* ── RIGHT: OUTPUT PANEL ── */}
        <div className="lg:w-96 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-900">

          {/* Output header */}
          <div className="px-4 py-2 border-b border-gray-800 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-400">Output</span>
            {runTime && (
              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">
                ⏱ {runTime}s
              </span>
            )}
          </div>

          {/* Output content */}
          <div className="flex-1 p-4 overflow-auto font-mono text-sm">
            {!output && !error && !loading && (
              <p className="text-gray-600 text-center mt-8">
                Press <span className="text-blue-400 font-semibold">▶ Run</span> to see output
              </p>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-blue-400 mt-8 justify-center">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Executing...
              </div>
            )}

            {output && !loading && (
              <div className="bg-gray-950 rounded-lg p-3 border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  <span className="text-green-400 text-xs font-semibold">SUCCESS</span>
                </div>
                <pre className="text-green-300 whitespace-pre-wrap break-words leading-relaxed">{output}</pre>
              </div>
            )}

            {error && !loading && (
              <div className="bg-gray-950 rounded-lg p-3 border border-red-900">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <span className="text-red-400 text-xs font-semibold">ERROR</span>
                </div>
                <pre className="text-red-300 whitespace-pre-wrap break-words leading-relaxed">{error}</pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 border-t border-gray-800 px-6 py-2 text-center text-gray-600 text-xs">
        CodeRun — Supports Python · C++ · Java · JavaScript
      </footer>
    </div>
  );
}

export default App;
