'use client';
import { useEffect, useState } from 'react';
import { ArrowLeft, Database, Search } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/candidates')
      .then(res => res.json())
      .then(data => {
        setCandidates(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" /> Base de Datos Central
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">Candidatos y Resultados</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Buscar candidato..." className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Candidato</th>
                  <th className="px-6 py-4">Puesto</th>
                  <th className="px-6 py-4">Fecha Registro</th>
                  <th className="px-6 py-4">Pruebas Completadas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Cargando datos...</td></tr>
                ) : candidates.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No hay candidatos registrados.</td></tr>
                ) : (
                  candidates.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{c.name}</div>
                            <div className="text-xs text-slate-500">{c.email || 'Sin correo'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{c.position}</td>
                      <td className="px-6 py-4 text-slate-600">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {c.results.length === 0 ? (
                            <span className="text-slate-400 text-xs">Ninguna</span>
                          ) : (
                            c.results.map((r: any) => {
                              let scoreSummary = 'Completada';
                              try {
                                const scores = typeof r.scores === 'string' ? JSON.parse(r.scores) : r.scores;
                                if (r.testName === 'INTEGRA') scoreSummary = `Score: ${scores.finalScore?.toFixed(0)}`;
                                else if (r.testName === 'MOSS') scoreSummary = `Total: ${scores.total}%`;
                              } catch (e) {
                                console.error("Error parsing scores", e);
                              }
                              return (
                                <span key={r.id} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium border border-green-200" title={scoreSummary}>
                                  {r.testName}
                                </span>
                              );
                            })
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
