import { useLocation, Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_GAME } from "@/lib/graphql";
import type { GetGameData, GetGameVariables } from "@/types";
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

  const inferredId =
    id ?? (pathnames.length ? pathnames[pathnames.length - 1] : undefined);

  const navState = location.state ?? undefined;
  const nameFromState: string | undefined =
    navState?.name || navState?.game?.name;

  const isGamePage = pathnames.length >= 2 && pathnames[0] === "games";

  const { data: gameData } = useQuery<GetGameData, GetGameVariables>(GET_GAME, {
    variables: { id: inferredId ?? "" },
    // skip the query when this is not a game detail page
    skip: !isGamePage || !inferredId,
  });

  return (
    <Breadcrumb className="flex flex-col p-2 w-[min(1600px,92%)] mx-auto text-black dark:text-white min-h-[2.5rem]">
      {!hideBreadcrumb && (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="hover:underline">
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const label =
              name === inferredId && isGamePage
                ? (nameFromState ??
                  gameData?.game?.name ?? (
                    <span className="italic text-muted-foreground">
                      Loading…
                    </span>
                  ))
                : labels[name] || name.charAt(0).toUpperCase() + name.slice(1);

            return (
              <section key={routeTo} className="flex items-center">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage aria-current="page">{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink className="hover:underline" asChild>
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
