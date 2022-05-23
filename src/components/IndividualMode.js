import React from 'react';
import None from '@mui/icons-material/NotInterested';
import ActionDone from '@mui/icons-material/Done';
import ActionDoneAll from '@mui/icons-material/DoneAll';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import More from '@mui/icons-material/MoreVert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import appTheme from '../theme';
//dhis2
import i18n from '../locales/index.js' 
import {post} from '../API/Dhis2.js';

import ListGroups from './ListGroups';
const styles = {
  header: {
    fontSize: 24,
    fontWeight: 300,
    color: appTheme.palette.primary.textColor,
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
      try {
        let res = await post(urlAPI, Payload);
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
      this.setResourceSelected("/sharing?type=" + this.props.resource.key + "&id=" + obj.id, valToSave).then(res => {
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
          <TableCell  style={styles.tablerow}>{row.displayName}</TableCell >
          <TableCell  style={styles.tablerow}>{funResolvMessage(row.publicAccess, "metadata") == "CAN_EDIT" ? <ActionDoneAll /> : funResolvMessage(row.publicAccess, "metadata") == "CAN_VIEW" ? <ActionDone /> : <None />}</TableCell >
          <TableCell  style={styles.tablerow}>{row.externalAccess ? <ActionDone /> : <None />}</TableCell >
          <TableCell  style={styles.tablerow}>

            {row.userGroupAccesses.map((ug) => {
              if(ug.access==undefined){
                ug.access="--------"
              }
              return (
                <div key={ug.id + "_" + keysCount} style={styles.buttonGroup} title={"METADATA: " + i18n.t(funResolvMessage(ug.access, "metadata")) + " DATA:" + i18n.t(funResolvMessage(ug.access, "data"))}>
                  <div>
                    {ug.access[1] == "w" ? <ActionDoneAll /> : <ActionDone />}
                    {ug.access[3] == "w" ? <ActionDoneAll /> : ug.access[2] == "r" ? <ActionDone /> : <None />}
                  </div>
                  <div>{ug.displayName}</div>
                  {lastUG != ug.id ? <Divider /> : ""}
                </div>)
            })
            }
          </TableCell >
          <TableCell  style={styles.tablerow}>
            {row.userAccesses.map((us) => {
              if(us.access==undefined){
                us.access="--------"
              }
              return (
                <div key={us.id + "_" + keysCount} style={styles.buttonGroup} title={"METADATA: " + i18n.t(funResolvMessage(us.access, "metadata")) + " DATA:" + i18n.t(funResolvMessage(us.access, "data"))}>
                  <div>
                    {us.access[1] == "w" ? <ActionDoneAll /> : <ActionDone />}
                    {us.access[3] == "w" ? <ActionDoneAll /> : us.access[2] == "r" ? <ActionDone /> : <None />}
                  </div>
                  <div>{us.displayName}</div>
                  {lastUS != us.id ? <Divider /> : ""}
                </div>)
            })
            }
         
          </TableCell >
          <TableCell  style={styles.buttonMore}>
          <IconButton onClick={()=>this.handleOpen(row)}><More/>   </IconButton>
          </TableCell >
        </TableRow>)
      })


  }
  render() {
    return (
      <div>
        <div style={styles.divConcentTable}>
        {
          //this.waiting()
        }
        <Table>
          <TableHead  displaySelectAll={false} adjustForCheckbox={this.props.Enabledchecked}>
            <TableRow>
              <TableCell >{i18n.t("TABLE_NAME")}</TableCell >
              <TableCell >{i18n.t("TABLE_PUBLICACCESS")}</TableCell >
              <TableCell >{i18n.t("TABLE_EXTERNALACCESS")}</TableCell >
              <TableCell  style={styles.buttonGroup}>{i18n.t("TABLE_SHARINGGROUP")}</TableCell >
              <TableCell  style={styles.buttonGroup}>{i18n.t("TABLE_SHARINGUSER")}</TableCell >
              <TableCell  style={styles.buttonMore}></TableCell >
            </TableRow>
          </TableHead >
          <TableBody displayRowCheckbox={this.props.Enabledchecked} showRowHover={true}>
            {Object.keys(this.props.listObject).length > 0 ? this.renderResultInTable() :""}
          </TableBody>

        </Table>
        <Dialog
          modal={false}
          open={this.state.openModal}
          onRequestClose={this.handleClose.bind(this)}
        >
          <DialogTitle id="alert-dialog-title">
          {i18n.t("STEP_2")}
        </DialogTitle>
        <DialogContent>
            <div style={{ marginTop: 12, textAlign: 'center', color: "Red",position: "relative"}}>
                      <p>{this.state.messajeError}</p>
                    </div>
            <ListGroups GroupSelected={this.GroupSelected.bind(this)} resource={this.props.resource} currentSelected={this.state.userAndGroupsSelected} />

        </DialogContent>
        <DialogActions>
          <Button
              label={i18n.t("BTN_CLOSE")}
              primary={true}
              onClick={this.handleClose.bind(this)}
            />
        </DialogActions>
        </Dialog>

      </div>
      </div>
    )

  }

};
export default IndividualMode;