import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/shared/interfaces/project';
import { PortfolioService } from 'src/app/shared/services/portfolio.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {
  aText: string[] = ["Hello World! :)", "I'm Junior Front-end Developer", 'Are you ready to work with me?'];
  iSpeed = 100; // time delay of print out
  iIndex = 0; // start printing array at this position
  iArrLength = this.aText[1].length; // the length of the text array
  iScrollAt = 20; // start scrolling up at this many lines
  iTextPos = 0; // initialise text position
  sContents = ''; // initialise contents variable
  iRow; // initialise current row
  projects: Project[];
  projectsSub: Subscription;

  constructor(
    private portfolioService: PortfolioService
  ) { }

  ngOnInit(): void {
    this.typewriter();
    this.getProjects();
  }

  ngOnDestroy(): void {
    if(this.projectsSub) {
      this.projectsSub.unsubscribe();
    }
  }
  
  typewriter() {
    this.sContents =  '<div class="console__prompt">';
    this.iRow = Math.max(0, this.iIndex-this.iScrollAt);
    const destination = document.getElementById("typedtext");
    if (destination) {
      
      while ( this.iRow < this.iIndex ) {
        this.sContents += this.aText[this.iRow++] + '</div><div class="console__prompt">';
      }

      destination.innerHTML = this.sContents + this.aText[this.iIndex].substring(0, this.iTextPos);
      if ( this.iTextPos++ == this.iArrLength ) {
        this.iTextPos = 0;
        this.iIndex++;
        if ( this.iIndex != this.aText.length ) {
          this.iArrLength = this.aText[this.iIndex].length;
          setTimeout(this.typewriter.bind(this), 100);
        }
      } else {
        setTimeout(this.typewriter.bind(this), this.iSpeed);
      }
    }
  }

  getProjects() {
    this.portfolioService.getProjects()
      .subscribe( (projects: Project[]) => {
        this.projects = projects.sort((a, b) => {
          return  Number(b['date']) - Number(a['date']);
        })
    })
  }

   filterListToggle($this) {
    $this.classList.toggle('select-list__toggle_active');
    $this.nextSibling.classList.toggle('select-list__menu_open');
  }

  sortByNew($this) {
    $this.parentElement.classList.remove('select-list__menu_open');
    $this.parentElement.previousSibling.classList.remove('select-list__toggle_active');
    $this.parentElement.previousSibling.textContent = $this.textContent;

    this.projects = this.projects.sort((projectOne, projectTwo) => {
      return   Number(projectTwo['date']) - Number(projectOne['date']);
    })
  }

  sortByOld($this) {
    $this.parentElement.classList.remove('select-list__menu_open');
    $this.parentElement.previousSibling.classList.remove('select-list__toggle_active');
    $this.parentElement.previousSibling.textContent = $this.textContent;

    this.projects = this.projects.sort((projectOne, projectTwo) => {
      return  Number(projectOne['date']) - Number(projectTwo['date']);
    })
  } 
}
