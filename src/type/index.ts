export type rgb = "r" | "g" | "b" | null;

export type LineToFieldOptions = {
  color?: string;
  width?: number;
};

export interface LineToPointsProperties extends LineToFieldOptions {
  x: number;
  y: number;
  angle?: number;
}

export type LineDetailOptions = {
  showPoint?: boolean;
  showPointName?: boolean;
  showDistance?: boolean;
  showAngle?: boolean;
};
