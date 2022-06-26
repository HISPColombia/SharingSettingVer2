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
import { post } from '../API/Dhis2.js';


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
    height: 250,
    width: '90%',
    margin: 20,
    padding: 30,
    textAlign: 'left',
    display: 'inline-block',
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
      openModal:false
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
       //filter only visible true
    let NewObSelected=this.state.objectAvailable.filter((obj)=>{
      if (((obj.label.includes(this.props.searchByName) == true) && (this.props.filterString.includes(obj.value)==true || this.props.filterString=="")))
        return true
      else
        return false

    });
    let currentSelected=this.state.objectSelected;
    NewObSelected=NewObSelected.concat(currentSelected);
    let aList = this.state.objectAvailable;

    //change visible false to all object
    for (var k = 0; k < aList.length; k++) {
      aList[k].visible = false;
    }
    this.setState(
      {
        
        objectAvailable: aList,
        objectSelected:NewObSelected,
        messajeError: ""
      });
  }

  handleList(val) {

    let obSelected = {
      label: this.props.listObject[val].displayName,
      value: this.props.listObject[val].id,
      externalAccess:this.props.listObject[val].externalAccess,
      publicAccess:this.props.listObject[val].publicAccess,
      userAccesses:this.props.listObject[val].userAccesses,
      userGroupAccesses:this.props.listObject[val].userGroupAccesses
    };
    //Add Object Selected
    let nList = this.state.objectSelected;
    let nListview=this.state.objectSelectedview;
    nList.push(obSelected);
    nList.push(nListview);
    this.setState(
      {
        objectSelectedview:nListview,
        objectSelected: nList,
        messajeError: ""
      });
    //Remove Object Selected
    let aList = this.state.objectAvailable;
    for (var k = 0; k < aList.length; k++) {
      if (aList[k].value === val) {
        aList[k].visible = false;
      }
    }
    this.setState(
      {
        objectAvailable: aList
      });

  }
  handleDesSelect(val) {
    let obSelected = {
      label: this.props.listObject[val].displayName,
      value: this.props.listObject[val].id,
      externalAccess:this.props.listObject[val].externalAccess,
      publicAccess:this.props.listObject[val].publicAccess,
      userAccesses:this.props.listObject[val].userAccesses,
      userGroupAccesses:this.props.listObject[val].userGroupAccesses
    };
    //Add Object Selected
    let nList = this.state.objectAvailable;
    for (var k = 0; k < nList.length; k++) {
      if (nList[k].value === val) {
        nList[k].visible = true;
      }
    }
    this.setState(
      {
        objectAvailable: nList,
        messajeError: ""

      });
    //Remove Object Selected
    let aList = this.state.objectSelected;
    for (var k = 0; k < aList.length; k++) {
      if (aList[k].value === val) {
        aList.splice(k, 1);
      }
    }
    this.setState(
      {
        objectSelected: aList
      });

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
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.listObject != this.props.listObject)
      this.setState({ objectAvailable: this.fillListObject(this.props.listObject) });
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
  onEndReachedTransfer(){}
  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <div style={styles.containterList}>

              {/* <div style={styles.ItemsList}>
                <ListSelect id={"ListAvailable"} filterString={this.props.filterString} searchByName={this.props.searchByName} source={this.state.objectAvailable.filter((obj) => obj.visible == true)} onItemDoubleClick={this.handleList.bind(this)} listStyle={styles.list} size={10} />
              </div>
              <div style={styles.ItemMiddleButton}>
                <Button onClick={() => this.handleListSelected('ListAvailable', this.handleList.bind(this))} style={styles.ButtonSelect} variant="outlined">→</Button>
                <Button onClick={() => this.handleListSelected('ListSelected', this.handleDesSelect.bind(this))} labelColor={styles.ButtonActived.textColor} backgroundColor={styles.ButtonActived.backgroundColor} style={styles.ButtonSelect} variant="outlined" >←</Button>
              </div>
              <div style={styles.ItemsList}>
                <ListSelect id={"ListSelected"} filterString={""} searchByName={""} source={this.state.objectSelected} onItemDoubleClick={this.handleDesSelect.bind(this)} listStyle={styles.list} size={10} />
              </div>
              <div style={styles.ItemMiddleButton}>
              </div> */}
              <Transfer
                  onChange={(values)=>values.selected.forEach(value=>this.handleList(value))}//
                  onEndReached={this.onEndReachedTransfer}
                  options={this.state.objectAvailable.filter((obj) => obj.visible == true)}
                  selected={this.state.objectSelectedview}
              />
            </div>
            <div style={styles.containterBtnAcction}>

              <div style={styles.ButtonLeftAling}>
                <Button onClick={this.handleSelectAll.bind(this)} labelColor={styles.ButtonActived.textColor} backgroundColor={styles.ButtonActived.backgroundColor} style={styles.ButtonSelect}  variant="outlined">{i18n.t(" ASSING All (")+ this.props.pager.total + ") →"}</Button>
              </div>
              <div style={styles.ItemMiddleButton}>  </div>
              <div style={styles.ButtonRightAling}>
                <Button onClick={this.handleRemoveAll.bind(this)} labelColor={styles.ButtonActived.textColor} backgroundColor={styles.ButtonActived.backgroundColor} style={styles.ButtonSelect} variant="outlined">{i18n.t(" REMOVE All") + "←"}</Button>
              </div>
              <div style={styles.ItemMiddleButton}></div>
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
                  'sharing/search': {
                      userGroups: [
                          {
                              displayName: 'Administrators',
                              id: 'wl5cDMuUhmF',
                              name: 'Administrators'
                          },
                          {
                              displayName: 'System administrators',
                              id: 'lFHP5lLkzVr',
                              name: 'System administrators'
                          },
                          {
                              displayName: '_DATASET_System administrator (ALL)',
                              id: 'zz6XckBrLlj',
                              name: '_DATASET_System administrator (ALL)'
                          },
                          {
                              displayName: '_PROGRAM_MNCH / PNC (Adult Woman) program',
                              id: 'vRoAruMnNpB',
                              name: '_PROGRAM_MNCH / PNC (Adult Woman) program'
                          },
                          {
                              displayName: '_PROGRAM_System administrator (ALL)',
                              id: 'pBnkuih0c1K',
                              name: '_PROGRAM_System administrator (ALL)'
                          }
                      ],
                      users: [
                          {
                              displayName: 'John Traore',
                              id: 'xE7jOejl9FI',
                              name: 'John Traore'
                          }
                      ]
                  }
              }}
          >
          {/* <IndividualSharingSetting d2={d2} GroupSelected={this.GroupSelected.bind(this)} resource={this.props.resource} currentSelected={this.state.userAndGroupsSelected} /> */}
            
            <SharingDialog id="dBduvfRBM6C" onClose={()=>this.handleClose()} type="dataElement" onSave={()=>console.log("TErminó")} modal={false} />            
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

  render() {
    const { finished, stepIndex } = this.state;
    const contentStyle = { height:400, margin: '0 16px' };
    return (
      <div style={{ width: '100%', maxWidth: '90%', margin: 'auto' }}>
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