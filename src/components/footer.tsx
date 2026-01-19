export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Temática Eventos. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
