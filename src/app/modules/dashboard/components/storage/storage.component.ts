import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {

  tabs = [
    {
      title:  'Загрузка файлов',
      active: true
    },
    {
      title:  'Библиотека файлов',
      active: false
    }
  ]

  constructor() { }

  ngOnInit(): void {
    
  }

  changeTab(index: number) {
    this.tabs = this.tabs.map((tab, i) => i === index ? { ...tab, active: true } : { ...tab, active: false });
  }

}
