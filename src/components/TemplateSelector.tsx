import React, { useState } from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";

interface Template {
  name: string;
  description: string;
  value: string;
  icon?: string;
}

interface TemplateSelectorProps {
  templates: Template[];
  onSelect: (template: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  onSelect,
}) => {
  const items = templates.map((template) => ({
    label: `${template.icon || "📦"} ${template.name} - ${template.description}`,
    value: template.value,
  }));

  const handleSelect = (item: { value: string }) => {
    onSelect(item.value);
  };

  return (
    <Box flexDirection="column">
      <Text bold color="blue">
        🚀 Select a template for your addon:
      </Text>
      <Text color="gray">
        Choose the template that best matches your target platform
      </Text>
      <Box marginTop={1}>
        <SelectInput items={items} onSelect={handleSelect} />
      </Box>
    </Box>
  );
};

export { TemplateSelector };
