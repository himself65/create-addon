import React, { useState } from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";

interface ProjectNameInputProps {
  onSubmit: (name: string) => void;
  initialValue?: string;
}

const ProjectNameInput: React.FC<ProjectNameInputProps> = ({
  onSubmit,
  initialValue = "",
}) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <Box flexDirection="column">
      <Text bold color="blue">
        📝 Enter your project name:
      </Text>
      <Text color="gray">
        This will be used as the directory name and package name
      </Text>
      <Box marginTop={1}>
        <Text color="green">Project name: </Text>
        <TextInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder="my-awesome-addon"
        />
      </Box>
    </Box>
  );
};

export { ProjectNameInput };
