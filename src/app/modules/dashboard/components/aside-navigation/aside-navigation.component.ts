import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-aside-navigation',
  templateUrl: './aside-navigation.component.html',
  styleUrls: ['./aside-navigation.component.scss']
})
export class AsideNavigationComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document

  ) { }

  ngOnInit(): void {
  }

  public toggleMenu(event: Event): void {
    event.preventDefault();
    this.document.body.classList.toggle('isMenuMinimize');
  }

}
