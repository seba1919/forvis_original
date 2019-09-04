import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {AuthService} from './auth.service';


@Injectable()
export class FileService {

  url_sat_files = '/api/profile/files/sat/';
  url_sat_file = '/api/profile/file/sat/';
  url_maxsat_files = '/api/profile/files/maxsat/';
  url_maxsat_file = '/api/profile/file/maxsat/';
  url_clustered_file = '/api/profile/file/clustered/';

  constructor(
    private http: Http,
    private authService: AuthService
  ) {
  }

  getSatFilesList() {
    return this.http.get(this.url_sat_files, this.authService.authOptions())
      .map((res: Response) => res.json());
  }

  getSatFile(id: number, format: string, selectedVariables = []) {
    return this.http.get(this.url_sat_file + id + '/' + format + '/',
      this.authService.authOptions().merge({params: {selectedVariables: selectedVariables}}))
      .map((res: Response) => res.json());
  }

  deleteSatFile(id: number) {
    return this.http.delete(this.url_sat_file + id + '/del/', this.authService.authOptions());
  }

  getMaxSatFilesList() {
    return this.http.get(this.url_maxsat_files, this.authService.authOptions())
      .map((res: Response) => res.json());
  }

  getMaxSatFile(id: number, format: string, selectedVariables = []) {
    return this.http.get(this.url_maxsat_file + id + '/' + format + '/',
      this.authService.authOptions().merge({params: {selectedVariables: selectedVariables}}))
      .map((res: Response) => res.json());
  }

  deleteMaxSatFile(id: number) {
    return this.http.delete(this.url_maxsat_file + id + '/del/', this.authService.authOptions());
  }

  getClusteredFile(id: number) {
    return this.http.get(this.url_clustered_file + id + '/',
      this.authService.authOptions())
      .map((res: Response) => res.json());
  }
}
