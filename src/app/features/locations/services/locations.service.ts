import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  EMPTY,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { ToastService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_SEARCH,
  LIMITS,
  TrgLocation,
  TrgLocationResponse,
  TrgLocationSort,
} from '../models/location.model';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  limits = LIMITS;

  private searchBS = new BehaviorSubject<string>(DEFAULT_SEARCH);
  private limitBS = new BehaviorSubject<number>(DEFAULT_LIMIT);
  private pageBS = new BehaviorSubject<number>(DEFAULT_PAGE);
  private sortBS = new BehaviorSubject<TrgLocationSort>({
    _sort: 'name',
    _order: 'asc',
  });
  private loadingBS = new BehaviorSubject<boolean>(false);

  search$ = this.searchBS.asObservable();
  limit$ = this.limitBS.asObservable();
  sort$ = this.sortBS.asObservable();
  loading$ = this.loadingBS.asObservable();
  page$ = this.pageBS.asObservable();

  private params$ = combineLatest([
    this.searchBS.pipe(debounceTime(500)),
    this.limitBS,
    this.sortBS,
    this.pageBS.pipe(debounceTime(500)),
  ]).pipe(
    map(([searchTerm, limit, sort, page]) => {
      const { _sort, _order } = sort;
      let url = `${environment.baseUrl}?_page=${page}&_limit=${limit}&_sort=${_sort}&_order=${_order}`;
      if (!!searchTerm) {
        url = `${url}&name=${searchTerm}`;
      }

      return url;
    })
  );

  private locationsResponse$ = this.params$.pipe(
    debounceTime(100),
    tap(() => this.loadingBS.next(true)),
    switchMap((url) =>
      this.http.get(url, {
        observe: 'response',
      })
    ),
    tap(() => this.loadingBS.next(false)),
    shareReplay(1)
  );

  totalResults$ = this.locationsResponse$.pipe(
    map((res: any) => res.headers.get('x-total-count'))
  );

  locations$: Observable<TrgLocation[]> = this.locationsResponse$.pipe(
    map((res: any) => {
      return res.body.map((item: TrgLocationResponse) => {
        const [latitude, longitude] = item.coordinates;
        return {
          id: item.id,
          latitude,
          longitude,
          name: item.name,
        };
      });
    })
  );

  totalPages$ = combineLatest([this.totalResults$, this.limitBS]).pipe(
    map(([totalResults, limit]) => Math.ceil(totalResults / limit))
  );

  constructor(private http: HttpClient, private toastService: ToastService) {}

  getAllLocations() {
    return this.http.get(`${environment.baseUrl}`).pipe(
      map((res: any) => {
        return res.map((item: TrgLocationResponse) => {
          const [latitude, longitude] = item.coordinates;
          return {
            id: item.id,
            latitude,
            longitude,
            name: item.name,
          };
        });
      })
    );
  }

  create(location: TrgLocationResponse) {
    return this.http.post(`${environment.baseUrl}`, location).pipe(
      map((response) => {
        this.toastService.showSuccess('Location successfully created!');
      }),
      catchError((error) => {
        console.log('Error on creating location: ', error);
        this.toastService.showError('There is a problem.Try again later!');
        return of();
      })
    );
  }

  update(location: TrgLocationResponse) {
    return this.http
      .put(`${environment.baseUrl}/${location.id}`, location)
      .pipe(
        map((response) => {
          this.toastService.showSuccess('Location successfully updated!');
        }),
        catchError((error) => {
          console.log('Error on updating location: ', error);
          this.toastService.showError('There is a problem.Try again later!');
          return of();
        })
      );
  }

  onSearch(term: string) {
    this.searchBS.next(term);
    this.pageBS.next(DEFAULT_PAGE);
  }

  setPage(page: number) {
    this.pageBS.next(page);
  }

  setLimit(limit: number) {
    this.limitBS.next(limit);
  }

  setSort(locationSort: TrgLocationSort) {
    this.sortBS.next(locationSort);
  }

  setSearchTerm(searchTerm: string) {
    this.searchBS.next(searchTerm);
  }

  getCurrentPageLimit() {
    return this.limitBS.getValue();
  }

  getCurrentSort() {
    return this.sortBS.getValue();
  }

  getCurrentPage() {
    return this.pageBS.getValue();
  }

  toTrgLocationResponse(location: TrgLocation): TrgLocationResponse {
    return {
      id: location.id || undefined,
      coordinates: [+location.latitude, +location.longitude],
      name: location.name,
    };
  }

  toTrgLocation(location: {
    lat: number;
    lng: number;
    name?: string;
    id?: number;
  }): TrgLocation {
    return {
      id: location.id || undefined,
      latitude: location.lat,
      longitude: location.lng,
      name: location.name || '',
    };
  }
}
