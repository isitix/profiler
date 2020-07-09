import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import * as proto from 'org_xprof/frontend/app/common/interfaces/hlo.proto';
import {NavigationEvent} from 'org_xprof/frontend/app/common/interfaces/navigation_event';
import {DataService} from 'org_xprof/frontend/app/services/data_service/data_service';
import {setLoadingStateAction} from 'org_xprof/frontend/app/store/actions';

/** A memory viewer component. */
@Component({
  selector: 'memory-viewer',
  templateUrl: './memory_viewer.ng.html',
  styleUrls: ['./memory_viewer.scss']
})
export class MemoryViewer {
  hloProto?: proto.HloProto;

  constructor(
      route: ActivatedRoute,
      private readonly dataService: DataService,
      private readonly store: Store<{}>) {
    route.params.subscribe(params => {
      this.update(params as NavigationEvent);
    });
  }

  update(event: NavigationEvent) {
    this.store.dispatch(setLoadingStateAction({
      loadingState: {
        loading: true,
        message: 'Loading data',
      }
    }));

    this.dataService.getData(event.run || '', 'memory_viewer', event.host || '')
        .subscribe(data => {
          this.store.dispatch(setLoadingStateAction({
            loadingState: {
              loading: false,
              message: '',
            }
          }));

          if (data) {
            this.hloProto = data as proto.HloProto;
          }

        });
  }
}
