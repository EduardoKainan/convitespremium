import { Link } from 'react-router-dom';
import { templates } from '../data/templates';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Convites Digitais
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Escolha um modelo e personalize para o seu evento.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
          {templates.map((template) => (
            <div key={template.id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
              <div className="aspect-w-4 aspect-h-3 bg-gray-200 group-hover:opacity-75 transition-opacity h-64">
                <img
                  src={template.coverImage}
                  alt={template.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {template.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {template.name}
                </h3>
                <Link
                  to={`/editor/${template.id}`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Personalizar Convite
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
