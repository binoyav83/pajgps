import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceService } from '../services/device.service';
import * as maplibregl from 'maplibre-gl';
import { Device } from '../interfaces/device.interface';
import { Point } from '../interfaces/point.interface';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements AfterViewInit {
  map!: maplibregl.Map;
  devices: any = [];

  constructor(private deviceService: DeviceService, private route: ActivatedRoute, private menuService: MenuService) { }

  ngAfterViewInit() {
    this.initializeMap();

    // Loop through all devices  
    this.deviceService.getDevices().subscribe((response: any) => {
      if (response.success && Array.isArray(response.success)) {
        this.makeMenu(response.success);

        this.addMarkers(response.success).then(() => {
          const deviceId = Number(this.route.snapshot.paramMap.get('deviceId'));
          if (deviceId) {
            this.flyToDevice(deviceId);
            this.showTrackingData(deviceId);
          }
        });

      } else {
        console.error('Devices not found in the response:', response);
      }
    });
  }

  makeMenu(devices: any) {

    devices.forEach((device: { name: any; id: any; }) => {
      this.menuService.addMenuItem({ title: device.name, url: `/map/${device.id}`, icon: 'car' });
    });

  }

  initializeMap() {
    this.map = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 0],
      zoom: 2,
    });
  }

  addMarkers(devices: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.deviceService.getLastPositions(devices).subscribe((response: any) => {
        if (response.success) {
          this.devices = response.success;
          let i = 0;
          Object.keys(response.success).forEach(deviceId => {
            const locations = response.success[deviceId];
            i = 0; // Limiting records. @todo remove this condition in live.
            locations.forEach((location: { lat: any; lng: any; }) => {
              // @todo remove i < 10  condition in live.
              if ((location.lat < 90 && location.lat > -90) && (location.lng < 90 && location.lng > -90) && i < 10) {
                new maplibregl.Marker()
                  .setLngLat([location.lat, location.lng])
                  .addTo(this.map);
                i++;
              }
            });
          });
          resolve(); // Resolve after markers are added
        } else {
          console.error('Devices not found in the response:', response);
          reject(); // Reject if there's an error
        }
      });
    });
  }


  flyToDevice(deviceId: number) {
    //  const device = this.devices.find((d: { id: number; }) => d.id == deviceId);
    const device = this.devices[deviceId];
    //console.log(device);
    // Move to first 
    if (device) {
      this.map.flyTo({
        center: [device[0].lat, device[0].lng],
        zoom: 14,
      });
    }
  }

  showTrackingData(deviceId: number) {
    this.deviceService.getTrackingData(deviceId).subscribe((trackData: any) => {
      // console.log(trackData.success);
      const coordinates: [number, number][] = trackData.success.map((point: any) => [point.lng, point.lat]);

      const geojsonFeature: GeoJSON.Feature<GeoJSON.LineString> = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
        properties: {},
      };

      this.map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [geojsonFeature],
        },
      });

      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#FF0000',
          'line-width': 4,
        },
      });
    });
  }
}
