export const productionFix = (window as any).productionFix as
  | {
      isFullyDisabled?: boolean;
      hookProjectData?(data: any): "blocked" | undefined;
    }
  | undefined;
