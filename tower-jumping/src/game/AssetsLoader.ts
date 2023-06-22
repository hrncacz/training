interface IAssetLoaderProps {
  [key: string]: string;
}

export interface IAssets {
  [key: string]: HTMLImageElement;
}

class AssetsLoader {
  assets: IAssets;
  paths: IAssetLoaderProps;
  constructor(paths: IAssetLoaderProps) {
    this.assets = {};
    this.paths = paths;
  }

  loadAssets() {
    return new Promise<IAssets>((resolve) => {
      const toLoad: { [key: string]: boolean } = {};
      for (const asset in this.paths) {
        toLoad[asset] = true;
        const img = new Image();
        img.onload = () => {
          this.assets[asset] = img;
          delete toLoad[asset];
          if (Object.values(toLoad).length === 0) {
            resolve(this.assets);
          }
        };
        img.src = this.paths[asset];
      }
    });
  }
}

// export default AssetsLoader;
export default AssetsLoader;
