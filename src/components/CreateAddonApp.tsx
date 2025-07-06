import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import * as fs from "fs-extra";
import * as path from "path";
import { TemplateSelector } from "./TemplateSelector.js";
import { ProjectNameInput } from "./ProjectNameInput.js";
import { ProgressIndicator } from "./ProgressIndicator.js";
import { Summary } from "./Summary.js";

interface Template {
  name: string;
  description: string;
  value: string;
  icon?: string;
}

interface CreateAddonAppProps {
  projectName?: string;
  template?: string;
  skipInstall?: boolean;
  onExit: (code: number) => void;
}

const TEMPLATES: Template[] = [
  {
    name: "cpp-linux",
    description: "C++ addon for Linux platforms",
    value: "cpp-linux",
    icon: "🐧",
  },
  {
    name: "cpp-win32",
    description: "C++ addon for Windows platforms",
    value: "cpp-win32",
    icon: "🪟",
  },
  {
    name: "objective-c",
    description: "Objective-C addon for macOS",
    value: "objective-c",
    icon: "🍎",
  },
  {
    name: "swift",
    description: "Swift addon for macOS",
    value: "swift",
    icon: "🦉",
  },
];

type Step =
  | "project-name"
  | "template-selection"
  | "creating"
  | "success"
  | "error";

const CreateAddonApp: React.FC<CreateAddonAppProps> = ({
  projectName: initialProjectName,
  template: initialTemplate,
  skipInstall = false,
  onExit,
}) => {
  const [step, setStep] = useState<Step>("project-name");
  const [projectName, setProjectName] = useState(initialProjectName || "");
  const [selectedTemplate, setSelectedTemplate] = useState(
    initialTemplate || "",
  );
  const [error, setError] = useState<string>("");
  const [progressMessage, setProgressMessage] = useState("");

  useEffect(() => {
    if (initialProjectName && initialTemplate) {
      setStep("creating");
      createProject();
    } else if (initialProjectName) {
      setStep("template-selection");
    }
  }, []);

  const handleProjectNameSubmit = (name: string) => {
    setProjectName(name);
    if (initialTemplate) {
      setStep("creating");
      createProject();
    } else {
      setStep("template-selection");
    }
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setStep("creating");
    createProject();
  };

  const createProject = async () => {
    try {
      const templateToUse = selectedTemplate || initialTemplate!;
      const projectNameToUse = projectName || initialProjectName!;

      setProgressMessage("Checking project directory...");

      // Check if project directory already exists
      const projectDir = path.join(process.cwd(), projectNameToUse);
      if (await fs.pathExists(projectDir)) {
        setError(`Directory ${projectNameToUse} already exists`);
        setStep("error");
        return;
      }

      setProgressMessage("Copying template files...");

      // Get template directory - adjust path for compiled output
      const templateDir = path.join(
        __dirname,
        "..",
        "templates",
        templateToUse,
      );

      // Copy template files
      await fs.copy(templateDir, projectDir, {
        filter: (src) => {
          const basename = path.basename(src);
          return (
            basename !== "node_modules" &&
            basename !== "build" &&
            basename !== "build_swift"
          );
        },
      });

      setProgressMessage("Updating project configuration...");

      // Update package.json with project name
      const packageJsonPath = path.join(projectDir, "package.json");
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        packageJson.name = projectNameToUse;
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      }

      setStep("success");

      // Auto-exit after showing success for 3 seconds
      setTimeout(() => {
        onExit(0);
      }, 3000);
    } catch (err) {
      setError(`Error creating project: ${err}`);
      setStep("error");
      setTimeout(() => {
        onExit(1);
      }, 3000);
    }
  };

  const getSelectedTemplateInfo = () => {
    return TEMPLATES.find(
      (t) => t.value === (selectedTemplate || initialTemplate),
    );
  };

  const renderStep = () => {
    switch (step) {
      case "project-name":
        return (
          <ProjectNameInput
            onSubmit={handleProjectNameSubmit}
            initialValue={initialProjectName}
          />
        );

      case "template-selection":
        return (
          <TemplateSelector
            templates={TEMPLATES}
            onSelect={handleTemplateSelect}
          />
        );

      case "creating":
        return (
          <Box flexDirection="column">
            <Text bold color="blue">
              🔧 Creating your addon project...
            </Text>
            <Box marginTop={1}>
              <ProgressIndicator message={progressMessage} isLoading={true} />
            </Box>
          </Box>
        );

      case "success":
        const templateInfo = getSelectedTemplateInfo();
        return (
          <Summary
            projectName={projectName || initialProjectName!}
            template={selectedTemplate || initialTemplate!}
            templateDescription={templateInfo?.description || ""}
            skipInstall={skipInstall}
          />
        );

      case "error":
        return (
          <Box flexDirection="column">
            <ProgressIndicator message={error} error={true} />
            <Text color="gray">The CLI will exit automatically...</Text>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="magenta">
        🚀 create-addon
      </Text>
      <Text color="gray">Create Node.js native addons with ease</Text>
      <Box marginTop={1}>{renderStep()}</Box>
    </Box>
  );
};

export { CreateAddonApp };
