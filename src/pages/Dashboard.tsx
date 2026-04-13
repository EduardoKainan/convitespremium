import { useState } from 'react';
import { Link } from 'react-router-dom';
import { templates } from '../data/templates';
import { Sparkles, Filter, Search } from 'lucide-react';

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Todos', 'Casamento', '15 Anos', 'Infantil', 'Aniversário', 'Chá de Bebê'];

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = activeCategory === 'Todos' || t.category === activeCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 font-sans">
      {/* Premium Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-600" />
            <span className="text-xl font-serif font-medium tracking-tight">Lumière Invites</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="text-gray-900">Catálogo</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Meus Convites</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Preços</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900">Entrar</button>
            <button className="text-sm font-medium bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors">
              Criar Conta
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-gray-900 mb-6 leading-tight">
            Convites digitais com <br/> <span className="italic text-amber-700">elegância atemporal</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10">
            Crie experiências inesquecíveis para seus convidados com nossos modelos premium, ornamentos 3D exclusivos e design sofisticado.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:ring-amber-500 focus:border-amber-500 sm:text-sm shadow-sm bg-white"
              placeholder="Buscar por estilo, ocasião ou cor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-full border border-gray-200">
            <Filter className="w-4 h-4" />
            Mais Filtros
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="group relative flex flex-col">
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                <img
                  src={template.coverImage}
                  alt={template.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <Link
                    to={`/editor/${template.id}`}
                    className="w-full flex items-center justify-center px-4 py-3 rounded-full text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 transition-colors shadow-lg"
                  >
                    Personalizar
                  </Link>
                </div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-900 shadow-sm">
                    {template.category}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-serif font-medium text-gray-900">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Design Premium</p>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTemplates.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Nenhum modelo encontrado para sua busca.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveCategory('Todos');}}
              className="mt-4 text-amber-600 font-medium hover:text-amber-700"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
