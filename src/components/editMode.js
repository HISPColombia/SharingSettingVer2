import React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ListSelect from './ListSelect.component';
import appTheme from '../theme';
import ListGroups from './ListGroups';
const styles={
    list:{
        border:"none",
        fontFamily:"Roboto",
        fontSize:13,
        height:"250px",
        minHeight:"50px",
        outline:"none",
        width:"100%",
        overflowX: 'auto'
    },
    containterList: {
        display: 'grid',
        gridTemplateColumns: '42% 10% 42% 6%',
        gridTemplateRows: 'auto'
      },
      ItemsList: {
         alignSelf: 'center'
      },
      ItemMiddleButton: {
        alignSelf: 'center',
        placeSelf: 'center'
     },
     ButtonSelect:{
        margin:5
     },
     ButtonRightAling:{
        margin:5,
        justifySelf: 'end'
     },
     ButtonLeftAling:{
        margin:5,
        justifySelf: 'start'
     },
     ButtonActived:{
        backgroundColor:appTheme.palette.accent1Color,
        textColor:appTheme.palette.alternateTextColor
     }

}
class EditMode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            finished: false,
            stepIndex: 0,
            objectAvailable:[],
            objectSelected:[]
    }
  };

  handleNext () {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  };

  handlePrev () {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };
  handleRemoveAll(){
    let aList=this.state.objectAvailable;    
    for (var k =0; k < aList.length; k++){        
            aList[k].visible=true;        
    }
     this.setState(
        {
            objectAvailable:aList,
            objectSelected:[]
        });
  }
  handleSelectAll(){

    let aList=this.state.objectAvailable;    
    for (var k =0; k < aList.length; k++){        
            aList[k].visible=false;        
    }
     this.setState(
        {
            objectAvailable:aList,
            objectSelected:this.state.objectAvailable
        });
  }
  handleList(val){
      let obSelected={
        label:this.props.listObject[val].displayName,
        value:this.props.listObject[val].id
    };
    //Add Object Selected
    let nList=this.state.objectSelected;
    nList.push(obSelected);
    this.setState(
        {
            objectSelected:nList
        });
    //Remove Object Selected
    let aList=this.state.objectAvailable;    
    for (var k =0; k < aList.length; k++){
        if (aList[k].value === val) {
            aList[k].visible=false;
        }
    }
     this.setState(
        {
            objectAvailable:aList
        });

  }
  handleDesSelect(val){
    let obSelected={
      label:this.props.listObject[val].displayName,
      value:this.props.listObject[val].id
  };
  //Add Object Selected
  let nList=this.state.objectAvailable;    
    for (var k =0; k < nList.length; k++){
        if (nList[k].value === val) {
            nList[k].visible=true;
        }
    }
     this.setState(
        {
            objectAvailable:nList
        });
  //Remove Object Selected
  let aList=this.state.objectSelected;    
  for (var k =0; k < aList.length; k++){
      if (aList[k].value === val) {
          aList.splice(k,1);
      }
  }
   this.setState(
      {
        objectSelected:aList
      });

}

handleListSelected(list,CallBackFnSelected){
  const listSelected=document.getElementById(list).selectedOptions;
    for(var option=0;option<listSelected.length;option++){
      CallBackFnSelected(listSelected[option].value)    
    }
}
 fillListObject(listObject){
     //convert object to array
     const rowRaw = Object.values(listObject);
     return rowRaw.map((row)=> {
         return(  
            {label:row.displayName,value:row.id,visible:true} 
         )
     })
    
 }
componentDidUpdate(prevProps,prevState){
   if(prevProps.listObject!=this.props.listObject)
    this.setState({objectAvailable:this.fillListObject(this.props.listObject)});
}
  getStepContent(stepIndex) {
    const d2 = this.props.d2;
    switch (stepIndex) {
      case 0:
        return (
            <div>
                <div style={styles.containterList}>
            
                    <div style={styles.ItemsList}>
                        <ListSelect id={"ListAvailable"} source={this.state.objectAvailable.filter((obj)=>obj.visible==true)} onItemDoubleClick={this.handleList.bind(this)} listStyle={styles.list} size={10} />
                    </div>
                    <div style={styles.ItemMiddleButton}>
                        <RaisedButton onClick={()=>this.handleListSelected('ListAvailable',this.handleList.bind(this))} label="→" style={styles.ButtonSelect} />
                        <RaisedButton onClick={()=>this.handleListSelected('ListSelected',this.handleDesSelect.bind(this))} label="←" labelColor={styles.ButtonActived.textColor} backgroundColor={styles.ButtonActived.backgroundColor} style={styles.ButtonSelect}/>
                    </div>
                    <div style={styles.ItemsList}>
                        <ListSelect id={"ListSelected"} source={this.state.objectSelected} onItemDoubleClick={this.handleDesSelect.bind(this)} listStyle={styles.list} size={10}/>
                    </div>
                    <div style={styles.ItemMiddleButton}>
                    </div>
                                
                </div>
                <div style={styles.containterList}>
            
                    <div style={styles.ButtonLeftAling}>
                         <RaisedButton onClick={this.handleSelectAll.bind(this)} label={d2.i18n.getTranslation("BTN_ASIGN_ALL")+"→"} labelColor={styles.ButtonActived.textColor} backgroundColor={styles.ButtonActived.backgroundColor} style={styles.ButtonSelect}/>
                    </div>
                    <div style={styles.ItemMiddleButton}>  </div>
                    <div style={styles.ButtonRightAling}>
                        <RaisedButton onClick={this.handleRemoveAll.bind(this)} label={d2.i18n.getTranslation("BTN_REMOVE_ALL")+"←"} labelColor={styles.ButtonActived.textColor} backgroundColor={styles.ButtonActived.backgroundColor} style={styles.ButtonSelect}/>
                    </div>
                    <div style={styles.ItemMiddleButton}></div>
                   </div>
                
            </div>
            )
      case 1:
        return  (
          <ListGroups d2={d2}/>
        )
            
      case 2:
        return d2.i18n.getTranslation("STEP_3");
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};
    const d2 = this.props.d2;
    return (
      <div style={{width: '100%', maxWidth: '90%', margin: 'auto'}}>
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
        </Stepper>
        <div style={contentStyle}>
          {finished ? (
            <p>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({stepIndex: 0, finished: false});
                }}
              >
                Click here
              </a> to reset the example.
            </p>
          ) : (
            <div>
              {this.getStepContent(stepIndex)}
              <div style={{marginTop: 12,textAlign:'center'}}>
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onClick={this.handlePrev.bind(this)}
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  label={stepIndex === 2 ? 'Finish' : 'Next'}
                  primary={true}
                  onClick={this.handleNext.bind(this)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};
EditMode.propTypes = {
    d2: React.PropTypes.object.isRequired,
    listObject: React.PropTypes.object,
    pager: React.PropTypes.object
  };

export default EditMode;