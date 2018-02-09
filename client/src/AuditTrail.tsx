
import * as React from 'react';
import {DetailsList,IColumn} from 'office-ui-fabric-react/lib/DetailsList';
import { SelectionMode } from 'office-ui-fabric-react/lib/utilities/selection';
import { AuditRecord, FishModel } from './FishModel';
import { Observable, Subscription } from 'rxjs';

interface AuditTrailState {
  items: AuditRecord[];
}

interface AuditTrailProps {
  model:FishModel;
}

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Time',
    fieldName: 'received',
    minWidth: 100,
    maxWidth: 200,
    isResizable: false,
    ariaLabel: 'Operations for name'
  },
  {
    key: 'column2',
    name: 'Sender',
    fieldName: 'source',
    minWidth: 100,
    maxWidth: 200,
    isResizable: false,
    ariaLabel: 'Operations for value'
  },
  {
    key: 'column2',
    name: 'Message',
    fieldName: 'text',
    minWidth: 100,
    isResizable: false,
    ariaLabel: 'Operations for value'
  },
];


export class AuditTrail extends React.Component<AuditTrailProps, AuditTrailState> {
  
    dataSub:Subscription;
    refreshSub:Subscription;

    constructor(props: AuditTrailProps) {
      super(props);
    }

    componentWillMount() {
      this.dataSub = this.props.model.auditRecord$.subscribe(v => {
        this.setState({items:v})
      },
      e => {
        console.log("error:",e.message);
      });
      this.setState({
        items:[]
      });

      this.refreshSub = Observable.interval(10000).subscribe(() => this.props.model.loadAudit());
      this.props.model.loadAudit();

    }

    componentWillUnmount() {
      this.dataSub.unsubscribe();
      this.refreshSub.unsubscribe();
    }
  
      
    private _onItemInvoked(item: any): void {
      alert(`Item invoked: ${item.name}`);
    }
  
  

  public render() {
    let { items } = this.state;
  
    return (
          <DetailsList
            items={ items }
            columns={ columns }
            setKey='set'
//            layoutMode={ DetailsListLayoutMode.fixedColumns }
            selectionPreservedOnEmptyClick={ true }
            selectionMode={SelectionMode.none}
            ariaLabelForSelectionColumn='Toggle selection'
            ariaLabelForSelectAllCheckbox='Toggle selection for all items'
            onItemInvoked={ this._onItemInvoked }
          />
    );
  }
}