// src/app/device-list/device-list.page.ts
import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../services/device.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.page.html',
  styleUrls: ['./device-list.page.scss'],
})
export class DeviceListPage implements OnInit {
  devices = [];

  constructor(private deviceService: DeviceService, private router: Router) { }

  ngOnInit() {
    this.deviceService.getDevices().subscribe((devices: any) => {
      this.devices = devices;
    });
  }

  navigateToDevice(device: any) {
    this.router.navigate(['/map', { deviceId: device.id }]);
  }
}
