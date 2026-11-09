export function PageIntro({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <header className="max-w-2xl">
      <h1 className="title-page">{title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{children}</p>
    </header>
  );
}
