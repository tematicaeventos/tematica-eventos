import { Award, Eye, Phone, Mail, MapPin, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="animate-fade-in-up">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">
              Sobre Nosotros
            </h1>
            <h2 className="text-3xl font-bold font-headline text-foreground mt-8">
              20 Años Creando Momentos Inolvidables
            </h2>
            <div className="max-w-3xl mx-auto mt-6 text-foreground/90">
              <p>
                Desde nuestros inicios, hace más de dos décadas, en Temática Eventos hemos tenido un solo propósito: hacer realidad la celebración que imaginas. Nuestra trayectoria es el reflejo de cientos de eventos exitosos, desde bodas de ensueño y quinceañeros mágicos hasta eventos corporativos de alto impacto. La experiencia nos ha enseñado que cada detalle cuenta. Por eso, nuestro equipo de profesionales se dedica con pasión y esmero a la planificación, coordinación y ejecución de cada evento, garantizando no solo calidad, sino también la tranquilidad de saber que todo está bajo control.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center max-w-4xl mx-auto">
            <Card className="bg-card border-border/50">
              <CardHeader>
                <Award className="h-10 w-10 mx-auto text-primary" />
                <CardTitle className="mt-4 text-2xl font-headline text-foreground">Misión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90">
                  Materializar los sueños de nuestros clientes, creando eventos únicos y memorables a través de un servicio excepcional, creatividad sin límites y una ejecución impecable. Nos comprometemos a superar las expectativas en cada detalle.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50">
              <CardHeader>
                <Eye className="h-10 w-10 mx-auto text-primary" />
                <CardTitle className="mt-4 text-2xl font-headline text-foreground">Visión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90">
                  Ser la empresa líder en organización de eventos en la región, reconocida por nuestra innovación, calidad y la capacidad de transformar cualquier celebración en una experiencia extraordinaria. Aspiramos a ser el aliado de confianza para todos los momentos importantes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4 text-center">
          <Building className="h-10 w-10 mx-auto text-primary" />
          <h2 className="text-3xl font-bold font-headline text-foreground mt-4">
            Nuestros Datos
          </h2>
          <p className="mt-2 text-lg text-foreground/90">
            Estamos aquí para ayudarte a planificar tu próximo gran evento.
          </p>
          <div className="mt-8 space-y-4 max-w-md mx-auto text-left">
              <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
                  <Mail className="h-5 w-5 text-primary" />
                  <p className="text-foreground/90">hernan.ramirez@tematicaeventos.com (ejemplo)</p>
              </div>
               <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
                  <Phone className="h-5 w-5 text-primary" />
                  <p className="text-foreground/90">3045295251</p>
              </div>
               <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
                  <MapPin className="h-5 w-5 text-primary" />
                  <p className="text-foreground/90">Calle 18 # 5-17, Soacha, Cundinamarca</p>
              </div>
          </div>
          <p className="mt-8 text-foreground/90">Hernan Ramirez Sanchez - Gerente General</p>
        </div>
      </section>
    </div>
  );
}
