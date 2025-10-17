import { useLocation, Link, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const Breadcrumbs = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const pathnames = location.pathname.split("/").filter((x) => x);

  const labels: Record<string, string> = {
    result: "Games",
    favorites: "Favorites",
    login: "Login",
  };

  // Hide breadcrumb on homepage, but keep space
  const hideBreadcrumb = location.pathname === "/";

  return (
    <Breadcrumb className="flex flex-col p-2 w-[min(1600px,92%)] mx-auto text-black dark:text-white min-h-[2.5rem]">
      {!hideBreadcrumb && (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            // Todo sprint 3: change the label om breadcrumbs to be the name of the game instead of the id
            const label =
              name === id
                ? id
                : labels[name] || name.charAt(0).toUpperCase() + name.slice(1);

            return (
              <section key={routeTo} className="flex items-center">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={routeTo}>{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </section>
            );
          })}
        </BreadcrumbList>
      )}
    </Breadcrumb>
  );
};
