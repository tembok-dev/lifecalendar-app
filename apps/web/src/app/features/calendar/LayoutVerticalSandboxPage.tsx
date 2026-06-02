import { HeartBreakIcon } from "@phosphor-icons/react";
import { ArrowLeft, ArrowRight, ArrowUp, CalendarClock, CalendarDays, Expand, Info, Plus, Search, Settings, Shell } from "lucide-react";

export function VerticalPosterSandboxPage() {

  const lifeEvents = [
    {
      id: 1,
      year: 0,
      week: 12,
      icon: "👶",
      title: "Born",
    },
    {
      id: 2,
      year: 5,
      week: 34,
      icon: "🎒",
      title: "Started school",
    },
    {
      id: 3,
      year: 18,
      week: 24,
      icon: "🎓",
      title: "Graduated high school",
    },
    {
      id: 4,
      year: 24,
      week: 18,
      icon: "💍",
      title: "Anniversary",
    },
    {
      id: 5,
      year: 30,
      week: 9,
      icon: "👧",
      title: "First child born",
    },
    {
      id: 6,
      year: 34,
      week: 42,
      icon: "🏠",
      title: "Moved home",
    },
  ];



  const cal_grid_mt = "pt-[50px]"
  return (
    <main className="relative min-h-screen">
      {/* Temporary visual sandbox. Keep intentionally simple. */}
      {/* Do not extract components until layout is approved. */}
      {/* Do not add business logic here. */}
      {/* Top and bottom backdrop effects */}
      <div
        className="pointer-events-none fixed left-0 right-0 top-0 z-[12] h-[var(--poster-fade-height)] bg-[rgba(18,23,29,0.62)] backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_38%,transparent_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-[12] h-[calc(var(--poster-fade-height)*0.55)] bg-[rgba(18,23,29,0.35)] [mask-image:linear-gradient(to_top,black_0%,transparent_100%)]"
        aria-hidden
      />
      {/* Floating action buttons */}
      <div className="fixed bottom-[14px] right-[max(12px,calc((100vw-var(--poster-max-width))/2+14px))] z-[28] flex flex-col items-center gap-2 rounded-full bg-[rgba(17,23,28,0.5)] px-2 py-[7px] shadow-[inset_0_0_0_1px_rgba(229,236,244,0.06)] backdrop-blur-[10px]
      *:flex *:items-center *:justify-center ">
        <button
          type="button"
          aria-label="Quick add"
          className="h-7 w-7 rounded-full bg-transparent text-[rgba(217,225,234,0.68)] transition-colors duration-200 hover:bg-[rgba(231,238,245,0.08)] hover:text-[rgba(247,250,252,0.94)]"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Search"
          className="h-7 w-7 rounded-full bg-transparent text-[rgba(217,225,234,0.68)] transition-colors duration-200 hover:bg-[rgba(231,238,245,0.08)] hover:text-[rgba(247,250,252,0.94)]"
        >
          <Expand className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Info"
          className="h-7 w-7 rounded-full bg-transparent text-[rgba(217,225,234,0.68)] transition-colors duration-200 hover:bg-[rgba(231,238,245,0.08)] hover:text-[rgba(247,250,252,0.94)]"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      {/* Primary container */}
      <div className="mx-auto w-full max-w-[var(--poster-max-width)] px-[var(--poster-page-padding-x)] pb-12 ">
        {/* Top nav bar */}
        <div className="sticky top-[var(--poster-top-dock-offset)] z-30 mx-auto w-[min(100%,var(--poster-top-dock-width))]">
          <div className="group mx-auto flex w-full items-center justify-center gap-7 rounded-full bg-[rgba(17,22,27,0.10)] px-4 py-2 backdrop-blur-[10px]">
            <button type="button" aria-label="Calendar view" className="cursor-pointer border-none bg-transparent p-0">
              <CalendarDays className="h-6 w-6 scale-75 text-[rgba(227,235,244,0.52)] transition-all duration-200 group-hover:opacity-100 opacity-45 hover:scale-100 hover:text-[rgba(244,248,251,0.94)] hover:opacity-100 hover:brightness-110" />
            </button>
            <button type="button" aria-label="Settings" className="cursor-pointer border-none bg-transparent p-0">
              <Settings className="h-6 w-6 scale-75 text-[rgba(227,235,244,0.52)] transition-all duration-200 group-hover:opacity-100 opacity-45 hover:scale-100 hover:text-[rgba(244,248,251,0.94)] hover:opacity-100 hover:brightness-110" />
            </button>
          </div>
          <div className="mt-1.5">
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-[rgba(219,226,235,0.2)]">
              <div className="h-full rounded-full bg-[rgba(241,245,249,0.86)]" style={{ width: "41%" }} />
            </div>
          </div>
        </div>

        {/* Title and logo */}
        <div className="mx-auto w-full max-w-7xl">
          <header
            className="relative z-20 flex w-full justify-between "
            style={{ minHeight: "var(--poster-identity-height)" }}
          >
            <div className="flex items-start gap-1.5 text-sm text-zinc-300">
              <Shell className="size-5" strokeWidth={1.6} />
              <span className="leading-3">
                Life
                <br />
                Calendar
              </span>
            </div>

            <div className="flex flex-col items-end gap-2 text-left">
              <h1 className="text-balance text-4xl font-semibold leading-[0.95] tracking-tight text-zinc-100">
                Allan Mitre
              </h1>
              <div className="text-xs *:text-right text-zinc-400">
                <p>37 years old</p>
                <p className="mt-0.5 inline-flex items-center gap-1">
                  <CalendarClock className="h-3.5 w-3.5" />
                  2 upcoming
                </p>
              </div>
            </div>
          </header>
        </div>

        <div className=" relative mx-auto mt-7 w-full max-w-7xl pb-16">
          <section className="flex justify-center">
            <div className="flex w-full">
              <div className='absolute flex left-[50px] items-center gap-2 text-xs text-muted'>
                Weeks
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
              <div className="absolute origin-top-right top-[50px] -left-[50px] flex -rotate-90 items-center gap-2 text-xs text-muted">
                <ArrowLeft className="h-3.5 w-3.5" />
                Years
              </div>

              {/* Calendar grid container */}
              <div className="flex flex-col w-full gap-[2px] mt-[50px] ml-[30px]">
                {/* year row array to allow independent height grow on hover/focus intent */}
                {/* we do not track per cell click we do a general row click shows up modal to add event. we use the row range dates to show prefilled date maybe the start of the year? */}
                {Array.from({ length: 90 + 1 }).map((_, yIndex) => {
                  const eventsForYear = lifeEvents.filter((event) => event.year === yIndex);
                  const hasEvents = eventsForYear.length > 0;

                  const visibleEvents = eventsForYear.slice(0, 3);
                  const hiddenCount = eventsForYear.length - visibleEvents.length;

                  return (
                    // year row
                    // this only grows height if it has events
                    <div
                      key={yIndex}
                      className="
  group grid grid-cols-[20px_1fr_10%] items-center w-full gap-[2px]
  transition-all duration-200
">
                      {/* we still need to display year label every 10th and 0 year but also on hover */}
                      <div className="flex items-center text-xs text-muted opacity-0 group-hover:opacity-100      transition-opacity duration-200
                    ">{yIndex}</div>

                      {/* calendar cells */}
                      <div className="grid grid-cols-[repeat(52,minmax(0,1fr))] gap-[2px] w-full">
                        {Array.from({ length: 52 }).map((_, xIndex) => {
                          const week = xIndex + 1;
                          const eventInCell = eventsForYear.find((event) => event.week === week);

                          const cellId = `${yIndex * 52 + (xIndex + 1)}`;

                          return (
                            <div
                              key={xIndex}
                              className={`
                  relative aspect-square w-full rounded-[2px] border
                  transition-all duration-200
                  ${eventInCell ? "bg-white/10 border-white/40" : ""}
                `}
                            >
                              {eventInCell && (
                                <span className="absolute inset-0 flex items-center justify-center text-[8px]">
                                  {eventInCell.icon}
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      {/* Events list */}
                      {/* Events column */}
                      <div className="ml-4 overflow-hidden min-h-5">
                        {hasEvents && (
                          <div className="relative">
                            {/* Compact icons */}
                            <div
                              className="
          flex items-center gap-1
          opacity-100 group-hover:opacity-0
          transition-opacity duration-200
        "
                            >
                              {visibleEvents.map((event) => (
                                <span key={event.id} className="text-xs leading-none">
                                  {event.icon}
                                </span>
                              ))}

                              {hiddenCount > 0 && (
                                <span className="text-[10px] text-muted leading-none">
                                  +{hiddenCount}
                                </span>
                              )}
                            </div>

                            {/* Expanded list */}
                            <div
                              className="
          absolute left-0 top-0
          flex flex-col gap-1
          opacity-0 group-hover:opacity-100
          pointer-events-none group-hover:pointer-events-auto
          transition-opacity duration-200
        "
                            >
                              {eventsForYear.map((event) => (
                                <div
                                  key={event.id}
                                  className="flex items-center gap-2 text-xs whitespace-nowrap leading-none"
                                >
                                  <span className="shrink-0">{event.icon}</span>
                                  <span className="truncate">{event.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
                }
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export function LayoutVerticalSandboxPage() {
  return <VerticalPosterSandboxPage />;
}
