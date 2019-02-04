import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import appTheme from '../theme';

//Material UI
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { Tab, Tabs } from 'material-ui/Tabs';
import IconButton from 'material-ui/IconButton';
import Check from 'material-ui/svg-icons/navigation/check'
import Remove from 'material-ui/svg-icons/content/remove'
import Find from 'material-ui/svg-icons/action/find-in-page'
import Edit from 'material-ui/svg-icons/image/edit';
import NaviateNext from 'material-ui/svg-icons/image/navigate-next';
import NaviateBefore from 'material-ui/svg-icons/image/navigate-before';
import Filter from './Filter'
// Styles
require('../scss/app.scss');

const styles = {
  header: {
    fontSize: 24,
    fontWeight: 300,
    color: appTheme.rawTheme.palette.textColor,
    padding: '24px 0 12px 16px',
  },
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  containterfooter: {
    display: 'grid',
    gridTemplateColumns: 'auto 100px 140px',
    gridTemplateRows: 'auto'
  },
  ItemFooter: {
    fontSize: 14,
    alignSelf: 'center',
    justifySelf: 'end'
  },
  tablerow:{
    wordWrap: 'break-word',
    whiteSpace: 'normal'
  },
  dataEdit: appTheme.settingOptions.write
  ,
  dataView:appTheme.settingOptions.read
  ,
  dataNoAccess:appTheme.settingOptions.blocked
  ,
  space:{
    color:'#ffffff'
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
  }

  getChildContext() {
    return {
      d2: this.props.d2,
      muiTheme: appTheme
    };
  }
//Handles
  //pagernextHandle
  handleNextPage(){
    this.setState({currentPage:this.state.currentPage+1})
  }
  handleBeforePage(){
    if(this.state.currentPage>1)
      this.setState({currentPage:this.state.currentPage-1})
  }
  //tabs handle
  handleChangeTabs(value) {
    this.setState({
      mode: value,
    });
  };
  resolveAccessMessage(access, type){
    const publicAccessStatus={
      "rw":"CAN_EDIT",
      "r-":"CAN_VIEW",
      "--":"NO_ACCESS",
    }
    let metaDataAccess=access[0]+access[1];
    let DataAccess=access[2]+access[3];
    if(type=="data"){
      return publicAccessStatus[DataAccess];
    }
    else{
      return publicAccessStatus[metaDataAccess];
    }
  }
  renderResultInTable() {
    let rows = "";
    //convert object to array
    const rowRaw = Object.values(this.state.listObject);
    //
    const d2 = this.props.d2;
    const funResolvMessage=this.resolveAccessMessage;
    return rowRaw.map((row)=> {
      return (<TableRow>
        <TableRowColumn style={styles.tablerow}>{row.displayName}</TableRowColumn>
        <TableRowColumn style={styles.tablerow}>{d2.i18n.getTranslation(funResolvMessage(row.publicAccess,"metadata"))}</TableRowColumn>
        <TableRowColumn style={styles.tablerow}>{row.externalAccess?<Check/>:<Remove/>}</TableRowColumn>
        <TableRowColumn style={styles.tablerow}>
               
        {row.userGroupAccesses.map(function(ug){
          return(
          <div title={"METADATA: " + d2.i18n.getTranslation(funResolvMessage(ug.access,"metadata")) + " DATA:" + d2.i18n.getTranslation(funResolvMessage(ug.access,"data"))}>
          <Find color={ug.access[1]=="w"?styles.dataEdit:styles.dataView}/>
          <Edit color={ug.access[3]=="w"?styles.dataEdit:ug.access[2]=="r"?styles.dataView:styles.dataNoAccess}/> {ug.displayName}
          </div>)
        })}
         </TableRowColumn>
         <TableRowColumn style={styles.tablerow}>
        {row.userAccesses.map(function(us){
                    return(
                      <div title={"METADATA: " + d2.i18n.getTranslation(funResolvMessage(us.access,"metadata")) + " DATA:" + d2.i18n.getTranslation(funResolvMessage(us.access,"data"))}>
                      <Find color={us.access[1]=="w"?styles.dataEdit:styles.dataView}/>
                      <Edit color={us.access[3]=="w"?styles.dataEdit:us.access[2]=="r"?styles.dataView:styles.dataNoAccess}/> {us.displayName}
                      </div>)
        })}
        </TableRowColumn>
      </TableRow>)
    })

  }


  render() {
    const d2 = this.props.d2;
    

    return (
      <MuiThemeProvider muiTheme={appTheme}>
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
                <div>
                  <Filter d2={d2} />
                  <Table>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                      <TableRow>
                        <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_NAME")}</TableHeaderColumn>
                        <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_PUBLICACCESS")}</TableHeaderColumn>
                        <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_EXTERNALACCESS")}</TableHeaderColumn>
                        <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_SHARINGGROUP")}</TableHeaderColumn>
                        <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_SHARINGUSER")}</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} showRowHover={true}>
                      {Object.keys(this.state.listObject).length > 0 ? this.renderResultInTable() : ""}
                    </TableBody>
                  </Table>
                  <p />
                  <div style={styles.containterfooter}>
                    <div style={styles.ItemFooter}></div>
                    <div style={styles.ItemFooter}>
                      {1 + 50 * (this.state.pager.page-1)} - {50 * this.state.pager.page} of {this.state.pager.total}
                    </div>
                    <div style={styles.ItemFooter}>
                      <IconButton disabled={this.state.pager.page==1?true:false}>
                        <NaviateBefore onClick={() => this.handleBeforePage()} />
                      </IconButton>
                      <IconButton disabled={this.state.pager.page==this.state.pager.pageCount?true:false}>
                        <NaviateNext onClick={() =>this.handleNextPage()}/>
                      </IconButton>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab label={d2.i18n.getTranslation("TAB_EDIT_MODE")} value="edit">
                <div>
                  <h2>Controllable Tab B</h2>
                  <p>
                    This is another example of a controllable tab. Remember, if you
                    use controllable Tabs, you need to give all of your tabs values or else
                    you wont be able to select them.
            </p>
                </div>
              </Tab>
            </Tabs>



          </div>
        </div>
      </MuiThemeProvider>
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