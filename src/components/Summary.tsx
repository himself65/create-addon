import React from "react";
import { Box, Text } from "ink";

interface SummaryProps {
  projectName: string;
  template: string;
  templateDescription: string;
  skipInstall?: boolean;
}

const Summary: React.FC<SummaryProps> = ({
  projectName,
  template,
  templateDescription,
  skipInstall = false,
}) => {
  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold color="green">
        🎉 Project created successfully!
      </Text>

      <Box marginTop={1} flexDirection="column">
        <Text color="blue">📋 Project Summary:</Text>
        <Text>
          {" "}
          • Name: <Text color="yellow">{projectName}</Text>
        </Text>
        <Text>
          {" "}
          • Template: <Text color="yellow">{template}</Text>
        </Text>
        <Text>
          {" "}
          • Description: <Text color="gray">{templateDescription}</Text>
        </Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text bold color="blue">
          🔧 Next steps:
        </Text>
        <Text color="gray"> cd {projectName}</Text>
        {!skipInstall && (
          <>
            <Text color="gray"> npm install</Text>
            <Text color="gray"> npm run build</Text>
          </>
        )}
        <Text color="gray"> npm test</Text>
      </Box>

      <Box marginTop={1}>
        <Text color="green">Happy coding! 🚀</Text>
      </Box>
    </Box>
  );
};

export { Summary };
