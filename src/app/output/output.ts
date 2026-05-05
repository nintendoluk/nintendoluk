import { Component, computed, inject, Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { ScriptData, ScriptDataService, HeaderDisplayMode } from '../services/script-data';

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

private readonly teamConfig: Record<TeamKey, { defaultLabel: string; className: string }> = {
  townsfolk: { defaultLabel: 'Townsfolk', className: 'team-heroes' },
  outsider: { defaultLabel: 'Outsider', className: 'team-esper' },
  minion: { defaultLabel: 'Minion', className: 'team-monsters' },
  demon: { defaultLabel: 'Demon', className: 'team-villains' },
};

teamLabels = computed<Record<TeamKey, string>>(() => ({
  townsfolk: this.meta()?.teamLabels?.townsfolk ?? this.teamConfig.townsfolk.defaultLabel,
  outsider: this.meta()?.teamLabels?.outsider ?? this.teamConfig.outsider.defaultLabel,
  minion: this.meta()?.teamLabels?.minion ?? this.teamConfig.minion.defaultLabel,
  demon: this.meta()?.teamLabels?.demon ?? this.teamConfig.demon.defaultLabel,
}));


readonly teamOrder: TeamKey[] = ['townsfolk', 'outsider', 'minion', 'demon'];

groupedRoles = computed(() =>
  this.teamOrder.map((key) => ({
    key,
    label: this.teamLabels()[key],
    className: this.teamConfig[key].className,
    roles: this.visibleRoles()
      .filter((item): item is ScriptData & { team: TeamKey } =>
        item.id !== '_meta' &&
        !!item.team &&
        item.team in this.teamConfig
      )
      .filter((item) => item.team === key)
      .sort((a, b) => a.name.localeCompare(b.name, 'de')),
  })),
);

logoUrl = computed(() =>this.scriptData().filter((item) => item.id === '_meta')[0].logo);


onTeamLabelInput(key: TeamKey, value: string) {
  this.scriptDataService.updateTeamLabel(key, value);
}

downloadJson() {
  const data = this.scriptData();
  if (!data.length) return;

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${this.meta()?.name ?? 'script-data'}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

headerDisplayMode = computed<HeaderDisplayMode>(
  () => this.meta()?.headerDisplayMode ?? 'logo'
);

showLogo = computed(() => {
  const mode = this.headerDisplayMode();
  return mode === 'logo' || mode === 'both';
});

showName = computed(() => {
  const mode = this.headerDisplayMode();
  return mode === 'name' || mode === 'both';
});

onHeaderDisplayModeChange(value: string) {
  if (value !== 'logo' && value !== 'name' && value !== 'both') return;
  this.scriptDataService.updateHeaderDisplayMode(value);
}


}

type TeamKey = 'townsfolk' | 'outsider' | 'minion' | 'demon';


