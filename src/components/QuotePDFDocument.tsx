import { Sparkles } from 'lucide-react';
import type { SelectedService, UserProfile } from '@/lib/types';

type QuotePDFDocumentProps = {
  quoteId: string;
  quote: { items: SelectedService[], total: number };
  user: UserProfile;
};

const QuotePDFDocument: React.FC<QuotePDFDocumentProps> = ({ quoteId, quote, user }) => {

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
    <div className="bg-white text-gray-800 p-10 font-sans text-sm">
      <header className="flex justify-between items-start pb-6 border-b-2 border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles className="h-10 w-10 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Cormorant Garamond, serif'}}>Temática Eventos</h1>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-semibold text-gray-700">Cotización</h2>
          <p className="text-gray-500 mt-1">{quoteId}</p>
          <p className="text-gray-500">{currentDate}</p>
        </div>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-gray-600 uppercase tracking-wider mb-2">Cliente</h3>
          <p className="font-bold text-gray-900">{user.nombre}</p>
          <p className="text-gray-600">{user.correo}</p>
          <p className="text-gray-600">{user.telefono}</p>
        </div>
        <div className="text-right">
            <h3 className="font-semibold text-gray-600 uppercase tracking-wider mb-2">Total</h3>
            <p className="text-4xl font-bold text-gray-900">{formatCurrency(quote.total)}</p>
        </div>
      </section>

      <section className="mt-10">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left font-semibold text-gray-600 uppercase p-3">Servicio</th>
              <th className="text-center font-semibold text-gray-600 uppercase p-3">Cantidad</th>
              <th className="text-right font-semibold text-gray-600 uppercase p-3">Precio Unitario</th>
              <th className="text-right font-semibold text-gray-600 uppercase p-3">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="p-3">
                    <p className='font-medium text-gray-800'>{item.name}</p>
                    <p className='text-xs text-gray-500'>{item.description}</p>
                </td>
                <td className="text-center p-3">{item.quantity} {item.unit}</td>
                <td className="text-right p-3">{formatCurrency(item.price)}</td>
                <td className="text-right p-3 font-medium">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-8 flex justify-end">
        <div className='w-full max-w-xs'>
            <div className="flex justify-between py-2">
                <span className="font-semibold text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-800">{formatCurrency(quote.total)}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-gray-200">
                <span className="font-bold text-xl text-gray-900">Total</span>
                <span className="font-bold text-xl text-gray-900">{formatCurrency(quote.total)}</span>
            </div>
        </div>
      </section>

       <footer className="mt-16 pt-6 border-t-2 border-gray-200 text-center text-xs text-gray-500">
            <p>Temática Eventos &copy; {new Date().getFullYear()}. Todos los derechos reservados.</p>
            <p className='mt-2'>Esta es una cotización y no una confirmación de reserva. Precios válidos por 15 días.</p>
        </footer>
    </div>
  );
};

export default QuotePDFDocument;
