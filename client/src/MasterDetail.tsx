import * as React from 'react';
import {DetailsList,IColumn} from 'office-ui-fabric-react/lib/DetailsList';

export class Detail<ItemType> extends React.Component<{item?:ItemType}> {

}

interface MasterDetailProps<ItemType> {
    items:ItemType[];
    getLabel:(item:ItemType)=>string;
    detailComponent:()=>any;
}

interface MasterDetailState<ItemType> {
    selectedItem:ItemType;
}

const columns: IColumn[] = [
    {
      key: 'column1',
      name: 'Time',
      fieldName: 'label',
      minWidth: 100,
      maxWidth: 200,
      isResizable: false,
    },
  ];
    


export class MasterDetail<ItemType> extends React.Component<MasterDetailProps<ItemType>,MasterDetailState<ItemType>> {
  

    componentWillMount() {
    }
    
    componentWillUnmount() {
    }
  
  public render() {
//    let { selectedItem } = this.state;
    let { items, getLabel } = this.props;

    let options = items.map(v => ({ name:getLabel(v) }))
    return (
        <div className="compactPanel">
            <DetailsList
            items={ options }
            columns={ columns }
 //            layoutMode={ DetailsListLayoutMode.fixedColumns }
            selectionPreservedOnEmptyClick={ true }
//            onItemInvoked={ this._onItemInvoked }
          />
        </div>
  );
  } 
}