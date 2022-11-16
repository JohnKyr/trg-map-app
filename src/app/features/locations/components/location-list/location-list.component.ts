import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { TrgLocation, TrgLocationSort } from '../../models/location.model';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
})
export class LocationListComponent implements OnInit {
  @Input() dataSource!: TrgLocation[];
  @Input() totalResults!: number;
  @Input() totalPages!: number;
  @Input() locationsSort!: TrgLocationSort;
  @Output() changeSort = new EventEmitter<Sort>();
  @Output() action = new EventEmitter<{
    action: string;
    location: TrgLocation;
  }>();

  displayedColumns: string[] = [
    'id',
    'latitude',
    'longitude',
    'name',
    'actions',
  ];

  constructor() {}

  ngOnInit(): void {}

  handleSortChange(sortState: Sort) {
    this.changeSort.emit(sortState);
  }

  handleAction(location: TrgLocation, action: string) {
    this.action.emit({ action, location });
  }
}
