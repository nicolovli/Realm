import { vi } from "vitest";
import { SEARCH_GAMES } from "@/lib/graphql";

export const mockNavigate = vi.fn();

export const mockGames = [
  {
    id: "1",
    sid: "portal-2",
    name: "Portal 2",
    image: "portal2.jpg",
    publishers: ["Valve"],
  },
  {
    id: "2",
    sid: "portal",
    name: "Portal",
    image: "portal.jpg",
    publishers: ["Valve"],
  },
];

export const searchMocks = [
  {
    request: { query: SEARCH_GAMES, variables: { query: "portal", limit: 6 } },
    result: { data: { searchGames: mockGames } },
  },
];
