"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import BuildingChecklist from "./BuildingChecklist";
import type { Building } from "@/lib/buildings";

export default function BuildingPage() {
  const params = useParams<{ id: string }>();
  const [building, setBuilding] = useState<Building | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = params?.id;
    if (!id) {
      setIsLoading(false);
      return;
    }

    const stored = window.localStorage.getItem(`antville-building:${id}`);
    if (stored) {
      setBuilding(JSON.parse(stored) as Building);
    }
    setIsLoading(false);
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
        <div className="mx-auto max-w-4xl space-y-6">
          <Link href="/" className="text-sm text-emerald-300 hover:underline">
            ← Вернуться к форме
          </Link>
          <p className="text-slate-400">Загружаем данные постройки...</p>
        </div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
        <div className="mx-auto max-w-4xl space-y-6">
          <Link href="/" className="text-sm text-emerald-300 hover:underline">
            ← Вернуться к форме
          </Link>
          <h1 className="text-3xl font-semibold">Постройка не найдена</h1>
          <p className="text-slate-400">
            Данные хранятся локально в браузере. Откройте страницу после отправки формы
            на этом же устройстве.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
        <Link href="/" className="text-sm text-emerald-300 hover:underline">
          ← Вернуться к форме
        </Link>

        <header className="space-y-4">
          <h1 className="text-4xl font-semibold text-white">{building.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            <span>Координаты: {building.coordinates.x}</span>
            <span>{building.coordinates.y}</span>
            <span>{building.coordinates.z}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
            <span>Схема: {building.schematicFileName}</span>
            <span>Материалы: {building.materialsFileName}</span>
          </div>
        </header>

        {building.screenshotDataUrl ? (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold">Скриншот постройки</h2>
            <img
              src={building.screenshotDataUrl}
              alt={`Скриншот постройки ${building.name}`}
              className="mt-4 w-full rounded-2xl object-cover"
            />
          </section>
        ) : null}

        <BuildingChecklist materials={building.materials} />
      </main>
    </div>
  );
}
