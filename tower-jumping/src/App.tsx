import { useEffect, useLayoutEffect, useRef } from 'react';
import Tower from './game';
import AssetsLoader, { IAssets } from './game/AssetsLoader';

function App() {
  const ref = useRef<HTMLDivElement>(null);

  // useLayoutEffect(() => {
  //   if (ref.current !== null) {
  //     const loader = new AssetsLoader({ background: '', player: '' });
  //     let assets: IAssets;
  //     loader.loadAssets().then((data) => {
  //       assets = data;

  //     });
  //     const tower = new Tower(ref.current, assets);
  //     tower.load().then(() => {
  //       tower.setBackground();
  //       tower.run();
  //     });
  //     return () => tower.clear();
  //   }
  // }, []);

  useLayoutEffect(() => {
    if (ref.current !== null) {
      const loader = new AssetsLoader({
        background: '/2.png',
        player: '/player.png',
      });
      const tower = new Tower(ref.current);
      loader.loadAssets().then((data) => {
        tower.assetsAssign(data);
        tower.run();
      });

      return () => tower.clear();
    }
  }, []);

  return <div ref={ref} />;
}

export default App;
