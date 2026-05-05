import { Component, computed, inject, Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { ScriptData, ScriptDataService } from '../services/script-data';

@Component({
  selector: 'app-output',
  imports: [],
  templateUrl: './output.html',
  styleUrl: './output.scss',
})



export class Output {
 
  private scriptDataService = inject(ScriptDataService);
  
  scriptData = computed<ScriptData[]>(() => this.scriptDataService.jsonData() ?? []);

  meta = computed(() => this.scriptData().find((item) => item.id === '_meta') ?? null);

  visibleRoles = computed(() =>
    this.scriptData().filter(
      (item) => item.id !== '_meta' && !item.hide
    )
  );

  hiddenRoles = computed(() =>
    this.scriptData().filter(
      (item) => item.id !== '_meta' && !!item.hide
    )
  );

  onDragStart(event: DragEvent, roleId: string) {
    if (!event.dataTransfer) return;
    event.dataTransfer.setData('text/plain', roleId);
    event.dataTransfer.effectAllowed = 'move';
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDropToHidden(event: DragEvent) {
    event.preventDefault();
    const roleId = event.dataTransfer?.getData('text/plain');
    if (!roleId) return;
    this.scriptDataService.setHidden(roleId, true);
  }

  onDropToVisible(event: DragEvent) {
    event.preventDefault();
    const roleId = event.dataTransfer?.getData('text/plain');
    if (!roleId) return;
    this.scriptDataService.setHidden(roleId, false);
  }


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
    roles: this.visibleRoles()
      .filter((item): item is ScriptData & { team: TeamKey } =>
        item.id !== '_meta' &&
        !!item.team &&
        item.team in this.teamMeta
      )
      .filter((item) => item.team === key)
      .sort((a, b) => a.name.localeCompare(b.name, 'de')),
  })),
);

logoUrl = computed(() =>this.scriptData().filter((item) => item.id === '_meta')[0].logo);





}

type TeamKey = 'townsfolk' | 'outsider' | 'minion' | 'demon';


