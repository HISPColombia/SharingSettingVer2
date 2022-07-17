import React from 'react';
import appTheme from '../theme';
import IndividualMode from './IndividualMode';
import BulkMode from './BulkMode';
import Filter from './Filter'
import {get} from '../API/Dhis2.js';
//Material UI 

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
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

import jsonpath from 'jsonpath';

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


class Content extends React.Component {

  constructor(props) {
    super(props);
    this.state = { searchByName:"",filterids:"",filterString:"",open: false, mode: "view", listObject: {}, pager: { page: 0, pageCount: 0, pageSize: 0, total: 0 }, originSearch: false }
  }

  //API Query

  //query resource Selected
  async getResourceSelected(urlAPI,page=1,searchByName="") {
        let result = {};
     try {
      let res = await get('/' + urlAPI + "?fields=id,code,name,displayName,externalAccess,publicAccess,userGroupAccesses[id,access,displayName~rename(name),userGroupUid],userAccesses[id,access,displayName~rename(name),userUid]&page="+page+(searchByName===""?"":"&filter=identifiable:token:"+searchByName)+(this.state.filterids===""?"":"&filter=id:in:"+this.state.filterids));
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
      if (this.props.title != prevProps.title && this.props.informationResource.resource != undefined) {
        //reset count of pages
        if (this.props.title != prevProps.title) {
          this.setState({ originSearch: true })
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


  //tabs handle
  handleChangeTabs(textSearch,value,page=1) {
    //refresh List
    this.getResourceSelected(this.props.informationResource.resource,page,textSearch).then(res => {
      let dataResult = {}
      for (let g of res[this.props.informationResource.resource]) {
        dataResult[g.id] = g;
      }
      this.setState({
        listObject: dataResult,
        pager: res.pager
      });
    });
   // update state
    this.setState({
      mode: value,
    });

    this.props.disableSlide(value)
  };
    //tabs handle
    reloadData(page=1) {
      //refresh List
      this.getResourceSelected(this.props.informationResource.resource,page).then(res => {
        let dataResult = {}
        for (let g of res[this.props.informationResource.resource]) {
          dataResult[g.id] = g;
        }
        this.setState({
          listObject: dataResult,
          originSearch:"bulklist"
        });
      });

    };

  //handle filter
    //handler
    handlefilterTextChange(textSearch) {
      this.setState({ searchByName: textSearch, originSearch:"search" }); 
      this.handleChangeTabs(textSearch,this.state.mode) 
    }
    getFilterSelected(filterValue, filter){
      if(Object.keys(filterValue).length!=0){
        let arrid=jsonpath.query(filterValue,filter.expression);
        this.setState({originSearch:"search",filterString:JSON.stringify(filterValue),filterids:JSON.stringify(arrid).replace(/['"]+/g, '')})
        this.handleChangeTabs(undefined,this.state.mode);
      }
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
        label={i18n.t("Close")}
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
              title={i18n.t("Conventions")}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose.bind(this)}
              actions={actions}
            >
              <div>
              {i18n.t("METADATA - privileges related to access")}
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<None />} />
                  {i18n.t("No Access")}
                </Chip>
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<ActionDone />} />
                  {i18n.t("Can find and view")}
                </Chip>
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<ActionDoneAll />} />
                  {i18n.t("Can find, view and edit")}
                </Chip>

              </div>
              <div>
              {i18n.t("DATA - Privileges related to data registration and access")}
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<None />} />
                  {i18n.t("No Access")}
                </Chip>
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<ActionDone />} />
                  {i18n.t("Can find and view")}
                </Chip>
                <Chip backgroundColor={styles.chips.color}>
                  <Avatar backgroundColor={styles.chips.avatarColor} color={styles.chips.iconColor} icon={<ActionDoneAll />} />
                  {i18n.t("Can find, view and edit")}
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
            <Tab label={i18n.t("Individual mode")} value="view"/>    
            <Tab label={i18n.t("Bulk mode")} value="edit"/>              
          </Tabs>
          <Box>
            <TabPanel value={this.state.mode} index={"view"}>
                 <IndividualMode 
                  resource={this.props.informationResource} 
                  Enabledchecked={false}
                  listObject={this.state.listObject}
                  pager={this.state.pager}
                  originSearch={this.state.originSearch}
                  handleChangeTabs={this.handleChangeTabs.bind(this)}
                  searchByName={this.state.searchByName}
                  filterString={this.state.filterString}

              />
            </TabPanel>
            <TabPanel value={this.state.mode} index={"edit"}>
              <BulkMode 
                resource={this.props.informationResource} 
                listObject={this.state.listObject}
                pager={this.state.pager}
                originSearch={this.state.originSearch}
                searchByName={this.state.searchByName}
                filterString={this.state.filterString}
                handleChangeTabs={this.handleChangeTabs.bind(this)}
                reloadData={this.reloadData.bind(this)}
              />
            </TabPanel>
            
          </Box>
        </div>
      </div>

    );

  }

};

export default Content