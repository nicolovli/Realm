export const SkeletonCard = () => (
  <li className="list-none" aria-hidden="true">
    <span className="rounded-2xl ring-1 bg-lightpurple ring-gray dark:bg-darkpurple dark:ring-darkgray overflow-hidden animate-pulse block">
      <section className="relative w-full aspect-[16/9] bg-lightsearchbargray dark:bg-darksearchbargray rounded-xl" />
    </span>
  </li>
);
