import React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
//dhis2
import {CustomDataProvider} from '@dhis2/app-runtime';
import { Transfer } from '@dhis2-ui/transfer';
import {SharingDialog} from './sharing-dialog';

import Avatar from '@mui/material/Avatar';

import CircularProgress from '@mui/material/CircularProgress';

//Component
import ListSelect from './ListSelect.component';
import appTheme from '../theme';
import IndividualSharingSetting from './IndividualSharingSetting';
import SpecialButton from './SpecialButton';
//dhis2
import i18n from '../locales/index.js';
import { post,get } from '../API/Dhis2.js';
import { value } from 'jsonpath';


const styles = {
  list: {
    border: "none",
    fontFamily: "Roboto",
    fontSize: 13,
    height: "250px",
    minHeight: "50px",
    outline: "none",
    width: "100%",
    overflowX: 'auto'
  },
  containterList: {
    margin:20,
    display: 'grid',
    gridTemplateColumns: '100%',
    gridTemplateRows: 'auto'
  },
  containterBtnAcction: {
    display: 'grid',
    gridTemplateColumns: '42% 10% 42% 6%',
    gridTemplateRows: 'auto'
  },
  containterStrategy: {
    display: 'grid',
    gridTemplateColumns: '100%',
    gridTemplateRows: 'auto',
    height:500
  },
  ItemsStrategy: {
    alignSelf: 'left',
    placeSelf: 'left'
  },
  ItemsList: {
    alignSelf: 'center'
  },
  ItemMiddleButton: {
    alignSelf: 'center',
    placeSelf: 'center'
  },
  ButtonSelect: {
    margin: 5
  },
  ButtonRightAling: {
    margin: 5,
    justifySelf: 'end'
  },
  ButtonLeftAling: {
    margin: 5,
    justifySelf: 'start'
  },
  ButtonActived: {
    backgroundColor: appTheme.palette.primary.accent1Color,
    textColor: appTheme.palette.primary.alternateTextColor
  },
  iconColor: appTheme.palette.primary.settingOptions.icon,
  papers: {
    height: 480,
    width: '90%',
    margin: 20,
    padding: 30,
    textAlign: 'left',
    display: 'inline-block',
    paddingBottom:100
  },
  subtitles: {
    fontSize: '100%',
    fontWeight: 'bold'

  },
  bodypaper: {
    margin: 20
  },
  bodypaper2: {
    display: 'grid',
    gridTemplateColumns: '70% 30%',
    gridTemplateRows: 'auto',
    margin: 20
  },
  SwitchExternal: {
    marginRight: 50,
    marginLeft: 20
  },
  divConcentTable: {
    height: 400,
    overflow: 'auto'
  },
  errorMessaje:{
    color:appTheme.palette.primary.error
  }

}
class BulkMode extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      finished: false,
      stepIndex: 0,
      objectAvailable: [],
      objectSelected: [],
      objectSelectedview: [],
      togSelected: "overwrite",
      messajeError: "",
      messajeSuccessful: {},
      userAndGroupsSelected: {
        userAccesses: [],
        userGroupAccesses: []
      },
      PublicAccess: 0,
      ExternalAccess: false,
      openModal:false,
      page: 1,
      loading:false,
      assingall: false,
    }
  };

  //query resource Selected
  async setResourceSelected(urlAPI, Payload) {
    try {
      let res = await post(urlAPI, Payload);
      return res;
    }
    catch (e) {
      return (e)
    }
  }
  removeAll(){
    let userAndGroupsSelected= {
      userAccesses: [],
      userGroupAccesses: []
    }
    this.setState({userAndGroupsSelected:userAndGroupsSelected});
  }
  setObjectSetting({data}){
    this.setState({ userAndGroupsSelected: data.object})
  }
  //query resource Selected
  async getUsersandGroups() {
    let api_users="/users?fields=id,name,displayName&paging=false"
    let api_usersgroups="/userGroups?fields=id,name,displayName&paging=false"
    let result={users:[],userGroups:[]};
      try {
        let result_users = await get(api_users);
        if(result_users.users.length>0)
          result.users=result_users.users;
        let result_groups = await get(api_usersgroups);
        if(result_groups.userGroups.length>0)
          result.userGroups=result_groups.userGroups;
        return result;       
      }
      catch (e) {
        return e;
      }
    }

  saveSetting(){
    var { stepIndex } = this.state;
    stepIndex = stepIndex + 1;
    this.setState({stepIndex});
    setTimeout(()=>{ this.SendInformationAPI() }, 3000);
  }
  SendInformationAPI() {
    var access = { 0: "--", 1: "r-", 2: "rw" };
    var obImported = [];
    var Imported=0;
    var noImported=0;
    var { stepIndex } = this.state;
    this.state.objectSelected.forEach((obj, index) => {
      let stringUserPublicAccess = access[this.state.PublicAccess] + "------";
     
      var userAccesses=this.state.userAndGroupsSelected.userAccesses;
      var userGroupAccesses=this.state.userAndGroupsSelected.userGroupAccesses;
      //Merge the current setting ---
      if(this.state.togSelected == "keep"){
        userAccesses=userAccesses.concat(obj.userAccesses),
        userGroupAccesses=userGroupAccesses.concat(obj.userGroupAccesses)
      }

      let valToSave = {
        meta: {
          allowPublicAccess: (this.state.PublicAccess == 0 ? false : true),
          allowExternalAccess: this.state.ExternalAccess
        },
        object: {
          id: obj.value,
          displayName: obj.label,
          externalAccess: this.state.ExternalAccess,
          name: obj.label,
          publicAccess: stringUserPublicAccess,
          userAccesses,
          userGroupAccesses
        }

      }      
      this.setResourceSelected("sharing?type=" + this.props.resource.key + "&id=" + obj.value, valToSave).then(res => {
        if(res.status=="OK"){
            Imported++;
        }
        else{
            noImported++;
        }
        obImported.push({label:obj.label,status:res.status,message:res.message});
        if (index == this.state.objectSelected.length - 1) {
          this.setState(
            {
              messajeSuccessful:
              {
                numImported: Imported,
                numNoImported:noImported,
                obImported
              },
              stepIndex: stepIndex + 1,
              finished: stepIndex >= 3
            }
          );
        }

      })

    })

  }

  handleNext() {
    const { stepIndex } = this.state;
    if ((this.state.objectSelected.length > 0 && stepIndex == 0) || (this.state.userAndGroupsSelected.userAccesses.length + this.state.userAndGroupsSelected.userGroupAccesses.length > 0 && stepIndex == 1)) {
      this.setState({
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 3,
        messajeError: ""
      });
    }
    else {
      this.setState({ messajeError: i18n.t("Select at least one object, user or group") });
    }
  };

  handlePrev() {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };
  handleRemoveAll() {
    let aList = this.state.objectAvailable;
    for (var k = 0; k < aList.length; k++) {
      aList[k].visible = true;
    }
    this.setState(
      {
        objectAvailable: aList,
        objectSelected: []
      });
  }
  handleSelectAll() {
    this.setState({loading:true,assingall:true});
    this.props.reloadData("all");

  }

  handleList(values) {   
    //Add or remove Object Selected
    let nList = [];
    let userAndGroupsSelected= {
      userAccesses: [],
      userGroupAccesses: []
    }
    if(values.objectAvailable==undefined) {
      values.objectAvailable=this.state.objectAvailable;
    }
    else{
      if(values.objectAvailable.length<this.state.objectAvailable.length){
        values.objectAvailable=this.state.objectAvailable;
      }
    }
    if(values.selected.length>0){
      values.selected.forEach((val,inx) => {
        try{
        let obSelected=values.objectAvailable.find(x => x.value === val);
        //add access to all object selected in the list, only one for user or group
        let users=obSelected.userAccesses;
        let groups=obSelected.userGroupAccesses;  

        users.forEach((user)=>{
          let _user=userAndGroupsSelected.userAccesses.map(u=>u.id).indexOf(user.id);
          if(_user===-1){
            //fix error in legacy data
            if (user.access==="--------") {
              user.access ="r-------";
            }
            userAndGroupsSelected.userAccesses.push(user);
          }
          else{
            if (userAndGroupsSelected.userAccesses[_user].access==="r-------") {
              userAndGroupsSelected.userAccesses[_user].access ="r-------";
            }
          }
        })

        groups.forEach((group)=>{
          let _group=userAndGroupsSelected.userGroupAccesses.map(g=>g.id).indexOf(group.id);
          if(_group===-1){
            //fix error in legacy data
            if (group.access==="--------") {
              group.access ="r-------";
            }
            userAndGroupsSelected.userGroupAccesses.push(group);
          }
          else{
            if (userAndGroupsSelected.userGroupAccesses[_group].access==="r-------") {
              userAndGroupsSelected.userGroupAccesses[_group].access ="r-------";
            }
          }
        })


        nList.push(obSelected);
        if(inx===values.selected.length-1){
        this.setState(
        {
          objectSelectedview:values.selected,
          objectSelected: nList,
          messajeError: "",
          userAndGroupsSelected:userAndGroupsSelected
        });
        }
      }catch(e){
        console.log(e);
      }
      })
    }
  else{
    this.setState(
      {
        objectSelectedview:values.selected,
        objectSelected: nList,
        messajeError: "",
        userAndGroupsSelected:userAndGroupsSelected
      });
  }
  }

  handleListSelected(list, CallBackFnSelected) {
    const listSelected = document.getElementById(list).selectedOptions;
    for (var option = 0; option < listSelected.length; option++) {
      CallBackFnSelected(listSelected[option].value)
    }
  }
  HandleClickButton(data) {
    let access = { "--": 0, "r-": 1, "rw": 2 }
    this.setState({ PublicAccess: data.value });
  }
  handleClose() {
    this.setState({ openModal: false });
  };
  handleOpen() {
    this.setState({ openModal: true });
  };
  fillListObject(listObject) {
    //convert object to array
    const rowRaw = Object.values(listObject);
    return rowRaw.map((row) => {
      return (
        {
            label: row.displayName,
            value: row.id, visible: true,
            externalAccess:row.externalAccess,
            publicAccess:row.publicAccess,
            userAccesses:row.userAccesses,
            userGroupAccesses:row.userGroupAccesses
        }
      )
    })

  }

  handleTogle(event) {
    if (event == this.state.togSelected)
      if (event == 'keep')
        event = 'overwrite'
      else
        event = 'keep'

    this.setState({ togSelected: event })

  }
  handleExternalAccess() {
    if (this.state.ExternalAccess)
      this.setState({ ExternalAccess: false });
    else
      this.setState({ ExternalAccess: true });

  }
  exitEditMode() {
    this.setState({
      objectSelected: [],
      userAndGroupsSelected: {
        userAccesses: [],
        userGroupAccesses: []
      },
      PublicAccess: 0,
      ExternalAccess: false,
      stepIndex: 0,
      finished: false
    });
    this.handleRemoveAll();
    this.props.handleChangeTabs(undefined,"view",1);
  }

  GroupSelected(selected) {
    this.setState({ userAndGroupsSelected: selected });
  }
  onChangeTransfer(value) {
    

  }
  onEndReachedTransfer(){
    this.setState({loading:true});
    this.props.reloadData(this.state.page);
    
  }
  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <div style={styles.containterList}>

              <Transfer
                  onChange={this.handleList.bind(this)}
                  options={this.state.objectAvailable}
                  selected={this.state.objectSelectedview}
                  onEndReached={this.onEndReachedTransfer.bind(this)}
                  loading={this.state.loading}
              />
            </div>
            <div style={styles.containterBtnAcction}>
              <div style={styles.ButtonLeftAling}>
                <Button onClick={this.handleSelectAll.bind(this)} labelColor={styles.ButtonActived.textColor} backgroundColor={styles.ButtonActived.backgroundColor} style={styles.ButtonSelect}  variant="outlined">{i18n.t(" ASSING All (")+ this.props.pager.total + ") →"}</Button>
              </div>
            </div>

          </div>
        )
      case 1:       
        return (

            <div style={styles.containterStrategy}>              
             
                <Paper style={styles.papers}>
                  <div style={styles.subtitles}>{i18n.t("Strategy to save Sharing Setting to all object selected")}</div>
                  <Divider />
                  <div style={styles.bodypaper}>
                    <CustomDataProvider
                          data={{
                              sharing: {
                                  meta: {
                                      allowExternalAccess: true,
                                      allowPublicAccess: true
                                  },
                                  object: this.state.userAndGroupsSelected                     
                              },
                              'sharing/search':Object.assign({}, this.state.usersAndgroups, this.state.userAndGroupsSelected)                 
                          }}
                      >
                      <div style={{height:400,maxHeight:400,overflowX: 'hidden',overflowY: 'auto'}}>
                        <SharingDialog id={this.state.userAndGroupsSelected.id} sharingSettingObject={this.state.userAndGroupsSelected} onClose={()=>this.handleClose()} type={this.props.resource.resource} modal={false} callback={this.setObjectSetting.bind(this)} allowExternalAccess={this.props.informationResource.authorities.find(a=>a.type==="EXTERNALIZE")!==undefined?true:false} removeAll={this.removeAll.bind(this)}/>
                      </div>
                    </CustomDataProvider>
                    <FormGroup>
                        <FormControlLabel control={<Switch
                              defaultchecked={true}
                              onChange={() => this.handleTogle("overwrite")}
                              checked={(this.state.togSelected == "overwrite" ? true : false)}
                            />} label={i18n.t("Overwrite Sharing settings")} />
                        <FormControlLabel control={<Switch
                              onChange={() => this.handleTogle("keep")}
                              checked={(this.state.togSelected == "keep" ? true : false)}
                            />} label={i18n.t("Merge with current Sharing settings")} />
                    </FormGroup>                     
                    
                  </div>
                </Paper>

            </div>


        );
      case 2:
        return (
          <div style={{textAlign:"center"}}>
            <CircularProgress size={80} thickness={5} />
          </div>
        )
      default:
        return 'Write to hispColombia heldersoft@gmail.com';
    }
  }
  async componentDidMount() { 
    this.setState({usersAndgroups: await  this.getUsersandGroups()});
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.listObject != this.props.listObject && Object.values(this.props.listObject).length > 0) {
      let tempObjectAvailable=this.state.objectAvailable;
      let nvalue=this.fillListObject(this.props.listObject);
      let foundOb=tempObjectAvailable.find(x => x.value === nvalue[0].value);

      if(this.state.assingall==true){
        let objectAvailable=tempObjectAvailable.concat(nvalue);
         let selected=nvalue.map(n=>n.value);
        this.handleList({selected,objectAvailable});
      }

      if( foundOb === undefined && this.props.originSearch ==="bulklist"){
        //include object selected in list
        this.state.objectSelected.forEach((obj)=>{
          if(tempObjectAvailable.find(x => x.value === obj.value)===undefined){
            tempObjectAvailable.push(obj);
          }
        })
        let objectAvailable=tempObjectAvailable.concat(nvalue);
        this.setState({ objectAvailable,page:this.state.page+1,loading:false,assingall:false });

      }
      else{
        //include object selected in list
        this.state.objectSelected.forEach((obj)=>{
          if(nvalue.find(x => x.value === obj.value)===undefined){
            nvalue.push(obj);
          }
        })

        this.setState({objectAvailable:nvalue,page:this.state.page+1,loading:false,assingall:false});
      }     
      
    }
  }
  render() {
    const { finished, stepIndex } = this.state;
    const contentStyle = { height:400, margin: '0 16px' };
    return (
      <div>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>{i18n.t("Select the Object")}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{i18n.t("Define sharing and access options")}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{i18n.t("Summary")}</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {finished ? (
            <div>
              {i18n.t("Number of objects updated")} : <span style={{ "fontWeight": "bold" }}><Avatar>{this.state.messajeSuccessful.numImported}</Avatar></span>
              <br />
              {i18n.t("Number of objects don't updated")} : <span style={{ "fontWeight": "bold" }}> <Avatar  backgroundColor={styles.errorMessaje.color}>{this.state.messajeSuccessful.numNoImported}</Avatar></span>
           
              <br />
              <div style={styles.divConcentTable}>
                <Table> <TableBody displayRowCheckbox={false} showRowHover={false}>
                  {this.state.messajeSuccessful.obImported.map((val) => {
                    return (<TableRow key={val.label} style={val.status=="OK"?{}:{background:styles.errorMessaje.color}}>
                      <TableCell>
                        {val.label}
                      </TableCell>
                      <TableCell>
                    ({val.status}) {val.message}
                      </TableCell>
                    </TableRow>)
                  })}
                </TableBody></Table>
              </div>
              <div style={{ marginTop: 12, textAlign: 'center' }}>
                <Button
                  primary={true}
                  onClick={this.exitEditMode.bind(this)}
                >
                  {i18n.t("FINISH")}
                </Button>
              </div>


            </div>
          ) : (
              <div>
                {this.getStepContent(stepIndex)}
                <div style={{ marginTop: 12, textAlign: 'center', color: "Red" }}>
                  <p>{this.state.messajeError}</p>
                </div>
                <div style={{ marginTop: 12, textAlign: 'center' }}>
                  <Button
                    primary={true}
                    disabled={stepIndex === 3}
                    onClick={() => this.exitEditMode()}
                  >
                    {i18n.t("CANCEL")}
                    </Button>
                  <Button
                    disabled={stepIndex === 0 || stepIndex === 3}
                    onClick={this.handlePrev.bind(this)}
                    style={{ marginRight: 12 }}
                  >
                    {i18n.t("BACK")}
                  </Button>
                  <Button
                    primary={true}
                    disabled={stepIndex === 3}
                    onClick={stepIndex === 2 ? this.saveSetting.bind(this) : this.handleNext.bind(this)}
                    variant="contained"
                  >
                    {stepIndex === 2 ? i18n.t("SAVE SETTING") : i18n.t(" NEXT")}
                    </Button>
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
};

export default BulkMode;