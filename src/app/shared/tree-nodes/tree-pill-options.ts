export class TreePillOptions {
  width = 205;
  height = 45;
  siblingSeparation = 20;

  levelSeparationFactor = 1.5;
  siblingSeparationFactor = 1;
  cousinSeparationFactor = 1.5;

  xShift: number;

  constructor(viewBoxWidth: number) {
    this.xShift = viewBoxWidth / 2;
  }

  getLevelSeparation(): number {
    return this.height * this.levelSeparationFactor;
  }

  getNodeSize(): [number, number] {
    const nodeSizeWidth = this.width + this.siblingSeparation;
    const nodeSizeHeight = this.height + (this.height * this.levelSeparationFactor);
    return [nodeSizeWidth, nodeSizeHeight];
  }
}
