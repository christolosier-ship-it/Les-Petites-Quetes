export type AgeBand = '3-5' | '6-8' | '9-10';
export type AssetType = 'icon' | 'illustration' | 'mascot' | 'reward' | 'sound';

export interface AssetDefinition {
  readonly id: string;
  readonly type: AssetType;
  readonly path: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly maxBytes: number;
  readonly ageBands: readonly AgeBand[];
  readonly states: readonly string[];
}
