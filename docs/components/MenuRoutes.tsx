import { FC, Fragment } from "react";
import { Route } from "./routes";
import MenuLink from "./HeaderLink";
import MenuSection from "./MenuSection";

type Props = {
  basePath?: string;
  routes: Route[];
};

const combinePath = ({
  basePath,
  path,
  isAbsolute,
}: {
  basePath?: string;
  path: Route["path"];
  isAbsolute: Route["isAbsolute"];
}) => {
  if (!basePath || isAbsolute) return path;

  return `${basePath}/${path}`;
};

const MenuRoutes: FC<Props> = ({ routes, basePath }) => {
  // const pathName = usePathname();
  // console.log(pathName);
  return (
    <>
      {routes.map(({ menuName, path, children, isAbsolute }) =>
        children ? (
          <Fragment key={combinePath({ path, basePath, isAbsolute })}>
            <MenuSection>{menuName}</MenuSection>
            <MenuRoutes basePath={path} routes={children} />
          </Fragment>
        ) : (
          <MenuLink
            href={combinePath({ path, basePath, isAbsolute })}
            key={path}
          >
            {menuName}
          </MenuLink>
        ),
      )}
    </>
  );
};

export default MenuRoutes;
