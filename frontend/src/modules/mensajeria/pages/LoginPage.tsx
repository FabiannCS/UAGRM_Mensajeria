import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Send } from 'lucide-react';
import axios from 'axios';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: formData.username,
        password: formData.password
      });
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/dashboard'); 

    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      
      {/* --- FONDO DINÁMICO (Blobs animados detrás de la tarjeta) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- TARJETA PRINCIPAL (Split Screen Compacto) --- */}
      <div className="relative z-10 w-full max-w-4xl h-130 bg-white rounded-2xl shadow-2xl overflow-hidden flex animate-fadeIn border border-slate-100">
        
        {/* IZQUIERDA: BRANDING UAGRM (Azul Institucional con degradado) */}
        <div className="hidden md:flex w-1/2 bg-[#003366] relative flex-col items-center justify-center text-white p-8 overflow-hidden">
            
            {/* Efectos de fondo sutiles */}
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-[#003366] to-[#002244] z-10"></div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-red-700 rounded-full blur-3xl opacity-40 z-10"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-yellow-500 rounded-full blur-3xl opacity-20 z-10"></div>

            {/* Contenido */}
            <div className="relative z-20 flex flex-col items-center text-center space-y-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                <Send className="w-12 h-12 text-white" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tight">U.A.G.R.M.</h2>
                <div className="h-1 w-20 bg-red-600 mx-auto rounded-full"></div>
                <p className="text-blue-100 text-sm font-light px-4">
                  Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones
                </p>
              </div>
            </div>

            {/* Footer decorativo izquierda */}
            <div className="absolute bottom-6 text-[15px] text-blue-300/60 z-20">
              Sistema de Mensajería.
            </div>
        </div>

        {/* DERECHA: FORMULARIO */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white relative">
          
          <div className="max-w-xs mx-auto w-full space-y-6">
            
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-800">Bienvenido</h1>
              <p className="text-sl text-slate-500">Ingresa a tu cuenta institucional.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-2.5 rounded-lg text-xs flex items-center animate-fadeIn border border-red-100">
                <AlertCircle className="w-3.5 h-3.5 mr-2 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* USUARIO */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-600 ml-1">Registro / Usuario</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-[#003366] transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] focus:bg-white transition-all shadow-sm"
                    placeholder="Ej: 219000000"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>

              {/* CONTRASEÑA */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-600 ml-1">Contraseña</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-[#003366] transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] focus:bg-white transition-all shadow-sm"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <a href="#" className="text-xs font-medium text-[#CC0000] hover:text-red-700 hover:underline transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* BOTÓN CON COLOR INSTITUCIONAL */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-[#003366] hover:bg-[#002244] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366] transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Validando...
                  </>
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Footer General */}
      <div className="absolute bottom-4 text-xs text-slate-400 z-10">
        © 2026 Universidad Autónoma Gabriel René Moreno
      </div>

    </div>
  );
};