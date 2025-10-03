export const ResultPage = () => {
  return (
    <main>
      <section className="w-[min(1600px,92%)] mx-auto">
        {/* INSERT <ResultsHeader /> here — delete placeholder block below and this comment*/}

        {/* Placeholder block start */}
        <div className="bg-white border-2 border-dashed border-[#e3e3e3] text-[#9a9a9a] rounded-[18px] block p-[clamp(12px,1.5vw,16px)] text-center">
          <div className="grid gap-[clamp(8px,1.2vw,14px)] grid-cols-1 w-full">
            <div className="bg-white border-2 border-dashed border-[#e3e3e3] text-[#9a9a9a] rounded-[18px] grid place-items-center text-center font-semibold w-full p-[clamp(9px,1vw,13px)] min-h-[clamp(36px,5vw,60px)]">
              All games heading component
            </div>
            <div className="bg-white border-2 border-dashed border-[#e3e3e3] text-[#9a9a9a] rounded-[18px] grid place-items-center text-center font-semibold w-full p-[clamp(9px,1vw,13px)] min-h-[clamp(40px,5.5vw,60px)]">
              Filters toolbar component
            </div>
            <div className="bg-white border-2 border-dashed border-[#e3e3e3] text-[#9a9a9a] rounded-[18px] grid place-items-center text-center font-semibold w-full p-[clamp(9px,1vw,13px)] min-h-[clamp(24px,3vw,34px)]">
              Results meta component
            </div>
          </div>
        </div>
        {/* Placeholder block end */}
      </section>

      <section className="w-[min(1600px,92%)] mx-auto" aria-label="Game list">
        {/* INSERT <ResultsGrid /> here — delete placeholder below and this comment*/}

        {/* Placeholder block start */}
        <div className="bg-white border-2 border-dashed border-[#e3e3e3] text-[#9a9a9a] rounded-[18px] text-center font-semibold p-[clamp(18px,2vw,26px)] w-full flex items-center justify-center min-h-[clamp(600px,50vh,1100px)]">
          Games grid component
        </div>
        {/* Placeholder block end */}
      </section>

      <nav className="w-[min(1600px,92%)] mx-auto" aria-label="Pagination">
        {/* INSERT <ResultsPagination /> here — delete placeholder below and this comment */}

        {/* INSERT <ResultsGrid /> here — delete placeholder below */}
        <div className="bg-white border-2 border-dashed border-[#e3e3e3] text-[#9a9a9a] rounded-[18px] p-[clamp(18px,2vw,26px)] flex gap-[10px] justify-center flex-wrap text-center font-semibold">
          Pagination component
        </div>
        {/* Placeholder block end */}
      </nav>
    </main>
  );
};
