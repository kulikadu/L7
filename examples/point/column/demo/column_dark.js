import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 40,
    style: 'dark',
    center: [ 104.288144, 31.239692 ],
    zoom: 4.4
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json')
    .then(res => res.json())
    .then(data => {
      const pointLayer = new PointLayer({})
        .source(data.list, {
          parser: {
            type: 'json',
            x: 'j',
            y: 'w'
          }
        })
        .shape('cylinder')
        .size('t', function(level) {
          return [ 2, 2, level * 2 + 20 ];
        })
        .animate(true)
        .active(true)
        .color('t', [
          '#094D4A',
          '#146968',
          '#1D7F7E',
          '#289899',
          '#34B6B7',
          '#4AC5AF',
          '#5FD3A6',
          '#7BE39E',
          '#A1EDB8',
          '#CEF8D6'
        ])
        .style({
          opacity: 1.0
        });
      scene.addLayer(pointLayer);
    });
});
