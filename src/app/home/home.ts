import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScriptData, ScriptDataService } from '../services/script-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  scriptDataService = inject(ScriptDataService);
  router = inject(Router);

  private http = inject(HttpClient);

  jsonUrl = new FormControl(
    'https://www.bloodstar.xyz/p/nintendoluk/final_fantasy_script_german/script.json?1b4ccb84',
    Validators.required,
  );

  retrieveJson() {
    const url = this.jsonUrl.value;
    if (!url) return;

    this.scriptDataService.load(url);
    this.router.navigateByUrl('/output');

  }

  onJsonFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.scriptDataService.loading.set(true);
    this.scriptDataService.errorText.set(null);

    file
      .text()
      .then((text) => {
        const parsed = JSON.parse(text);

        if (!Array.isArray(parsed)) {
          throw new Error('Invalid script file. It should be an array.');
        }

        this.scriptDataService.setData(parsed as ScriptData[]);
        this.scriptDataService.loading.set(false);
        this.router.navigateByUrl('/output');
      })
      .catch((err) => {
        this.scriptDataService.loading.set(false);
        this.scriptDataService.errorText.set(
          err instanceof Error ? err.message : 'Invalid Script file',
        );
      });
  }
}
