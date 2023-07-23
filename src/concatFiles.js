const fs = require('fs');
const path = require('path');

function concatenateFiles(extension, directoryPath = '.', outputFileName) {
    function getAllFilesWithExtension(dir, fileList) {
        const files = fs.readdirSync(dir);

        fileList = fileList || [];

        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                fileList = getAllFilesWithExtension(filePath, fileList);
            } else if (path.extname(file) === `.${extension}`) {
                fileList.push(filePath);
            }
        });

        return fileList;
    }

    const baseDirectory = process.cwd();
    const resolvedDirectoryPath = path.join(baseDirectory, directoryPath);
    const filesToConcatenate = getAllFilesWithExtension(resolvedDirectoryPath);

    let concatenatedContent = '';

    for (const file of filesToConcatenate) {
        const fileContent = fs.readFileSync(file, 'utf8');
        concatenatedContent += fileContent;
    }

    const outputFile = outputFileName.endsWith(`.${extension}`)
        ? outputFileName
        : `${outputFileName}.${extension}`;

    // Create the output directory if it doesn't exist
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, concatenatedContent);
}

// Parse command-line arguments
const args = process.argv.slice(2);

// Usage example: node concatFiles.js css all-styles
// args[0]: 'css' - Extension
// args[1]: 'all-styles' - Output File Name
const [extension, outputFileName] = args;

concatenateFiles(extension, '.', outputFileName);