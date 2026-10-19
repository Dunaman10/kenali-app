import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

async function TodosList() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from("todos").select();

  return (
    <>
      {error && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 text-sm">
          Catatan: Tabel &apos;todos&apos; belum ada di database atau belum diisi. (Error: {error.message})
        </div>
      )}
      <ul className="list-disc pl-5 space-y-1">
        {todos && todos.length > 0 ? (
          todos.map((todo: { id: string | number; name?: string; title?: string }) => (
            <li key={todo.id}>{todo.name || todo.title || JSON.stringify(todo)}</li>
          ))
        ) : (
          <li className="text-slate-500 italic">Belum ada data todos.</li>
        )}
      </ul>
    </>
  );
}

export default function TodosDemoPage() {
  return (
    <div className="max-w-xl mx-auto p-8 space-y-4 font-sans">
      <h1 className="text-2xl font-bold font-display text-teal-800">
        Supabase Connection Demo
      </h1>
      <Suspense fallback={<p className="text-slate-400 italic">Memuat data todos...</p>}>
        <TodosList />
      </Suspense>
    </div>
  );
}
