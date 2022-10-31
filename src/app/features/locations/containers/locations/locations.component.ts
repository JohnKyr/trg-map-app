import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {
  combineLatest,
  EMPTY,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { LocationsDialogFormComponent } from '../../components/locations-dialog-form/locations-dialog-form.component';

import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  LIMITS,
  TrgLocationResponse,
  TrgLocation,
  DEFAULT_SEARCH,
} from '../../models/location.model';
import { LocationsService } from '../../services/locations.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  limits = LIMITS;
  selectedLocation!: TrgLocation | null;
  selectedAction!: string;
  loading$: Observable<boolean>;
  locationView$ = combineLatest([
    this.locationService.locations$,
    this.locationService.page$,
    this.locationService.sort$,
    this.locationService.totalPages$,
    this.locationService.totalResults$,
    this.locationService.limit$,
    this.locationService.search$,
  ]).pipe(
    map(([locations, page, sort, totalPages, totalResults, limit, search]) => {
      return {
        locations,
        page,
        sort,
        totalPages,
        totalResults,
        limit,
        search,
      };
    })
  );

  constructor(
    private locationService: LocationsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loading$ = this.locationService.loading$;
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        const { _page, _limit, _sort, _order, name } = params;
        console.log('NAME => ', name);
        this.locationService.setPage(+_page || DEFAULT_PAGE);
        this.locationService.setLimit(+_limit || DEFAULT_LIMIT);
        this.locationService.setSort({ _sort, _order });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  openDialogForm() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      location: this.selectedLocation,
      action: this.selectedAction,
    };

    const dialogRef = this.dialog.open(
      LocationsDialogFormComponent,
      dialogConfig
    );

    dialogRef
      .afterClosed()
      .pipe(
        tap((data) => {
          console.log('FORM DATA => ', data);
        }),
        switchMap((data: TrgLocation) => {
          if (!data) {
            this.selectedLocation = null;
            this.selectedAction = '';
            return EMPTY;
          }

          return this.selectedAction === 'edit'
            ? this.updateLocation(data)
            : this.createLocation(data);
        })
      )
      .subscribe((response) => {
        console.log(response);
        this.locationService.setPage(1);
      });
  }

  handleChangePage(pageEvent: PageEvent) {
    const currentLimit = this.locationService.getCurrentPageLimit();
    const currentSort = this.locationService.getCurrentSort();
    const currentPage = this.locationService.getCurrentPage();
    let queryParams: Params = {};

    if (pageEvent.pageSize !== currentLimit) {
      queryParams['_page'] = 1;
      queryParams['_limit'] = pageEvent.pageSize;
    } else {
      queryParams['_page'] = pageEvent.pageIndex + 1;
      queryParams['_limit'] = currentLimit;
    }
    queryParams = { ...queryParams, ...currentSort };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  handleChangeSort(sortState: Sort) {
    const currentLimit = this.locationService.getCurrentPageLimit();
    const currentPage = this.locationService.getCurrentPage();
    const _sort = sortState.direction ? sortState.active : 'name';
    const _order = sortState.direction ? sortState.direction : 'asc';
    const queryParams: Params = {
      _page: currentPage,
      _limit: currentLimit,
      _sort,
      _order,
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  handleAction({
    location,
    action,
  }: {
    location: TrgLocation;
    action: string;
  }) {
    this.selectedLocation = location;
    this.selectedAction = action;
    this.openDialogForm();
  }

  private createLocation(data: TrgLocation) {
    const location: TrgLocationResponse = {
      coordinates: [+data.latitude, +data.longitude],
      name: data.name,
    };
    return this.locationService.create(location);
  }

  private updateLocation(data: TrgLocation) {
    const location: TrgLocationResponse = {
      id: data.id,
      coordinates: [+data.latitude, +data.longitude],
      name: data.name,
    };
    return this.locationService.update(location);
  }
}
