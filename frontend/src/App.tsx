import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
// Actually, looking at the previous file content, it was `import Layout from "./components/Layout";`
// I should stick to the existing import if possible, but the previous `view_file` showed `components/Layout`
// Let's verify the file structure.
// Wait, I saw `components` dir has `layout` subdir in previous `list_dir`.
// Let's assume standard structure or stick to what was there if it works.
// The previous file content had `import Layout from "./components/Layout";`
// But I saw `components/layout/Layout` in my previous `replace_file` attempt which might have been a guess.
// Let's use the file content I just read: `import Layout from "./components/Layout";`
// wait, `list_dir` of `src/components` showed `layout` folder?
// Let's check `src/components` again to be safe?
// No, I'll trust the `view_file` of `App.tsx` I just did.
// `import Layout from "./components/Layout";`

import Dashboard from "./pages/Dashboard";
import Kanban from "./pages/Kanban";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/kanban" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/kanban" element={<Kanban />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
