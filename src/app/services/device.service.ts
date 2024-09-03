// src/app/services/device.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  constructor(private http: HttpClient, private authService: AuthService) { }

  getDevices() {
    const token = this.authService.getToken();
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get('https://connect.paj-gps.de/api/device', { headers });
  }

  getTrackingData(deviceId: number, lastPoints: number = 50) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `https://connect.paj-gps.de/api/v1/trackerdata/${deviceId}/last_points?lastPoints=${lastPoints}`;
    //https://connect.paj-gps.de/api/v1/trackerdata/1340656/last_points?lastPoints=50
    return this.http.get(url, { headers });
  }

  getLastPositions(devices: any) {
    const token = this.authService.getToken();
    const headers = {
      Authorization: `Bearer ${token}`
    };

    const transformedData = devices.map((device: { id: any; }) => ({
      deviceId: device.id,
      dateunix: null//Math.floor((Date.now() - (10 * 860000)) / 1000)
    }));

    const postData = {
      deviceIDs: transformedData,
      fromLastPoint: true
    };


    return this.http.post('https://connect.paj-gps.de/api/trackerdata/getalllastpositions', postData, { headers });
  }
}
