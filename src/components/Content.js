import React from 'react';
import appTheme from '../theme';
import ViewMode from './viewMode';
import EditMode from './editMode';
//Material UI

import { Tab, Tabs } from 'material-ui/Tabs';


// Styles
require('../scss/app.scss');

const styles = {
  header: {
    fontSize: 24,
    fontWeight: 300,
    color: appTheme.rawTheme.palette.textColor,
    padding: '24px 0 12px 16px',
  }
};


class Content extends React.Component {

  constructor(props) {
    super(props);
    this.state = { mode: 'view', listObject: {}, pager: { page: 0, pageCount: 0, pageSize: 0, total: 0 },currentPage:1}
  }

  //API Query

  //query resource Selected
  async getResourceSelected(urlAPI, page) {
    const d2 = this.props.d2;
    const api = d2.Api.getApi();
    let result = {};
    try {
      let res = await api.get('/' + urlAPI + "?fields=id,code,displayName,externalAccess,publicAccess,userGroupAccesses,userAccesses&page="+page);
      if (res.hasOwnProperty(urlAPI)) {
        return res;
      }
    }
    catch (e) {
      console.error('Could not access to API Resource');
    }
    return result;
  }
   // life cycle
  componentDidUpdate(prevProps,prevState) {
    try{
    if ((this.props.title != prevProps.title || this.state.currentPage != prevState.currentPage) && this.props.informationResource.resource != undefined){
      //reset count of pages
      if(this.props.title != prevProps.title){
        this.setState({currentPage:1})
      }    
    this.getResourceSelected(this.props.informationResource.resource,this.state.currentPage).then(res => {
        let dataResult = {}
        for (let g of res[this.props.informationResource.resource]) {
          dataResult[g.id] = g;
        }
        this.setState({
          listObject: dataResult,
          pager: res.pager
        });
      });
    }
    }catch(err){
      console.log(err);
    }

  }

  

  getChildContext() {
    return {
      d2: this.props.d2,
      muiTheme: appTheme
    };
  }

   //methods
   updateParams(currentPage){
    this.setState({currentPage});
  }
//Handles

  //tabs handle
  handleChangeTabs(value) {
    this.setState({
      mode: value,
    });
  };


  render() {
    const d2 = this.props.d2;
    

    return (
    
        <div className="app">
          <div className='content-area'>
            <div style={styles.header}>
              Sharing Setting for {d2.i18n.getTranslation(this.props.title)}
            </div>
            <Tabs
              value={this.state.mode}
              onChange={this.handleChangeTabs.bind(this)}
            >
              <Tab label={d2.i18n.getTranslation("TAB_VIEW_MODE")} value="view">
               <ViewMode Enabledchecked={false} d2={d2} listObject={this.state.listObject} pager={this.state.pager} currentPage={this.state.currentPage} updateParams={this.updateParams.bind(this)} />
              </Tab>
              <Tab label={d2.i18n.getTranslation("TAB_EDIT_MODE")} value="edit">
                <EditMode d2={d2} listObject={this.state.listObject} pager={this.state.pager} />
              </Tab>
            </Tabs>
          </div>
        </div>

    );

  }
};

Content.propTypes = {
  d2: React.PropTypes.object.isRequired,
  title: React.PropTypes.string,
  informationResource: React.PropTypes.object
};

Content.contextTypes = {
  title: React.PropTypes.string,
  muiTheme: React.PropTypes.object
};

Content.childContextTypes = {
  d2: React.PropTypes.object,
  muiTheme: React.PropTypes.object
};

export default Content