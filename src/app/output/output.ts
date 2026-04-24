import { Component, computed, inject, Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';

@Component({
  selector: 'app-output',
  imports: [],
  templateUrl: './output.html',
  styleUrl: './output.scss',
})



export class Output {
 
  
  jsonData = inject<Signal<string>>(ROUTER_OUTLET_DATA);
  scriptData = computed<ScriptData[]>(() => JSON.parse(this.jsonData()));







private readonly teamMeta: Record<TeamKey, { label: string; className: string }> = {
  townsfolk: { label: 'Helden', className: 'team-heroes' },
  outsider: { label: 'Esper', className: 'team-esper' },
  minion: { label: 'Monster', className: 'team-monsters' },
  demon: { label: 'Bösewichte', className: 'team-villains' },
};

private readonly teamOrder: TeamKey[] = ['townsfolk', 'outsider', 'minion', 'demon'];

groupedRoles = computed(() =>
  this.teamOrder.map((key) => ({
    key,
    label: this.teamMeta[key].label,
    className: this.teamMeta[key].className,
    roles: this.scriptData()
      .filter((item): item is ScriptData & { team: TeamKey } =>
        item.id !== '_meta' &&
        !!item.team &&
        item.team in this.teamMeta
      )
      .filter((item) => item.team === key)
      .sort((a, b) => a.name.localeCompare(b.name, 'de')),
  })),
);







}

type TeamKey = 'townsfolk' | 'outsider' | 'minion' | 'demon';

type ScriptData = {
  id :string;
  image :string;
  firstNightReminder :string;
  reminders :string[];
  name :string;
  team :string;
  ability :string;
  firstNight :number;
  hide : boolean;
}
