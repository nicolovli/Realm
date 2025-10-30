import { Logo } from "@/assets/Logo";

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-darkmodebackground text-gray-800 dark:text-gray-200 py-8">
      <hr className="border-gray-300 dark:border-gray-700 my-6" />

      <section className="w-[min(1600px,90%)] mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <section className="flex flex-col items-center md:items-start">
          <span className="flex items-center space-x-2">
            <Logo
              size={40}
              className="text-lightbuttonpurple dark:text-darkpurple"
            />
            <h1 className="text-2xl md:text-4xl font-bold tracking-wide text-lightbuttonpurple dark:text-darkpurple">
              Realm
            </h1>
          </span>
          <p className="mt-1 text-sm md:text-base opacity-80">
            A portal to the gaming universe
          </p>
        </section>
      </section>

      <p className="text-center text-xs md:text-sm opacity-70">
        © 2025 Realm. All rights reserved.
      </p>
    </footer>
  );
};
