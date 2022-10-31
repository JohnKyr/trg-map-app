import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  map,
  Observable,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  TrgLocationResponse,
  TrgLocation,
  LIMITS,
  DEFAULT_SEARCH,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
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

  locations$: Observable<Location[]> = this.locationsResponse$.pipe(
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

  constructor(private http: HttpClient) {}

  create(location: TrgLocationResponse) {
    return this.http.post(`${environment.baseUrl}`, location);
  }

  update(location: TrgLocationResponse) {
    return this.http.put(`${environment.baseUrl}/${location.id}`, location);
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
}
