#!/usr/bin/env node

/**
 * Color Migration Script
 *
 * This script automatically updates Tailwind color classes to use the new semantic design system.
 * It replaces hardcoded color values with semantic color tokens for better maintainability.
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Color mapping from old classes to new semantic classes
const colorMappings = {
  // Text colors
  "text-gray-900": "text-text-primary",
  "text-gray-800": "text-text-primary",
  "text-gray-700": "text-text-secondary",
  "text-gray-600": "text-text-secondary",
  "text-gray-500": "text-text-muted",
  "text-gray-400": "text-text-muted",
  "text-white": "text-text-inverse",
  "text-black": "text-text-primary",

  // Background colors
  "bg-white": "bg-background",
  "bg-gray-50": "bg-surface",
  "bg-gray-100": "bg-surface",
  "bg-gray-200": "bg-surface-hover",
  "bg-gray-800": "bg-surface dark:bg-surface",
  "bg-gray-900": "bg-background dark:bg-background",

  // Border colors
  "border-gray-200": "border-border",
  "border-gray-300": "border-border",
  "border-gray-400": "border-border-hover",

  // Button colors
  "bg-blue-600": "bg-btn-primary",
  "bg-blue-500": "bg-btn-primary",
  "hover:bg-blue-700": "hover:bg-btn-primary-hover",
  "hover:bg-blue-600": "hover:bg-btn-primary-hover",
  "text-blue-600": "text-text-link",
  "hover:text-blue-700": "hover:text-text-link-hover",

  // Status colors
  "bg-green-100": "bg-status-success-bg",
  "text-green-600": "text-status-success-text",
  "text-green-800": "text-status-success-text",
  "bg-red-100": "bg-status-error-bg",
  "text-red-600": "text-status-error-text",
  "text-red-800": "text-status-error-text",
  "bg-yellow-100": "bg-status-warning-bg",
  "text-yellow-600": "text-status-warning-text",
  "text-yellow-800": "text-status-warning-text",
  "bg-blue-100": "bg-status-info-bg",
  "text-blue-800": "text-status-info-text",

  // Emerald colors (success)
  "text-emerald-600": "text-status-success-text",
  "bg-emerald-100": "bg-status-success-bg",

  // Purple colors (brand)
  "bg-purple-950": "bg-brand-primary",
  "text-purple-600": "text-brand-primary",

  // Danger/destructive colors
  "bg-red-500": "bg-btn-danger",
  "bg-red-600": "bg-btn-danger",
  "hover:bg-red-600": "hover:bg-btn-danger-hover",
  "hover:bg-red-700": "hover:bg-btn-danger-hover",
  "text-red-500": "text-status-error",

  // Disabled colors
  "bg-gray-400": "bg-btn-disabled",
  "disabled:bg-gray-400": "disabled:bg-btn-disabled",
  "bg-green-500": "bg-status-success",
  "hover:bg-green-500": "hover:bg-status-success",
};

// Files to process (TypeScript and JavaScript files in components and app directories)
const filePatterns = [
  "components/**/*.{ts,tsx,js,jsx}",
  "app/**/*.{ts,tsx,js,jsx}",
];

/**
 * Process a single file and replace color classes
 */
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let hasChanges = false;

    // Replace each color mapping
    Object.entries(colorMappings).forEach(([oldClass, newClass]) => {
      const regex = new RegExp(
        `\\b${oldClass.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "g"
      );
      if (content.includes(oldClass)) {
        content = content.replace(regex, newClass);
        hasChanges = true;
      }
    });

    // Write back if changes were made
    if (hasChanges) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Main execution function
 */
function main() {
  console.log("🚀 Starting color class migration...\n");

  let totalFiles = 0;
  let updatedFiles = 0;

  // Process each file pattern
  filePatterns.forEach((pattern) => {
    const files = glob.sync(pattern, { cwd: process.cwd() });

    files.forEach((file) => {
      totalFiles++;
      const fullPath = path.resolve(file);

      if (processFile(fullPath)) {
        updatedFiles++;
      }
    });
  });

  console.log("\n📊 Migration Summary:");
  console.log(`   Total files processed: ${totalFiles}`);
  console.log(`   Files updated: ${updatedFiles}`);
  console.log(`   Files unchanged: ${totalFiles - updatedFiles}`);

  if (updatedFiles > 0) {
    console.log("\n✨ Migration completed successfully!");
    console.log("💡 Please review the changes and test your application.");
  } else {
    console.log("\n🎉 No files needed updating - all good!");
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { processFile, colorMappings };
