import React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Switch from '@mui/material/Switch';
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


import Avatar from '@mui/material/Avatar';

import CircularProgress from '@mui/material/CircularProgress';

//Component
import ListSelect from './ListSelect.component';
import appTheme from '../theme';
import ListGroups from './ListGroups';
import SpecialButton from './SpecialButton';
//dhis2
import i18n from '../locales/index.js'
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
    display: 'grid',
    gridTemplateColumns: '42% 10% 42% 6%',
    gridTemplateRows: 'auto'
  },
  containterStrategy: {
    display: 'grid',
    gridTemplateColumns: '10% 40% 40% 10%',
    gridTemplateRows: 'auto'
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
    height: 200,
    width: 400,
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
      togSelected: "overwrite",
      messajeError: "",
      messajeSuccessful: {},
      userAndGroupsSelected: {
        userAccesses: [],
        userGroupAccesses: []
      },
      PublicAccess: 0,
      ExternalAccess: false
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
    nList.push(obSelected);
    this.setState(
      {
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
  getStepContent(stepIndex) {
    const d2 = this.props.d2;
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <div style={styles.containterList}>

              <div style={styles.ItemsList}>
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
              </div>

            </div>
            <div style={styles.containterList}>

              <div style={styles.ButtonLeftAling}>
                <Button onClick={this.handleSelectAll.bind(this)} labelColor={styles.ButtonActived.textColor} backgroundColor={styles.ButtonActived.backgroundColor} style={styles.ButtonSelect}  variant="outlined">{i18n.t(" ASING All") + "→"}</Button>
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
          <ListGroups d2={d2} GroupSelected={this.GroupSelected.bind(this)} resource={this.props.resource} currentSelected={this.state.userAndGroupsSelected} />
        )

      case 2:
        return (
          <div>
            <div style={styles.containterStrategy}>
              <div style={styles.ItemsStrategy}>

              </div>
              <div style={styles.ItemsStrategy}>
                <Paper style={styles.papers}>
                  <div style={styles.subtitles}>{i18n.t("Strategy to save Sharing Setting to all object selected")}</div>
                  <Divider />
                  <div style={styles.bodypaper}>
                    <Switch
                      label={i18n.t("Overwrite Sharing settings")}
                      defaultchecked={true}
                      onChange={() => this.handleTogle("overwrite")}
                      checked={(this.state.togSelected == "overwrite" ? true : false)}
                    />
                    <Switch
                      label={i18n.t("Merge with current Sharing settings")}
                      onChange={() => this.handleTogle("keep")}
                      checked={(this.state.togSelected == "keep" ? true : false)}
                    />
                  </div>
                </Paper>
              </div>
              <Paper style={styles.papers}>
                <div style={styles.subtitles}>{i18n.t("Setting public and external access to all object selected")}</div>
                <Divider />
                <div style={styles.ItemsStrategy}>
                  <div style={styles.bodypaper2}>
                    <div style={styles.ItemsStrategy}>{i18n.t("Setting public Access")}</div>

                    <SpecialButton id={"PUB01"} color={styles.iconColor} callBackHandleClick={this.HandleClickButton.bind(this)} type={"PUBLICACCESS"} enabled={true} defaultValue={this.state.PublicAccess} />
                  </div>
                </div>
                <div style={styles.SwitchExternal}>

                  <Switch
                    label={i18n.t("Setting external Access")}
                    onChange={() => this.handleExternalAccess()}
                    checked={(this.state.ExternalAccess)}
                  />

                </div>
              </Paper>
            </div>

          </div>

        );
      case 3:
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
    const contentStyle = { margin: '0 16px' };
    const d2 = this.props.d2;
    return (
      <div style={{ width: '100%', maxWidth: '90%', margin: 'auto' }}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>{i18n.t("Select the Object")}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{i18n.t("Select the user and/or groups")}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{i18n.t("Define the strategy to setting")}</StepLabel>
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