import { Nav } from "../blocks/Nav";

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-primary-container text-on-primary-container md:flex">
      <div className="flex h-16 items-center px-6 font-headline text-headline-md">
        DMS
      </div>
      <Nav />
    </aside>
  );
}
