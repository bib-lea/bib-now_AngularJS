import {Component, EventEmitter, OnInit} from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {

  search = new EventEmitter<string>();
  activeMediaQuery = '';
  isMobile: boolean;

  constructor(
    private mediaObserver: MediaObserver
  ) {
    this.mediaObserver.asObservable().subscribe((changes: MediaChange[]) => {
      const change = changes[0];
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      this.isMobile = change.mqAlias === 'xs';
    })
  }

  ngOnInit(): void {
  }

  onSearch(event): void {
    this.search.emit(event);
  }
}
