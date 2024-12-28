import type { MDXComponents } from "mdx/types";
import { codeToHtml } from "shiki";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // h1: ({ children }) => (
    //   <h1 style={{ color: "red", fontSize: "48px" }}>{children}</h1>
    // ),
    pre: async ({ children, ...props }) => {
      if (
        typeof children !== "object" ||
        typeof children.props.children !== "string"
      ) {
        return <pre {...props}>{children}</pre>;
      }

      const html = await codeToHtml(children.props.children, {
        lang: "tsx",
        theme: "github-dark-default",
      });
      return (
        <div
          className="code-highlight"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    },
  };
}
