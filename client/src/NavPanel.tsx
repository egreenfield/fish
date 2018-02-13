
import * as React from 'react';
import { Nav, INavLinkGroup, INavLink } from 'office-ui-fabric-react/lib/Nav';
import * as PropTypes from "prop-types";
import {ColorClassNames} from '@uifabric/styling';
//import { withRouter, Router } from "react-router";

interface NavPanelProps {
}


export class NavPanel extends React.Component<NavPanelProps> {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  public navItems:INavLinkGroup[] = 
  [
    {
      links:
      [
        { name: 'Home',url: '/',},
        { name: 'General',url: '/general',},
        { name: 'Users',url: '/users',},
        { name: 'Message Log', url: '/audit' },
        { name: 'Log', url: '/log' },
        { name: "Voice Options", url: '/voice'}
      ]
    }
  ];

  private navigate(e:React.MouseEvent<HTMLElement>,l:INavLink) {
    console.log("navigating to",l.url);
    this.context.router.history.push(l.url);
    e.preventDefault();
  }
  public render() {
    return (
      <div className='nav'>
        <Nav className={ColorClassNames.themeDark}
          groups={this.navItems}
          onLinkClick={(e,l) => {this.navigate(e!,l!);}}
          
        />
      </div>
    );
  }
}

