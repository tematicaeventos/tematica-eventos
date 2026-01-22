import type { Quote } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const LOGO_URL = 'https://i.imgur.com/xT5LV1a.png';

type QuotePDFDocumentProps = {
  quote: Quote;
  quoteId: string;
};

const QuotePDFDocument: React.FC<QuotePDFDocumentProps> = ({ quoteId, quote }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const currentDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white text-gray-800 p-12 font-sans text-sm relative" style={{ width: '794px', height: '1123px' }}>
      <header className="flex justify-between items-center pb-6 border-b-4 border-yellow-500">
        <div className="w-1/3">
          <img src={LOGO_URL} alt="Temática Eventos Logo" className="max-w-[180px]" />
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Cotización</h2>
          <p className="text-gray-600 mt-1 font-semibold text-lg">{quoteId}</p>
          <p className="text-gray-500">{currentDate}</p>
        </div>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-gray-500 uppercase tracking-wider text-xs mb-2">Para:</h3>
          <p className="font-bold text-gray-900">{quote.nombreCliente}</p>
          <p className="text-gray-600">{quote.correo}</p>
          <p className="text-gray-600">{quote.telefono}</p>
          {(quote.direccion || quote.barrio) && (
            <p className="text-gray-600 mt-2">
                {quote.direccion}{quote.direccion && quote.barrio ? ', ' : ''}{quote.barrio}
            </p>
          )}
        </div>
        <div className="text-right">
          <h3 className="font-semibold text-gray-500 uppercase tracking-wider text-xs mb-2">Detalles del Evento</h3>
          <p className="font-bold text-gray-900">{quote.tipoEvento}</p>
          {quote.fechaEvento && (
            <p className="text-gray-600">{format(new Date(quote.fechaEvento.replace(/-/g, '/')), 'PPP', { locale: es })}</p>
          )}
          <p className="text-gray-600">De {quote.horaInicio} a {quote.horaFin}</p>
          <p className="text-gray-600">{quote.personas} personas</p>
          {quote.direccionSalon && (
            <p className="text-gray-600 mt-2"><b>Lugar:</b> {quote.direccionSalon}</p>
          )}
        </div>
      </section>

      <section className="mt-10">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="font-semibold text-gray-600 uppercase p-3 w-1/2">Servicio</th>
              <th className="text-center font-semibold text-gray-600 uppercase p-3">Cantidad</th>
              <th className="text-right font-semibold text-gray-600 uppercase p-3">Vlr. Unitario</th>
              <th className="text-right font-semibold text-gray-600 uppercase p-3">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="p-3 align-top">
                  <p className="font-medium text-gray-800">{item.nombre}</p>
                  <p className="text-xs text-gray-500">{item.categoria}</p>
                </td>
                <td className="text-center p-3">{item.cantidad}</td>
                <td className="text-right p-3">{formatCurrency(item.precioUnitario)}</td>
                <td className="text-right p-3 font-medium">{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-8 flex justify-end">
        <div className="w-full max-w-sm">
          <div className="flex justify-between py-4 text-xl border-t-2 border-gray-200">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-gray-900">{formatCurrency(quote.total)}</span>
          </div>
        </div>
      </section>

      <footer className="absolute bottom-10 left-12 right-12 mt-16 pt-6 border-t-2 border-gray-200 text-center text-xs text-gray-500">
        <div className="mb-4">
          <p className="font-bold">Hernan Ramirez Sanchez - Gerente General</p>
          <p>3045295251 | Calle 18 # 5-17, Soacha, Cundinamarca</p>
        </div>
        <p>Temática Eventos &copy; {new Date().getFullYear()}. Todos los derechos reservados.</p>
        <p className="mt-1">Esta es una cotización y no una confirmación de reserva. Precios válidos por 15 días.</p>
      </footer>
    </div>
  );
};

export default QuotePDFDocument;
