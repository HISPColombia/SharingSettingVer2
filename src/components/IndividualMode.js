import React from 'react';
import None from 'material-ui/svg-icons/av/not-interested';
import ActionDone from 'material-ui/svg-icons/action/done';
import ActionDoneAll from 'material-ui/svg-icons/action/done-all';
import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import More from 'material-ui/svg-icons/navigation/more-vert'; 
import Dialog from 'material-ui/Dialog';

import appTheme from '../theme';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import ListGroups from './ListGroups';
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
  tablerow: {
    wordWrap: 'break-word',
    whiteSpace: 'normal'
  },
  buttonGroup: {
    textAlign: 'center'
  },
  buttonMore: {
    textAlign: 'right',
    with:50
  },
  divConcentTable:{
    height: 600,
    overflow: 'auto'
  }

};

class IndividualMode extends React.Component {



  constructor(props) {
    super(props);
    this.state = { currentPage: 0, openModal: false,userAndGroupsSelected:{},messajeError:"mensaje de error"}
  }
    //query resource Selected
    async setResourceSelected(urlAPI, Payload) {
      const d2 = this.props.d2;
      const api = d2.Api.getApi();
      try {
        let res = await api.post(urlAPI, Payload);
        //update change on listview
        this.props.handleChangeTabs("view");
        return res;
      }
      catch (e) {
        return e;
      }
    }
  SendInformationAPI(obj,userAccesses,userGroupAccesses) {
      let valToSave = {
        meta: {
          allowPublicAccess: (this.state.PublicAccess == 0 ? false : true),
          allowExternalAccess: this.state.ExternalAccess
        },
        object: {
          id: obj.id,
          displayName: obj.displayName,
          externalAccess: obj.externalAccess,
          name: obj.name,
          publicAccess: obj.publicAccess,
          userAccesses,
          userGroupAccesses,
        }

      }
      this.setResourceSelected("sharing?type=" + this.props.resource.key + "&id=" + obj.id, valToSave).then(res => {
        if(res.status!="OK")
          this.setState({messajeError:res.message})
      })
  }

  handleOpen(data) {
  
    this.setState({openModal: true, userAndGroupsSelected:data});
  };

  handleClose(){
    this.setState({openModal: false});
  };
  GroupSelected(selected) {
     this.SendInformationAPI(this.state.userAndGroupsSelected,selected.userAccesses,selected.userGroupAccesses);
  }  
  componentDidMount() {
      this.state = { currentPage: this.props.currentPage,openModal: false,userAndGroupsSelected:{},messajeError:""};
    }


 waiting(){
   var hide=true;
    setTimeout(()=>{hide=true},5000)
     return (
      <div style={hide?{display: "none"}:{}}>
          <LinearProgress mode="indeterminate" />
      </div>
    )
  }
  //methods
  resolveAccessMessage(access, type) {
    const publicAccessStatus = {
      "rw": "CAN_EDIT",
      "r-": "CAN_VIEW",
      "--": "NO_ACCESS",
    }
    try{
    let metaDataAccess = access[0] + access[1];
    let DataAccess = access[2] + access[3];
    if (type == "data") {
      return publicAccessStatus[DataAccess];
    }
    else {
      return publicAccessStatus[metaDataAccess];
    }
  } catch(er){
      return "NO_ACCESS"
  }
  }
  renderResultInTable() {
    let keysCount = 0;
    //convert object to array
    let rowRaw = Object.values(this.props.listObject);
    //
    const d2 = this.props.d2;
    const funResolvMessage = this.resolveAccessMessage;
    return rowRaw.map((row) => {
      keysCount++;
      //handle last separator
      if (row.userGroupAccesses.length > 0)
        var lastUG = row.userGroupAccesses[row.userGroupAccesses.length - 1].id;
      else
        var lastUG = "";

      if (row.userAccesses.length > 0)
        var lastUS = row.userAccesses[row.userAccesses.length - 1].id;
      else
        var lastUS = "";
        //filter by name ir by filter selected
      if (((row.displayName.includes(this.props.searchByName) == true) && (this.props.filterString.includes(row.id)==true || this.props.filterString=="")))
        return (<TableRow key={keysCount}>
          <TableRowColumn style={styles.tablerow}>{row.displayName}</TableRowColumn>
          <TableRowColumn style={styles.tablerow}>{funResolvMessage(row.publicAccess, "metadata") == "CAN_EDIT" ? <ActionDoneAll /> : funResolvMessage(row.publicAccess, "metadata") == "CAN_VIEW" ? <ActionDone /> : <None />}</TableRowColumn>
          <TableRowColumn style={styles.tablerow}>{row.externalAccess ? <ActionDone /> : <None />}</TableRowColumn>
          <TableRowColumn style={styles.tablerow}>

            {row.userGroupAccesses.map((ug) => {
              if(ug.access==undefined){
                ug.access="--------"
              }
              return (
                <div key={ug.id + "_" + keysCount} style={styles.buttonGroup} title={"METADATA: " + d2.i18n.getTranslation(funResolvMessage(ug.access, "metadata")) + " DATA:" + d2.i18n.getTranslation(funResolvMessage(ug.access, "data"))}>
                  <div>
                    {ug.access[1] == "w" ? <ActionDoneAll /> : <ActionDone />}
                    {ug.access[3] == "w" ? <ActionDoneAll /> : ug.access[2] == "r" ? <ActionDone /> : <None />}
                  </div>
                  <div>{ug.displayName}</div>
                  {lastUG != ug.id ? <Divider /> : ""}
                </div>)
            })
            }
          </TableRowColumn>
          <TableRowColumn style={styles.tablerow}>
            {row.userAccesses.map((us) => {
              if(us.access==undefined){
                us.access="--------"
              }
              return (
                <div key={us.id + "_" + keysCount} style={styles.buttonGroup} title={"METADATA: " + d2.i18n.getTranslation(funResolvMessage(us.access, "metadata")) + " DATA:" + d2.i18n.getTranslation(funResolvMessage(us.access, "data"))}>
                  <div>
                    {us.access[1] == "w" ? <ActionDoneAll /> : <ActionDone />}
                    {us.access[3] == "w" ? <ActionDoneAll /> : us.access[2] == "r" ? <ActionDone /> : <None />}
                  </div>
                  <div>{us.displayName}</div>
                  {lastUS != us.id ? <Divider /> : ""}
                </div>)
            })
            }
         
          </TableRowColumn>
          <TableRowColumn style={styles.buttonMore}>
          <FlatButton icon={<More/>}  onClick={()=>this.handleOpen(row)} />
          </TableRowColumn>
        </TableRow>)
      })


  }
  render() {
    const d2 = this.props.d2;
    return (
      <div>

        <div style={styles.divConcentTable}>
        {
          //this.waiting()
        }
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={this.props.Enabledchecked}>
            <TableRow>
              <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_NAME")}</TableHeaderColumn>
              <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_PUBLICACCESS")}</TableHeaderColumn>
              <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_EXTERNALACCESS")}</TableHeaderColumn>
              <TableHeaderColumn style={styles.buttonGroup}>{d2.i18n.getTranslation("TABLE_SHARINGGROUP")}</TableHeaderColumn>
              <TableHeaderColumn style={styles.buttonGroup}>{d2.i18n.getTranslation("TABLE_SHARINGUSER")}</TableHeaderColumn>
              <TableHeaderColumn style={styles.buttonMore}></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={this.props.Enabledchecked} showRowHover={true}>
            {Object.keys(this.props.listObject).length > 0 ? this.renderResultInTable() :""}
          </TableBody>

        </Table>
        <Dialog
          title={d2.i18n.getTranslation("STEP_2")}
          actions={[
            <FlatButton
              label={d2.i18n.getTranslation("BTN_CLOSE")}
              primary={true}
              onClick={this.handleClose.bind(this)}
            />]}
          modal={false}
          open={this.state.openModal}
          onRequestClose={this.handleClose.bind(this)}
        >
        <div>
        <div style={{ marginTop: 12, textAlign: 'center', color: "Red" }}>
                  <p>{this.state.messajeError}</p>
                </div>
        <ListGroups d2={d2} GroupSelected={this.GroupSelected.bind(this)} resource={this.props.resource} currentSelected={this.state.userAndGroupsSelected} />

        </div>
        </Dialog>

      </div>
      </div>
    )

  }

};
IndividualMode.propTypes = {
  d2: React.PropTypes.object.isRequired,
  listObject: React.PropTypes.object,
  Enabledchecked: React.PropTypes.bool,
  handleChangeTabs: React.PropTypes.func,
  currentPage: React.PropTypes.number,
  searchByName:React.PropTypes.string,
  filterString:React.PropTypes.string,
  resource: React.PropTypes.object
};
export default IndividualMode;