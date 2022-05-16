import React from 'react';
import appTheme from '../theme';
import IndividualMode from './IndividualMode';
import BulkMode from './BulkMode';
import Filter from './Filter'
//Material UI 

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';


import None from '@mui/icons-material/NotInterested';
import ActionDone from '@mui/icons-material/Done';
import ActionDoneAll from '@mui/icons-material/DoneAll';
import Help from '@mui/icons-material/Help';

//dhis2
import i18n from '../locales/index.js' 

// Styles
require('../scss/app.scss');

const styles = {
  header: {
    fontSize: 24,
    fontWeight: 300,
    color: appTheme.palette.primary.textColor,
    padding: '24px 0 12px 16px',
  },
  chips: {
    color: appTheme.palette.primary.canvasColor,
    avatarColor: appTheme.palette.primary.canvasColor,
    iconColor: appTheme.palette.primary.settingOptions.icon
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
    // const d2 = this.props.d2;
    // const api = d2.Api.getApi();
    // let result = {};
     try {
    //   let res = await api.get('/' + urlAPI + "?fields=id,code,displayName,externalAccess,publicAccess,userGroupAccesses,userAccesses&paging=false&page=");
    //   if (res.hasOwnProperty(urlAPI)) {
    //     return res;
    //   }
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
    //refresh List
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
    //update state
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
    const actions = [
      <Button
        label={i18n.t("CN_CLOSE")}
        primary={true}
        onClick={this.handleClose.bind(this)}
      />];
    return (

      <div className="app">
        <div className='content-area'>
          <div style={styles.header}>
            Sharing Setting for:  <span style={{"fontWeight": "bold"}}>{i18n.t(this.props.title)}</span>
          </div>
          <div style={{textAlign:'right'}}>
          <Button
              icon={<Help/>}
               onClick={this.handleOpen.bind(this)}
            />

            <Dialog
              title={i18n.t("CN_TITLE")}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose.bind(this)}
              actions={actions}
            >
              <div>
              {i18n.t("CN_SUBTITLE_METADATA")}
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<None />} />
                  {i18n.t("NO_ACCESS")}
                </Chip>
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<ActionDone />} />
                  {i18n.t("CAN_VIEW")}
                </Chip>
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<ActionDoneAll />} />
                  {i18n.t("CAN_EDIT")}
                </Chip>

              </div>
              <div>
              {i18n.t("CN_SUBTITLE_DATA")}
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<None />} />
                  {i18n.t("NO_ACCESS")}
                </Chip>
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<ActionDone />} />
                  {i18n.t("CAN_VIEW")}
                </Chip>
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<ActionDoneAll />} />
                  {i18n.t("CAN_EDIT")}
                </Chip>

              </div>

            </Dialog>


          </div>
          <Filter  
        handlefilterTextChange={this.handlefilterTextChange.bind(this)} 
        handleReturnFilterSelected={this.getFilterSelected.bind(this)}
        filterAvailable={this.props.informationResource}
        />

          <Tabs
            value={this.state.mode}
            onChange={this.handleChangeTabs.bind(this)}
          >
            <Tab label={i18n.t("TAB_VIEW_MODE")} value="view">
              <IndividualMode 
              resource={this.props.informationResource} 
              Enabledchecked={false}
              listObject={this.state.listObject}
              currentPage={this.state.currentPage}
              handleChangeTabs={this.handleChangeTabs.bind(this)}
              searchByName={this.state.searchByName}
              filterString={this.state.filterString}

              />
            </Tab>
            <Tab label={i18n.t("TAB_EDIT_MODE")} value="edit">
              <BulkMode 
              resource={this.props.informationResource} 
              listObject={this.state.listObject}
              pager={this.state.pager}
              searchByName={this.state.searchByName}
              filterString={this.state.filterString}
              handleChangeTabs={this.handleChangeTabs.bind(this)}
              />
            </Tab>
          </Tabs>
        </div>
      </div>

    );

  }

};

export default Content