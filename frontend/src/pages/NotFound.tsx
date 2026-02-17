import { Link } from "react-router-dom";
import { Button } from "@heroui/react";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-6 max-w-md w-full">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 animate-bounce">
          <AlertTriangle className="h-12 w-12 text-red-600" />
        </div>

        <h1 className="text-9xl font-extrabold text-gray-900 tracking-tight sm:text-9xl">
          404
        </h1>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Página no encontrada
          </h2>
          <p className="text-gray-500 text-lg">
            Lo sentimos, no pudimos encontrar la página que estás buscando. Es
            posible que haya sido movida o eliminada.
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <Link to="/">
            <Button
              size="lg"
              className="gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Home className="w-5 h-5" />
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-12 text-sm text-gray-400">
        TaskFusion &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
