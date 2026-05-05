import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type ScriptData = {
  id: string
  name: string
  author?: string
  logo?: string
  almanac?: string
  image?: string
  firstNightReminder?: string
  reminders?: string[]
  team?: string
  ability?: string
  firstNight?: number
  otherNightReminder?: string
  otherNight?: number
  setup?: boolean
  remindersGlobal?: string[]
  hide?: boolean
};

@Injectable({
  providedIn: 'root',
})
export class ScriptDataService {
  private http = inject(HttpClient);

  jsonData = signal<ScriptData[] | null>(null);
  loading = signal(false);
  errorText = signal<string | null>(null);

  load(url: string) {
    this.loading.set(true);
    this.errorText.set(null);

    this.http.get<ScriptData[]>(url).subscribe({
      next: (data) => {
        this.jsonData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.jsonData.set(null);
        this.loading.set(false);
        this.errorText.set(`HTTP ${err.status ?? ''} ${err.message ?? 'Unknown error'}`.trim());
      },
    });
  }

  clear() {
    this.jsonData.set(null);
    this.errorText.set(null);
  }

  setData(data: ScriptData[]) {
    this.jsonData.set(data);
    this.errorText.set(null);
  }

  setHidden(id: string, hidden: boolean) {
  this.jsonData.update((data) =>
    data?.map((item) =>
      item.id === id ? { ...item, hide: hidden } : item
    ) ?? null
  );
}
}