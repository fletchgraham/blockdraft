const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

(async () => {
  const clipboardy = await import("clipboardy");

  const iconName = await prompt(
    "Have the icon jsx ready in your clipboard,\nthen enter the name of the icon (e.g., TrashIcon): "
  );
  if (!iconName) {
    console.log("Icon name is required. Exiting...");
    rl.close();
    return;
  }

  console.log("Reading SVG JSX from clipboard...");

  let svgJSX;
  try {
    svgJSX = clipboardy.default.readSync();

    if (!svgJSX || !svgJSX.trim().startsWith("<svg")) {
      throw new Error("Clipboard does not contain valid SVG JSX.");
    }

    // Replace any existing `class` or `className` attributes with `{props.className}`
    svgJSX = svgJSX.replace(/class(Name)?="[^"]*"/, "className={className}");

    if (!svgJSX.includes("className={className}")) {
      // Ensure the className is added if not already present
      svgJSX = svgJSX.replace(/<svg([^>]*)>/, "<svg$1 className={className}>");
    }
  } catch (error) {
    console.error(
      "Failed to read or validate SVG JSX from clipboard:",
      error.message
    );
    rl.close();
    return;
  }

  const iconFileName = `${iconName}.jsx`;
  const componentsDir = path.join(__dirname, "..", "components", "icons");
  const iconFilePath = path.join(componentsDir, iconFileName);
  const indexFilePath = path.join(componentsDir, "index.js");

  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  // Write the component file
  const componentCode = `
export default function ${iconName}({className="size-5"}) {
  return (
    ${svgJSX.trim()}
  );
}
  `;
  fs.writeFileSync(iconFilePath, componentCode.trim());
  console.log(`Created ${iconFileName}`);

  // Update the index.js file
  const indexContent = fs.existsSync(indexFilePath)
    ? fs.readFileSync(indexFilePath, "utf8")
    : "";

  const exportLine = `\n// ${iconName}\nimport ${iconName} from "./${iconName}";`;
  const exportStatement = `export { ${iconName} };`;

  const newIndexContent = `${indexContent.trim()}\n${exportLine}\n${exportStatement}\n`;
  fs.writeFileSync(indexFilePath, newIndexContent.trim());
  console.log(`Updated index.js`);

  // Copy the import statement to the clipboard
  const importStatement = `import { ${iconName} } from "@/components/icons";`;
  clipboardy.default.writeSync(importStatement);
  console.log("Import statement copied to clipboard!");

  rl.close();
})();
