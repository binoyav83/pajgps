import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class MenuService {
    public appPages = [
        { title: 'Map', url: '/map', icon: 'world' },
    ];

    // Method to add a new item to the menu
    addMenuItem(menuItem: { title: string; url: string; icon: string }): void {
        const alreadyExists = this.appPages.some(page => page.url === menuItem.url);
        if (!alreadyExists) {
            this.appPages.push(menuItem);
        }
    }

    // Method to get the menu items
    getMenuItems() {
        return this.appPages;
    }
}
