import { Command } from "commander";
import fs from "fs"

const program = new Command();

program
  .name("WebBack-3")
  .description("")
  .version("1.0.0");

program
  .option("-i, --input [file]", "Input file path")
  .option("-o, --output <file>", "Output file path")
  .option("-d, --display", "Display into console")
  .option("-c, --cylinders", "Number of cylinders")
  .option("-m --mpg <number>", "Display only records of vehicles with fuel economy below the specified level", parseFloat)

program.parse(process.argv);

const options = program.opts();

if (options.input === true || !options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

if(!fs.existsSync(options.input)){
    console.error("Cannot find input file")
    process.exit(1)
}


let outputData;

try {
    const { input } = options;
    outputData = fs
        .readFileSync(input, "utf-8")
        .split(/\r?\n/)
        .filter(Boolean)
        .map(JSON.parse);
} catch (err) {
    console.error(`Error404: ${err.message}`);
    process.exit(1);
}


if(options.mpg !== undefined && !isNaN(options.mpg)){
    outputData = outputData.filter(item => Number(item["mpg"]) > options.mpg)
}

if (options.output) {
    const linesToWrite = outputData.map(item => {
        let line = `${item["model"]}`;

        if (options.cylinders && item["cyl"] !== undefined) {
            line += ` ${item["cyl"]}`;
        }

        line += ` ${item["mpg"]}`;
        return line;
    }).join("\n");

    fs.writeFileSync(options.output, linesToWrite, "utf-8");
}


if (options.display) {
    outputData.forEach(item => {
        let line = `${item["model"]}`;

        if (options.cylinders && item["cyl"] !== undefined) {
            line += ` ${item["cyl"]}`;
        }

        line += ` ${item["mpg"]}`;
        console.log(line);
    });
}

