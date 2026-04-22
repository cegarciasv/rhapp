'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, ShieldCheck, Users, Activity, ArrowRight, UserPlus } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', position: '', age: '', education: '' });

  const tests = [
    { id: 'integra', name: 'INTEGRA', desc: 'Evaluación de Integridad y Ética Laboral', icon: ShieldCheck, color: 'bg-blue-500' },
    { id: 'moss', name: 'MOSS', desc: 'Adaptabilidad Social y Liderazgo', icon: Users, color: 'bg-emerald-500' },
    { id: 'cleaver', name: 'CLEAVER', desc: 'Comportamiento y Perfil de Puesto (DISC)', icon: Activity, color: 'bg-orange-500' },
    { id: '16pf', name: '16PF', desc: 'Cuestionario de Factores de Personalidad', icon: Brain, color: 'bg-purple-500' },
  ];

  const handleTestSelect = (testId: string) => {
    window.location.assign(`/tests/${testId}.html`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Suite<span className="text-blue-600">Psicométrica</span></h1>
        </div>
        <button onClick={() => router.push('/admin')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
          Panel de Administrador
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Evaluaciones de Talento</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Selecciona la prueba psicométrica a aplicar. Los resultados se guardarán automáticamente en la base de datos centralizada.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map(test => (
            <div key={test.id} onClick={() => handleTestSelect(test.id)} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex items-start gap-5">
              <div className={`${test.color} text-white p-4 rounded-xl shadow-inner group-hover:scale-105 transition-transform`}>
                <test.icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{test.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{test.desc}</p>
                <div className="flex items-center text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  Aplicar prueba <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
