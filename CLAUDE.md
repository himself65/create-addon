# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `create-addon`, a CLI tool for generating Node.js native addon projects. It provides scaffolding for C++, Objective-C, and Swift addons with platform-specific templates. The CLI features an interactive UI built with React and Ink.

## Architecture

### Core Components

- **CLI Entry Point**: `src/bin/index.ts` - Main CLI implementation using yargs and Ink
- **Interactive UI**: `src/components/` - React components for the CLI interface
- **Template System**: `templates/` - Contains boilerplate code for different addon types
- **Build System**: Uses bunchee for TypeScript compilation to `dist/`

### Templates Structure

Each template in `templates/` follows this pattern:

- `binding.gyp` - node-gyp build configuration
- `package.json` - Template package configuration
- `src/` - Native code (C++, Objective-C, Swift)
- `include/` - Header files
- `js/index.js` - JavaScript wrapper using EventEmitter pattern

### Template Types

- **cpp-linux**: C++ addon with GTK+ integration for Linux
- **cpp-win32**: C++ addon for Windows platforms
- **objective-c**: Objective-C addon for macOS with Todo functionality
- **swift**: Swift addon for macOS with bridge to JavaScript

## Commands

### Development

```bash
# Build the CLI (builds to dist/ using bunchee)
pnpm run build

# Build with watch mode for development
pnpm run dev

# Test the CLI locally (after building)
node dist/bin.js

# Install dependencies
pnpm install
```

### Generated Project Commands

Each generated addon project includes:

```bash
# Build the native addon
npm run build

# Clean build artifacts
npm run clean
```

## Working with Templates

- All templates use `node-addon-api` for modern N-API bindings
- Templates include EventEmitter-based JavaScript wrappers
- Platform detection prevents loading incompatible addons
- Templates demonstrate Todo functionality as example implementation

## Template Architecture Patterns

### JavaScript Wrapper Pattern

All templates use a consistent pattern:

1. Platform check before loading native module
2. EventEmitter inheritance for event handling
3. Private `#parse` method for payload processing
4. Conditional module.exports based on platform

### Native Module Structure

- Main addon class extends EventEmitter capabilities
- Consistent method naming (`helloWorld`, `helloGui`)
- Event-driven architecture for todo operations
- JSON payload communication between native and JavaScript

## Interactive UI Components

The CLI uses React components with Ink for a modern interactive experience:

- **CreateAddonApp**: Main application component managing the flow with state machine pattern (project-name → template-selection → creating → success/error)
- **ProjectNameInput**: Interactive project name input with validation
- **TemplateSelector**: Visual template selection with icons and descriptions
- **ProgressIndicator**: Real-time progress feedback with spinners
- **Summary**: Success screen with next steps

### UI Flow States

The interactive flow follows these states:

1. `project-name` - Collect project name if not provided
2. `template-selection` - Select template if not provided via CLI args
3. `creating` - Show progress while copying files and updating configuration
4. `success` - Display completion with next steps (auto-exits after 3s)
5. `error` - Show error message (auto-exits after 3s)

## Build Configuration

- Uses `bunchee` for bundling TypeScript with ESM support
- Workspace configuration in `pnpm-workspace.yaml` includes templates as packages
- Templates are excluded from main build but included in CLI distribution
- Project configured as ESM module with React JSX support
- TypeScript config targets ES2022 with bundler module resolution
- Built files go to `dist/` directory, with `dist/bin.js` as the main entry point

## CLI Arguments and Usage

The CLI supports both interactive and non-interactive modes:

```bash
# Interactive mode (prompts for missing options)
create-addon

# Semi-interactive (prompt for template)
create-addon my-project

# Non-interactive (all options provided)
create-addon my-project --template cpp-linux

# With additional options
create-addon my-project -t swift --skip-install
```

Available templates: `cpp-linux`, `cpp-win32`, `objective-c`, `swift`

## Template File Structure

Templates are located in `templates/` and follow this structure:

- `binding.gyp` - node-gyp configuration for native compilation
- `package.json` - Template package with build scripts and dependencies
- `src/` - Native source code (C++, Objective-C, Swift)
- `include/` - Header files
- `js/index.js` - JavaScript wrapper with platform detection and EventEmitter pattern

Template package.json gets updated with the user's project name during creation.
