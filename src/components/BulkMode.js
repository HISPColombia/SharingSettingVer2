import React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import Toggle from 'material-ui/Toggle';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

//Component
import ListSelect from './ListSelect.component';
import appTheme from '../theme';
import ListGroups from './ListGroups';
import SpecialButton from './SpecialButton';


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
    backgroundColor: appTheme.palette.accent1Color,
    textColor: appTheme.palette.alternateTextColor
  },
  iconColor: appTheme.settingOptions.icon,
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
  toggleExternal: {
    marginRight: 50,
    marginLeft: 20
  },
  divConcentTable: {
    height: 400,
    overflow: 'auto'
  },
  errorMessaje:{
    color:appTheme.palette.error
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
    const d2 = this.props.d2;
    const api = d2.Api.getApi();
    try {
      let res = await api.post(urlAPI, Payload);
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
      this.setState({ messajeError: this.props.d2.i18n.getTranslation("MESSAGE_ERROR_SELECT_OBJECT") });
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
    this.props.handleChangeTabs("view")
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
                <RaisedButton onClick={() => this.handleListSelected('ListAvailable', this.handleList.bind(this))} label="→" style={styles.ButtonSelect} />
                <RaisedButton onClick={() => this.handleListSelected('ListSelected', this.handleDesSelect.bind(this))} label="←" labelColor={styles.ButtonActived.textColor} backgroundColor={styles.ButtonActived.backgroundColor} style={styles.ButtonSelect} />
              </div>
              <div style={styles.ItemsList}>
                <ListSelect id={"ListSelected"} filterString={""} searchByName={""} source={this.state.objectSelected} onItemDoubleClick={this.handleDesSelect.bind(this)} listStyle={styles.list} size={10} />
              </div>
              <div style={styles.ItemMiddleButton}>
              </div>

            </div>
            <div style={styles.containterList}>

              <div style={styles.ButtonLeftAling}>
                <RaisedButton onClick={this.handleSelectAll.bind(this)} label={d2.i18n.getTranslation("BTN_ASIGN_ALL") + "→"} labelColor={styles.ButtonActived.textColor} backgroundColor={styles.ButtonActived.backgroundColor} style={styles.ButtonSelect} />
              </div>
              <div style={styles.ItemMiddleButton}>  </div>
              <div style={styles.ButtonRightAling}>
                <RaisedButton onClick={this.handleRemoveAll.bind(this)} label={d2.i18n.getTranslation("BTN_REMOVE_ALL") + "←"} labelColor={styles.ButtonActived.textColor} backgroundColor={styles.ButtonActived.backgroundColor} style={styles.ButtonSelect} />
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
                  <div style={styles.subtitles}>{d2.i18n.getTranslation("SUBTITLE_STRATEGY")}</div>
                  <Divider />
                  <div style={styles.bodypaper}>
                    <Toggle
                      label={d2.i18n.getTranslation("OPTION_OVERWRITE")}
                      defaultToggled={true}
                      onToggle={() => this.handleTogle("overwrite")}
                      toggled={(this.state.togSelected == "overwrite" ? true : false)}
                    />
                    <Toggle
                      label={d2.i18n.getTranslation("OPTION_KEEP")}
                      onToggle={() => this.handleTogle("keep")}
                      toggled={(this.state.togSelected == "keep" ? true : false)}
                    />
                  </div>
                </Paper>
              </div>
              <Paper style={styles.papers}>
                <div style={styles.subtitles}>{d2.i18n.getTranslation("SUBTITLE_PUBLIC")}</div>
                <Divider />
                <div style={styles.ItemsStrategy}>
                  <div style={styles.bodypaper2}>
                    <div style={styles.ItemsStrategy}>{d2.i18n.getTranslation("OPTION_PUBLICACCESS")}</div>

                    <SpecialButton id={"PUB01"} color={styles.iconColor} callBackHandleClick={this.HandleClickButton.bind(this)} type={"PUBLICACCESS"} enabled={true} defaultValue={this.state.PublicAccess} />
                  </div>
                </div>
                <div style={styles.toggleExternal}>

                  <Toggle
                    label={d2.i18n.getTranslation("OPTION_EXTERNALACCESS")}
                    onToggle={() => this.handleExternalAccess()}
                    toggled={(this.state.ExternalAccess)}
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
            <StepLabel>{d2.i18n.getTranslation("STEP_1")}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{d2.i18n.getTranslation("STEP_2")}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{d2.i18n.getTranslation("STEP_3")}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{d2.i18n.getTranslation("STEP_4")}</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {finished ? (
            <div>
              {d2.i18n.getTranslation("LABEL_NUMBER_OBJECT_UPDATED")} : <span style={{ "fontWeight": "bold" }}><Avatar>{this.state.messajeSuccessful.numImported}</Avatar></span>
              <br />
              {d2.i18n.getTranslation("LABEL_NUMBER_OBJECT_NOUPDATED")} : <span style={{ "fontWeight": "bold" }}> <Avatar  backgroundColor={styles.errorMessaje.color}>{this.state.messajeSuccessful.numNoImported}</Avatar></span>
           
              <br />
              <div style={styles.divConcentTable}>
                <Table> <TableBody displayRowCheckbox={false} showRowHover={false}>
                  {this.state.messajeSuccessful.obImported.map((val) => {
                    return (<TableRow key={val.label} style={val.status=="OK"?{}:{background:styles.errorMessaje.color}}>
                      <TableRowColumn>
                        {val.label}
                      </TableRowColumn>
                      <TableRowColumn>
                    ({val.status}) {val.message}
                      </TableRowColumn>
                    </TableRow>)
                  })}
                </TableBody></Table>
              </div>
              <div style={{ marginTop: 12, textAlign: 'center' }}>
                <RaisedButton
                  label={d2.i18n.getTranslation("BTN_FINISH")}
                  primary={true}
                  onClick={this.exitEditMode.bind(this)}
                />
              </div>


            </div>
          ) : (
              <div>
                {this.getStepContent(stepIndex)}
                <div style={{ marginTop: 12, textAlign: 'center', color: "Red" }}>
                  <p>{this.state.messajeError}</p>
                </div>
                <div style={{ marginTop: 12, textAlign: 'center' }}>
                  <FlatButton
                    label={d2.i18n.getTranslation("BTN_CANCEL")}
                    primary={true}
                    disabled={stepIndex === 3}
                    onClick={() => this.exitEditMode()}
                  />
                  <FlatButton
                    label={d2.i18n.getTranslation("BTN_BACK")}
                    disabled={stepIndex === 0 || stepIndex === 3}
                    onClick={this.handlePrev.bind(this)}
                    style={{ marginRight: 12 }}
                  />

                  <RaisedButton
                    label={stepIndex === 2 ? d2.i18n.getTranslation("BTN_SAVE") : d2.i18n.getTranslation("BTN_NEXT")}
                    primary={true}
                    disabled={stepIndex === 3}
                    onClick={stepIndex === 2 ? this.saveSetting.bind(this) : this.handleNext.bind(this)}
                  />
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
};
BulkMode.propTypes = {
  d2: React.PropTypes.object.isRequired,
  listObject: React.PropTypes.object,
  pager: React.PropTypes.object,
  searchByName: React.PropTypes.string,
  filterString: React.PropTypes.string,
  resource: React.PropTypes.object,
  handleChangeTabs: React.PropTypes.func
};

export default BulkMode;