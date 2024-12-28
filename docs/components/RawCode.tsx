import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { codeToHtml } from "shiki";

const readExampleFile = async (name: string) => {
  if (!name) return "";
  const filePath = resolve("app/examples/", name);

  const fileContent = await readFile(filePath, "utf-8");
  return fileContent;
};

const codeStart = /\n.*Important code start.*/gi;
const codeEnd = /\n.*Important code end.*/gi;
const codeJoiner = "\n\n// ... Other code ... \n";

const RawCode = async ({
  fileName,
  showFullCode,
}: {
  fileName: string;
  showFullCode?: boolean;
}) => {
  const contents = await readExampleFile(fileName);
  let code = contents;

  if (!showFullCode) {
    const start = contents.match(codeStart);
    const end = contents.match(codeEnd);
    const codeBlocks = start
      ?.map((s, i) => {
        const si = contents.indexOf(s);
        const ei = end ? contents.indexOf(end[i]) : -1;
        return si > 0
          ? contents
              .slice(si, ei > 0 ? ei : undefined)
              .replace(codeStart, "")
              .replace(codeEnd, "")
          : undefined;
      })
      .filter((s): s is string => !!s);

    code = codeBlocks?.join(codeJoiner) ?? contents;
  }

  const highlightedCode = await codeToHtml(code, {
    lang: "tsx",
    theme: "github-dark-default",
  });

  return (
    <div
      className="code-highlight"
      style={{
        overflow: "auto",
        maxHeight: "500px",
        flex: "1 0 500px",
      }}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
};

export default RawCode;
