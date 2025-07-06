import * as fs from "fs-extra";
import * as path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import inquirer from "inquirer";
import React from "react";
import { render } from "ink";
import { CreateAddonApp } from "../components/CreateAddonApp.js";

interface CreateAddonOptions {
  projectName: string;
  template?: string;
  typescript?: boolean;
  skipInstall?: boolean;
}

const TEMPLATES = [
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

async function createAddon(options: CreateAddonOptions): Promise<void> {
  const { projectName, template, skipInstall } = options;

  console.log(chalk.blue(`Creating addon project: ${projectName}`));

  // Get template directory - adjust path for compiled output
  const templateDir = path.join(__dirname, "..", "templates", template!);
  const projectDir = path.join(process.cwd(), projectName);

  // Check if project directory already exists
  if (await fs.pathExists(projectDir)) {
    console.log(chalk.red(`Error: Directory ${projectName} already exists`));
    process.exit(1);
  }

  try {
    // Copy template files
    console.log(chalk.green(`=� Copying template files...`));
    await fs.copy(templateDir, projectDir, {
      filter: (src) => {
        // Skip node_modules and build directories
        const basename = path.basename(src);
        return (
          basename !== "node_modules" &&
          basename !== "build" &&
          basename !== "build_swift"
        );
      },
    });

    // Update package.json with project name
    const packageJsonPath = path.join(projectDir, "package.json");
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = projectName;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }

    console.log(chalk.green(` Project created successfully!`));
    console.log(chalk.blue(`\nNext steps:`));
    console.log(chalk.gray(`  cd ${projectName}`));

    if (!skipInstall) {
      console.log(chalk.gray(`  npm install`));
      console.log(chalk.gray(`  npm run build`));
    }

    console.log(chalk.gray(`  npm test`));
  } catch (error) {
    console.error(chalk.red(`Error creating project: ${error}`));
    process.exit(1);
  }
}

async function promptForTemplate(): Promise<string> {
  const { template } = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "Select a template:",
      choices: TEMPLATES.map((t) => ({
        name: `${t.name} - ${t.description}`,
        value: t.value,
      })),
    },
  ]);

  return template;
}

async function main(): Promise<void> {
  await yargs(hideBin(process.argv))
    .scriptName("create-addon")
    .usage("$0 [project-name] [options]")
    .command(
      "$0 [project-name]",
      "Create a new Node.js native addon project",
      (yargs) => {
        return yargs
          .positional("project-name", {
            describe: "Name of the project to create",
            type: "string",
          })
          .option("template", {
            alias: "t",
            describe: "Template to use",
            type: "string",
            choices: TEMPLATES.map((t) => t.value),
          })
          .option("typescript", {
            alias: "ts",
            describe: "Initialize as TypeScript project",
            type: "boolean",
            default: false,
          })
          .option("skip-install", {
            describe: "Skip installing dependencies",
            type: "boolean",
            default: false,
          });
      },
      async (argv) => {
        const projectName = argv["project-name"] as string;
        const template = argv.template as string;

        // Validate template if provided
        if (template && !TEMPLATES.some((t) => t.value === template)) {
          console.error(chalk.red(`Error: Invalid template "${template}"`));
          console.error(
            chalk.gray(
              `Available templates: ${TEMPLATES.map((t) => t.value).join(", ")}`,
            ),
          );
          process.exit(1);
        }

        // Launch interactive UI
        const { waitUntilExit } = render(
          React.createElement(CreateAddonApp, {
            projectName,
            template,
            skipInstall: argv["skip-install"],
            onExit: (code: number) => {
              process.exit(code);
            },
          }),
        );

        await waitUntilExit();
      },
    )
    .help()
    .alias("help", "h")
    .version(false)
    .example("$0", "Create a new addon project with interactive prompts")
    .example(
      "$0 my-addon",
      "Create a new addon project with interactive template selection",
    )
    .example(
      "$0 my-addon --template cpp-linux",
      "Create a new addon project with C++ Linux template",
    )
    .example(
      "$0 my-addon -t swift --skip-install",
      "Create a Swift addon project without installing dependencies",
    )
    .epilogue(
      "For more information, visit: https://github.com/himself65/create-addon",
    ).argv;
}

process.on("unhandledRejection", (err) => {
  console.error(chalk.red("Unhandled promise rejection:"), err);
  process.exit(1);
});

main().catch((error) => {
  console.error(chalk.red("Error:"), error);
  process.exit(1);
});
