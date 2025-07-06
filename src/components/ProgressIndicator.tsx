import React from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

interface ProgressIndicatorProps {
  message: string;
  isLoading?: boolean;
  success?: boolean;
  error?: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  message,
  isLoading = false,
  success = false,
  error = false,
}) => {
  const getIcon = () => {
    if (error) return "❌";
    if (success) return "✅";
    if (isLoading) return <Spinner type="dots" />;
    return "📦";
  };

  const getColor = () => {
    if (error) return "red";
    if (success) return "green";
    if (isLoading) return "blue";
    return "white";
  };

  return (
    <Box>
      <Text color={getColor()}>
        {getIcon()} {message}
      </Text>
    </Box>
  );
};

export { ProgressIndicator };
