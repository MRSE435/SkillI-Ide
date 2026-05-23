import { NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";

function runCommand(command) {
    return new Promise((resolve) => {
        exec(command, { timeout: 7000 }, (error, stdout, stderr) => {
            if (error) {
                resolve(stderr || error.message);
                return;
            }

            resolve(stdout || stderr || "No output");
        });
    });
}

export async function POST(request) {
    try {
        const { language, code } = await request.json();

        if (!language || !code) {
            return NextResponse.json(
                { error: "Language and code are required" },
                { status: 400 }
            );
        }

        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "runner-"));

        let fileName = "";
        let command = "";

        if (language === "javascript") {
            fileName = "main.js";
            await fs.writeFile(path.join(tempDir, fileName), code);

            command = `docker run --rm -v "${tempDir}:/app" -w /app node:20 node main.js`;
        }

        if (language === "python") {
            fileName = "main.py";
            await fs.writeFile(path.join(tempDir, fileName), code);

            command = `docker run --rm -v "${tempDir}:/app" -w /app python:3.11 python main.py`;
        }


        if (language === "cpp") {
            fileName = "main.cpp";
            await fs.writeFile(path.join(tempDir, fileName), code);

            command = `docker run --rm -v "${tempDir}:/app" -w /app gcc:latest sh -c "g++ main.cpp -o main && ./main"`;
        }



        if (!command) {
            return NextResponse.json(
                { error: "Unsupported language" },
                { status: 400 }
            );
        }

        const output = await runCommand(command);

        await fs.rm(tempDir, {
            recursive: true,
            force: true,
        });

        return NextResponse.json({ output });
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}