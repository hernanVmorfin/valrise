export interface SpeakingPanel {
  hidden: boolean;
}

export interface SpeakingField {
  disabled: boolean;
  required: boolean;
}

export function setSpeakingFieldsState(
  panel: SpeakingPanel,
  fields: SpeakingField[],
  active: boolean,
): void {
  panel.hidden = !active;
  fields.forEach((field) => {
    field.disabled = !active;
    field.required = active;
  });
}
