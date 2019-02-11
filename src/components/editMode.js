import React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import ListSelect from 'd2-ui/lib/list-select/ListSelect.component';
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';

import appTheme from '../theme';

const styles={
    list:{
        border:"none",
        fontFamily:"Roboto",
        fontSize:13,
        height:"250px",
        minHeight:"50px",
        outline:"none",
        width:"100%"
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
            aList.splice(k,1);
        }
    }
     this.setState(
        {
            objectAvailable:aList
        });

  }
 fillListObject(listObject){
     //convert object to array
     const rowRaw = Object.values(listObject);
     return rowRaw.map((row)=> {
         return(  
            {label:row.displayName,value:row.id} 
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
                        <ListSelect source={this.state.objectAvailable} onItemDoubleClick={this.handleList.bind(this)} listStyle={styles.list} size={10}/>
                    </div>
                    <div style={styles.ItemMiddleButton}>
                        <RaisedButton label="→" style={styles.ButtonSelect} />
                        <RaisedButton label="←" labelColor={styles.ButtonActived.textColor} backgroundColor={styles.ButtonActived.backgroundColor} style={styles.ButtonSelect}/>
                    </div>
                    <div style={styles.ItemsList}>
                        <ListSelect source={this.state.objectSelected} onItemDoubleClick={this.handleList} listStyle={styles.list} size={10}/>
                    </div>
                    <div style={styles.ItemMiddleButton}>
                        <IconButton tooltip="SVG Icon">
                            <ArrowUpward />
                            <ArrowDownward/>  
                        </IconButton>
                    </div>
                                
                </div>
                <div style={styles.containterList}>
            
                    <div style={styles.ButtonLeftAling}>
                         <RaisedButton label={d2.i18n.getTranslation("BTN_ASIGN_ALL")+"→"} labelColor={styles.ButtonActived.textColor} backgroundColor={styles.ButtonActived.backgroundColor} style={styles.ButtonSelect}/>
                    </div>
                    <div style={styles.ItemMiddleButton}>  </div>
                    <div style={styles.ButtonRightAling}>
                        <RaisedButton label={d2.i18n.getTranslation("BTN_REMOVE_ALL")+"←"} labelColor={styles.ButtonActived.textColor} backgroundColor={styles.ButtonActived.backgroundColor} style={styles.ButtonSelect}/>
                    </div>
                    <div style={styles.ItemMiddleButton}></div>
                    </div>
                
            </div>
            )
      case 1:
        return  d2.i18n.getTranslation("STEP_2");
            
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
              <div style={{marginTop: 12}}>
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