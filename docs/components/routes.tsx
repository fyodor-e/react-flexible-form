export type Route = {
  menuName: string;
  path: string;
  children?: Route[];
  isAbsolute?: boolean;
};

const routes: Route[] = [
  {
    path: "/docs",
    menuName: "Documentation",
    children: [
      {
        path: "/",
        menuName: "Overview",
        isAbsolute: true,
      },
      {
        path: "getting-started",
        menuName: "Getting Started",
      },
      {
        path: "typescript",
        menuName: "TypeScript",
      },
    ],
  },
  {
    path: "/api",
    menuName: "API",
    children: [
      {
        path: "useForm",
        menuName: "useForm",
      },
      {
        path: "Field",
        menuName: "Field",
      },
      {
        path: "useSubform",
        menuName: "useSubform",
      },
      {
        path: "useFieldArray",
        menuName: "useFieldArray",
      },
      {
        path: "useConvert",
        menuName: "useConvert",
      },
      {
        path: "utils",
        menuName: "utils",
      },
    ],
  },
  {
    path: "/examples",
    menuName: "Examples",
    children: [
      {
        path: "simpleForm",
        menuName: "Simple Form",
      },
      {
        path: "chakra",
        menuName: "Chakra UI Form",
      },
      {
        path: "formWithArray",
        menuName: "Form with Array",
      },
      {
        path: "subform",
        menuName: "Subform",
      },
      {
        path: "customUseConvert",
        menuName: "Custom useConvert",
      },
      {
        path: "formStateInRedux",
        menuName: "Form State in Redux",
      },
      {
        path: "loader",
        menuName: "Form with Loader",
      },
      {
        path: "materialUi",
        menuName: "Form based on Material UI",
      },
      {
        path: "throttledValidation",
        menuName: "Throttled error validation",
      },
    ],
  },
];

export default routes;
