import React from 'react';
import appTheme from '../theme';
import ViewMode from './viewMode';
import EditMode from './editMode';
import Filter from './Filter'
//Material UI 

import { Tab, Tabs } from 'material-ui/Tabs';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import None from 'material-ui/svg-icons/av/not-interested';
import ActionDone from 'material-ui/svg-icons/action/done';
import ActionDoneAll from 'material-ui/svg-icons/action/done-all';
import Help from 'material-ui/svg-icons/action/help';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

// Styles
require('../scss/app.scss');

const styles = {
  header: {
    fontSize: 24,
    fontWeight: 300,
    color: appTheme.rawTheme.palette.textColor,
    padding: '24px 0 12px 16px',
  },
  chips: {
    color: appTheme.rawTheme.palette.canvasColor,
    avatarColor: appTheme.rawTheme.palette.canvasColor,
    iconColor: appTheme.settingOptions.icon
  }
};


class Content extends React.Component {

  constructor(props) {
    super(props);
    this.state = { searchByName:"",filterString:"",open: false, mode: 'view', listObject: {}, pager: { page: 0, pageCount: 0, pageSize: 0, total: 0 }, currentPage: 1 }
  }

  //API Query

  //query resource Selected
  async getResourceSelected(urlAPI) {
    const d2 = this.props.d2;
    const api = d2.Api.getApi();
    let result = {};
    try {
      let res = await api.get('/' + urlAPI + "?fields=id,code,displayName,externalAccess,publicAccess,userGroupAccesses,userAccesses&paging=false&page=");
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
  componentDidUpdate(prevProps, prevState) {
    try {
      if ((this.props.title != prevProps.title || this.state.currentPage != prevState.currentPage) && this.props.informationResource.resource != undefined) {
        //reset count of pages
        if (this.props.title != prevProps.title) {
          this.setState({ currentPage: 1 })
        }
        this.getResourceSelected(this.props.informationResource.resource).then(res => {
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
    } catch (err) {
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
  updateParams(currentPage) {
    this.setState({ currentPage });
  }
  //Handles

  //tabs handle
  handleChangeTabs(value) {
    this.setState({
      mode: value,
    });
    this.props.disableSlide(value)
  };

  //handle filter
    //handler
    handlefilterTextChange(textSearch) {
      this.setState({ searchByName: textSearch });
  
    }
    getFilterSelected(filterValue){
      if(Object.keys(filterValue).length!=0)
        this.setState({filterString:JSON.stringify(filterValue)})
      else  
        this.setState({filterString:""})
    }
  //handle Modal

  handleOpen(){
    this.setState({ open: true });
  };

  handleClose(){
    this.setState({ open: false });
  };

  render() {
    const d2 = this.props.d2;

    const actions = [
      <FlatButton
        label={d2.i18n.getTranslation("CN_CLOSE")}
        primary={true}
        onClick={this.handleClose.bind(this)}
      />];
    return (

      <div className="app">
        <div className='content-area'>
          <div style={styles.header}>
            Sharing Setting for:  <span style={{"fontWeight": "bold"}}>{d2.i18n.getTranslation(this.props.title)}</span>
          </div>
          <div style={{textAlign:'right'}}>
          <FlatButton
              icon={<Help/>}
               onClick={this.handleOpen.bind(this)}
            />

            <Dialog
              title={d2.i18n.getTranslation("CN_TITLE")}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose.bind(this)}
              actions={actions}
            >
              <div>
              {d2.i18n.getTranslation("CN_SUBTITLE_METADATA")}
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<None />} />
                  {d2.i18n.getTranslation("NO_ACCESS")}
                </Chip>
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<ActionDone />} />
                  {d2.i18n.getTranslation("CAN_VIEW")}
                </Chip>
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<ActionDoneAll />} />
                  {d2.i18n.getTranslation("CAN_EDIT")}
                </Chip>

              </div>
              <div>
              {d2.i18n.getTranslation("CN_SUBTITLE_DATA")}
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<None />} />
                  {d2.i18n.getTranslation("NO_ACCESS")}
                </Chip>
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<ActionDone />} />
                  {d2.i18n.getTranslation("CAN_VIEW")}
                </Chip>
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<ActionDoneAll />} />
                  {d2.i18n.getTranslation("CAN_EDIT")}
                </Chip>

              </div>

            </Dialog>


          </div>
          <Filter 
        d2={d2} 
        handlefilterTextChange={this.handlefilterTextChange.bind(this)} 
        handleReturnFilterSelected={this.getFilterSelected.bind(this)}
        filterAvailable={this.props.informationResource}
        />

          <Tabs
            value={this.state.mode}
            onChange={this.handleChangeTabs.bind(this)}
          >
            <Tab label={d2.i18n.getTranslation("TAB_VIEW_MODE")} value="view">
              <ViewMode 
              Enabledchecked={false}
              d2={d2} 
              listObject={this.state.listObject}
              currentPage={this.state.currentPage}
              updateParams={this.updateParams.bind(this)}
              searchByName={this.state.searchByName}
              filterString={this.state.filterString}
              />
            </Tab>
            <Tab label={d2.i18n.getTranslation("TAB_EDIT_MODE")} value="edit">
              <EditMode 
              resource={this.props.informationResource} 
              d2={d2}
              listObject={this.state.listObject}
              pager={this.state.pager}
              searchByName={this.state.searchByName}
              filterString={this.state.filterString}
              />
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
  informationResource: React.PropTypes.object,
  disableSlide: React.PropTypes.func
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