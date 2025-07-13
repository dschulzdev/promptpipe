// lint-staged.config.js
import path from "node:path";

/**
 * Filters out files that are inside the 'api-client' directory.
 * @param {string[]} filenames - The array of absolute file paths from lint-staged.
 * @returns {string} A space-separated string of filenames to lint.
 */
const filterIgnoredFiles = (filenames) => {
	const apiClientDir = path.resolve(
		process.cwd(),
		"apps",
		"web",
		"src",
		"api-client",
	);
	const filesToLint = filenames.filter(
		(file) => !file.startsWith(apiClientDir + path.sep),
	);

	// If no files are left after filtering, return an empty array to skip the command
	if (filesToLint.length === 0) {
		return [];
	}

	// Return the biome command with the filtered list of files
	// Using quotes to handle filenames with spaces
	return `biome check --write "${filesToLint.join('" "')}"`;
};

export default {
	"**/*.{js,jsx,ts,tsx}": filterIgnoredFiles,
	// Add other patterns if needed, for example:
	// '**/*.{json,md}': filterIgnoredFiles,
};
